// Conversion factors
const unitConversion = {
    gallons: 1,
    liters: 3.78541,        // 1 gallon = 3.78541 liters
    cubic_meters: 264.172   // 1 cubic meter = 264.172 gallons
};

const timeFrameConversion = {
    hours: 1 / 24,          // 1 hour = 1/24 days
    days: 1,                // 1 day = 1 day
    weeks: 7,               // 1 week = 7 days
    months: 30,             // Approximation: 1 month = 30 days
    years: 365,             // 1 year = 365 days
    custom: null            // Handled separately
};

// Initialize variables
let entityList = [];
let selectedUnit = 'gallons'; // Default unit
let numDays = 1;               // Default to 1 day

// Populate the entity dropdown based on the type
function populateEntityDropdown(entityType) {
    const entityNameSelect = document.getElementById("entity-name");
    entityNameSelect.innerHTML = '';

    let data = dailyWaterRequirements[entityType];
    for (const name in data) {
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        entityNameSelect.appendChild(option);
    }

    entityNameSelect.classList.remove("hidden");
    // Show the label for entity-name
    document.querySelector('label[for="entity-name"]').classList.remove("hidden");
}

// Add an entity to the list
function addEntity() {
    let entityType = document.getElementById("entity-type").value;
    let entityName = document.getElementById("entity-name").value;
    let quantity = parseInt(document.getElementById("entity-quantity").value);
    const feedbackMessage = document.getElementById("feedback-message");

    // Ensure the quantity is at least 1
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        document.getElementById("entity-quantity").value = quantity;
    }

    if (!entityName) {
        feedbackMessage.innerText = "Please select a valid type and enter a quantity.";
        feedbackMessage.style.visibility = "visible";
    } else {
        feedbackMessage.style.visibility = "hidden";

        let existingEntity = entityList.find(entity => entity.type === entityType && entity.name === entityName);
        if (existingEntity) {
            existingEntity.quantity += quantity;
        } else {
            entityList.push({ type: entityType, name: entityName, quantity: quantity });
        }

        updateOutput();
        document.getElementById("entity-quantity").value = '1'; // Reset the quantity to 1 after adding
    }
}

// Adjust quantity of an entity
function adjustQuantity(index, change) {
    entityList[index].quantity += change;
    if (entityList[index].quantity <= 0) {
        entityList.splice(index, 1);
    }
    updateOutput();
}

// Remove an entity from the list
function removeEntity(index) {
    entityList.splice(index, 1);
    updateOutput();
}

// Calculate the number of days based on selected time frame
function calculateNumDays() {
    let selectedUnitTime = document.getElementById("time-frame-unit").value;
    let quantityInput = document.getElementById("time-frame-quantity");
    let quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        quantityInput.value = quantity;
    }

    // Define maximum allowable values per unit to prevent unrealistic inputs
    const maxValues = {
        hours: 8760,      // 1 year
        days: 3650,       // 10 years
        weeks: 520,       // 10 years
        months: 120,      // 10 years
        years: 100,       // 100 years
        custom: 365       // 1 year
    };

    if (quantity > maxValues[selectedUnitTime]) {
        quantity = maxValues[selectedUnitTime];
        quantityInput.value = quantity;
        // Display inline error message instead of alert
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.innerText = `Maximum allowed for ${selectedUnitTime} is ${maxValues[selectedUnitTime]}.`;
        feedbackMessage.style.visibility = "visible";
    } else {
        // Hide feedback message if within limits
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.style.visibility = "hidden";
    }

    if (selectedUnitTime === "custom") {
        // For custom, treat the input as days
        numDays = quantity;
    } else {
        numDays = quantity * timeFrameConversion[selectedUnitTime];
    }

    updateOutput();
}

// Update the measurement unit display in the Supply Tracker
function updateMeasurementUnitDisplay() {
    // Update Supply Tracker Labels
    const supplyTracker = document.querySelector("#supply-tracker-body tr");
    if (supplyTracker) {
        supplyTracker.cells[0].innerText = `Water (${selectedUnit})`;
    }

    // Update Available Water Input Labels and Placeholders
    let availableWaterLabel = document.querySelector('label[for="available-water"]');
    if (availableWaterLabel) {
        availableWaterLabel.innerText = `Available Water (${selectedUnit}):`;
    }

    let availableWaterInput = document.getElementById("available-water");
    if (availableWaterInput) {
        availableWaterInput.placeholder = `Enter ${selectedUnit}`;
    }
}

