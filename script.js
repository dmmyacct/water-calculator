let entityList = [];
let numDays = parseInt(document.getElementById("days-select").value);

document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("dark-mode");
    document.querySelectorAll(".container, th, td, button").forEach(element => {
        element.classList.add("dark-mode");
    });

    const userPreference = localStorage.getItem("theme");
    if (userPreference === "light") {
        document.body.classList.remove("dark-mode");
        document.querySelectorAll(".container, th, td, button").forEach(element => {
            element.classList.remove("dark-mode");
        });
    }

    populateEntityDropdown("human");

    // Print button event
    document.getElementById("print-button").addEventListener("click", function () {
        window.print();
    });
});

document.getElementById("entity-type").addEventListener("change", function () {
    const entityType = this.value;
    populateEntityDropdown(entityType);
});

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
}

document.getElementById("days-select").addEventListener("change", (event) => {
    if (event.target.value === "custom") {
        document.getElementById("custom-days").style.display = "inline-block";
    } else {
        document.getElementById("custom-days").style.display = "none";
        numDays = parseInt(event.target.value);
        updateOutput();
    }
});

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
        let dailyWaterNeed = data.water * entity.quantity;
        let totalForDays = dailyWaterNeed * numDays;

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

        totalWaterDaily += dailyWaterNeed;
    });

    let totalWaterForSelectedDays = totalWaterDaily * numDays;
    document.getElementById("total-water").innerText = 
        `For the selected period of ${numDays} days, you will need a total of ${totalWaterForSelectedDays.toFixed(2)} gallons of water (${totalWaterDaily.toFixed(2)} gallons per day).`;

    updateSupplyTracker(totalWaterForSelectedDays);
}

function updateSupplyTracker(totalRequired) {
    document.getElementById("total-water-required").innerText = totalRequired.toFixed(2);
    updateSupplyFulfilled();
}

function updateSupplyFulfilled() {
    let totalRequired = parseFloat(document.getElementById("total-water-required").innerText);
    let availableSupply = parseFloat(document.getElementById("available-water").value) || 0;
    let percentageFulfilled = (availableSupply / totalRequired) * 100;

    if (percentageFulfilled > 100) {
        percentageFulfilled = 100;
    }

    document.getElementById("supply-fulfilled-percentage").innerText = `${percentageFulfilled.toFixed(2)}%`;
}

function adjustQuantity(index, change) {
    entityList[index].quantity += change;
    if (entityList[index].quantity <= 0) {
        entityList.splice(index, 1);
    }
    updateOutput();
}

function removeEntity(index) {
    entityList.splice(index, 1);
    updateOutput();
}

// Dark Mode Toggle Button
document.getElementById("dark-mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    document.querySelectorAll(".container, th, td, button").forEach(element => {
        element.classList.toggle("dark-mode");
    });

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});
