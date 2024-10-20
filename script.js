const dailyWaterRequirements = {
    human: {
        "Infant": { weight: 22, water: 0.3 },
        "Child": { weight: 70, water: 0.5 },
        "Teenager Male": { weight: 150, water: 1 },
        "Teenager Female": { weight: 125, water: 1 },
        "Adult Male": { weight: 190, water: 1 },
        "Adult Female": { weight: 160, water: 0.8 },
        "Pregnant Female": { weight: 165, water: 1 },
        "Elderly Male": { weight: 160, water: 1 },
        "Elderly Female": { weight: 140, water: 0.8 },
    },
    animal: {
        "Alpaca": { weight: 155, water: 1.5 },
        "Bison": { weight: 1600, water: 12.5 },
        "Buffalo": { weight: 2050, water: 12.5 },
        "Camel": { weight: 1100, water: 25 },
        "Chicken": { weight: 7.5, water: 0.075 },
        "Cow": { weight: 1500, water: 25 },
        "Duck": { weight: 6, water: 0.15 },
        // More animals...
    }
};

let entityList = [];
let numDays = parseInt(document.getElementById("days-select").value); // Set initial value based on dropdown

document.addEventListener("DOMContentLoaded", function () {
    // Apply default Dark Mode
    document.body.classList.add("dark-mode");
    document.querySelectorAll(".container, th, td, button").forEach(element => {
        element.classList.add("dark-mode");
    });

    // Apply user preference from local storage
    const userPreference = localStorage.getItem("theme");
    if (userPreference === "light") {
        document.body.classList.remove("dark-mode");
        document.querySelectorAll(".container, th, td, button").forEach(element => {
            element.classList.remove("dark-mode");
        });
    }

    populateEntityDropdown("human"); // Default to human types when the page loads
});

// Update entity type dropdown when selection changes
document.getElementById("entity-type").addEventListener("change", function () {
    const entityType = this.value;
    populateEntityDropdown(entityType);
});

// Function to populate the entity dropdown based on the type (human or animal)
function populateEntityDropdown(entityType) {
    const entityNameSelect = document.getElementById("entity-name");
    entityNameSelect.innerHTML = ''; // Clear the current options

    let data = dailyWaterRequirements[entityType];
    for (const name in data) {
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        entityNameSelect.appendChild(option);
    }

    entityNameSelect.classList.remove("hidden"); // Make the dropdown visible
}

// Update numDays when the dropdown selection changes
document.getElementById("days-select").addEventListener("change", (event) => {
    if (event.target.value === "custom") {
        document.getElementById("custom-days").style.display = "inline-block";
    } else {
        document.getElementById("custom-days").style.display = "none";
        numDays = parseInt(event.target.value);
        updateOutput();
    }
});

// Update numDays if custom days are selected
document.getElementById("custom-days").addEventListener("input", function () {
    let customValue = parseInt(this.value);
    if (customValue > 0 && customValue <= 365) {
        numDays = customValue;
        updateOutput();
    }
});

function addEntity() {
    let entityType = document.getElementById("entity-type").value;
    let entityName = document.getElementById("entity-name").value;
    let quantity = parseInt(document.getElementById("entity-quantity").value);
    const feedbackMessage = document.getElementById("feedback-message");

    if (!entityName || isNaN(quantity) || quantity < 1) {
        feedbackMessage.innerText = "Please select a valid type and enter a quantity.";
        feedbackMessage.style.visibility = "visible";
    } else {
        feedbackMessage.style.visibility = "hidden";

        // Check if the entity already exists in the entity list
        let existingEntity = entityList.find(entity => entity.type === entityType && entity.name === entityName);
        if (existingEntity) {
            existingEntity.quantity += quantity;  // Update the quantity if it already exists
        } else {
            // Add a new entity to the list if it doesn't exist
            entityList.push({ type: entityType, name: entityName, quantity: quantity });
        }

        updateOutput();

        // Clear quantity field for next input
        document.getElementById("entity-quantity").value = '';
    }
}

function updateOutput() {
    let breakdownBody = document.getElementById("breakdown-body");
    breakdownBody.innerHTML = "";

    let totalWaterDaily = 0;

    if (entityList.length === 0) {
        // Placeholder row for empty state
        breakdownBody.innerHTML = `
            <tr>
                <td colspan="7">No data available</td>
            </tr>
        `;
        // Placeholder text for total water requirement
        document.getElementById("total-water").innerText = "No entities added yet.";
        return;
    }

    entityList.forEach((entity, index) => {
        let data = dailyWaterRequirements[entity.type][entity.name];
        let dailyWaterNeed = data.water * entity.quantity;
        let totalForDays = dailyWaterNeed * numDays;

        // Add row to the breakdown table with rounded values
        let row = `
            <tr>
                <td>${entity.name}</td>
                <td>
                    <button onclick="adjustQuantity(${index}, -1)">-</button>
                    ${entity.quantity}
                    <button onclick="adjustQuantity(${index}, 1)">+</button>
                </td>
                <td>${data.weight}</td>
                <td>${data.water.toFixed(2)}</td>
                <td>${dailyWaterNeed.toFixed(2)}</td>
                <td>${totalForDays.toFixed(2)}</td>
                <td><button onclick="removeEntity(${index})">Remove</button></td>
            </tr>
        `;
        breakdownBody.innerHTML += row;

        // Update total daily water requirement
        totalWaterDaily += dailyWaterNeed;
    });

    // Calculate total water requirement for the entire selected period
    let totalWaterForSelectedDays = totalWaterDaily * numDays;

    // Update the Total Water Requirement display with rounded values
    document.getElementById("total-water").innerText = 
        `For the selected period of ${numDays} days, you will need a total of ${totalWaterForSelectedDays.toFixed(2)} gallons of water (${totalWaterDaily.toFixed(2)} gallons per day).`;
}

function adjustQuantity(index, change) {
    // Adjust the quantity of the entity at the given index
    entityList[index].quantity += change;

    // If the quantity becomes zero or negative, remove the entity from the list
    if (entityList[index].quantity <= 0) {
        entityList.splice(index, 1);
    }

    // Update the output after adjusting the quantity
    updateOutput();
}

function removeEntity(index) {
    // Remove the entity at the given index
    entityList.splice(index, 1);

    // Update the output after removing the entity
    updateOutput();
}

// Dark Mode Toggle Button
document.getElementById("dark-mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Toggle dark mode for all necessary elements
    document.querySelectorAll(".container, th, td, button").forEach(element => {
        element.classList.toggle("dark-mode");
    });

    // Store user's preference in local storage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});