// Update the total water requirement and breakdown
function updateOutput() {
    let breakdownBody = document.getElementById("breakdown-body");
    breakdownBody.innerHTML = "";

    let totalWaterDaily = 0;

    if (entityList.length === 0) {
        breakdownBody.innerHTML = `<tr><td colspan="7">No data available</td></tr>`;
        document.getElementById("total-water").innerText = "No entities added yet.";
        updateSupplyTracker(0);
        return;
    }

    entityList.forEach((entity, index) => {
        let data = dailyWaterRequirements[entity.type][entity.name];
        let dailyWaterNeed = data.water * entity.quantity; // Assuming 'data.water' is in gallons
        let totalForDays = dailyWaterNeed * numDays;

        let row = `
            <tr>
                <td>${entity.name}</td>
                <td>
                    <button onclick="adjustQuantity(${index}, -1)">-</button>
                    ${entity.quantity.toLocaleString()}
                    <button onclick="adjustQuantity(${index}, 1)">+</button>
                </td>
                <td>${data.weight.toLocaleString()}</td>
                <td>${data.water.toFixed(2).toLocaleString()}</td>
                <td>${dailyWaterNeed.toFixed(2).toLocaleString()}</td>
                <td>${totalForDays.toFixed(2).toLocaleString()}</td>
                <td><button onclick="removeEntity(${index})">Remove</button></td>
            </tr>
        `;
        breakdownBody.innerHTML += row;

        totalWaterDaily += dailyWaterNeed;
    });

    let totalWaterForSelectedDays = totalWaterDaily * numDays;

    // Convert total water to selected unit
    let convertedTotalWater = totalWaterForSelectedDays / unitConversion[selectedUnit];
    let convertedTotalDaily = totalWaterDaily / unitConversion[selectedUnit];

    // Format the number of days based on fractional or whole number
    let displayDays = numDays % 1 === 0 ? numDays : numDays.toFixed(2);

    document.getElementById("total-water").innerText = 
        `For the selected period of ${displayDays.toLocaleString()} days, you will need a total of ${convertedTotalWater.toFixed(2).toLocaleString()} ${selectedUnit} of water (${convertedTotalDaily.toFixed(2).toLocaleString()} ${selectedUnit} per day).`;

    updateSupplyTracker(totalWaterForSelectedDays);
}

// Update the supply tracker
function updateSupplyTracker(totalRequiredGallons) {
    // Convert totalRequiredGallons to selected unit
    let totalRequired = totalRequiredGallons / unitConversion[selectedUnit];
    document.getElementById("total-water-required").innerText = totalRequired.toFixed(2).toLocaleString();

    updateSupplyFulfilled();
}

// Update the supply fulfilled percentage
function updateSupplyFulfilled() {
    // Convert available supply to gallons for calculation
    let availableSupplyInput = parseFloat(document.getElementById("available-water").value) || 0;
    let availableSupplyGallons = availableSupplyInput * unitConversion[selectedUnit];

    let totalRequiredGallons = parseFloat(document.getElementById("total-water-required").innerText.replace(/,/g, '')) * unitConversion[selectedUnit];
    let percentageFulfilled = totalRequiredGallons === 0 ? 0 : (availableSupplyGallons / totalRequiredGallons) * 100;

    if (percentageFulfilled > 100) {
        percentageFulfilled = 100;
    }

    document.getElementById("supply-fulfilled-percentage").innerText = `${percentageFulfilled.toFixed(2)}%`;
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Initialization
    const userPreference = localStorage.getItem("theme");
    if (userPreference === "light") {
        document.body.classList.remove("dark-mode");
        document.querySelectorAll(".container, th, td, button").forEach(element => {
            element.classList.remove("dark-mode");
        });
    } else {
        document.body.classList.add("dark-mode");
        document.querySelectorAll(".container, th, td, button").forEach(element => {
            element.classList.add("dark-mode");
        });
    }

    // Populate entity dropdown with default type
    populateEntityDropdown("human");

    // Print button event
    document.getElementById("print-button").addEventListener("click", function () {
        window.print();
    });

    // Initialize duration
    calculateNumDays();

    // Initialize measurement unit display
    updateMeasurementUnitDisplay();
});

// Event listener for entity type change
document.getElementById("entity-type").addEventListener("change", function () {
    const entityType = this.value;
    populateEntityDropdown(entityType);
});

// Event listeners for duration selection
document.getElementById("time-frame-unit").addEventListener("change", calculateNumDays);
document.getElementById("time-frame-quantity").addEventListener("input", calculateNumDays);

// Event listener for measurement unit selection
document.getElementById("measurement-unit").addEventListener("change", function () {
    selectedUnit = this.value;
    updateMeasurementUnitDisplay();
    updateOutput(); // Recalculate and update the display
});

// Dark Mode Toggle Button
document.getElementById("dark-mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    document.querySelectorAll(".container, th, td, button, input, select").forEach(element => {
        element.classList.toggle("dark-mode");
    });

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});
