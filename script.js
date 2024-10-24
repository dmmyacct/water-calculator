let entityList = [];
let numDays = parseInt(document.getElementById("days-select").value);

document.addEventListener("DOMContentLoaded", function () {
    // Set initial theme
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

    // Resource selection event listeners
    document.getElementById("calculate-water").addEventListener("change", updateOutput);
    document.getElementById("calculate-food").addEventListener("change", updateOutput);
});

document.getElementById("entity-type").addEventListener("change", function () {
    const entityType = this.value;
    populateEntityDropdown(entityType);
});

function populateEntityDropdown(entityType) {
    const entityNameSelect = document.getElementById("entity-name");
    entityNameSelect.innerHTML = '';

    let data = dailyRequirements[entityType];
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
    let totalCaloriesDaily = 0;

    if (entityList.length === 0) {
        breakdownBody.innerHTML = `<tr><td colspan="8">No data available</td></tr>`;
        document.getElementById("total-resources").innerText = "No entities added yet.";
        updateSupplyTracker(0, 0);
        return;
    }

    entityList.forEach((entity, index) => {
        let data = dailyRequirements[entity.type][entity.name];
        if (!data) return;

        let dailyWaterNeed = data.water * entity.quantity;
        let totalWaterForDays = dailyWaterNeed * numDays;

        let dailyCalorieNeed = data.calories * entity.quantity;
        let totalCaloriesForDays = dailyCalorieNeed * numDays;

        let row = `
            <tr>
                <td>${entity.name}</td>
                <td>
                    <button onclick="adjustQuantity(${index}, -1)">-</button>
                    ${entity.quantity}
                    <button onclick="adjustQuantity(${index}, 1)">+</button>
                </td>
                <td>${data.weight}</td>
                <td>${document.getElementById("calculate-water").checked ? data.water.toFixed(2) : 'N/A'}</td>
                <td>${document.getElementById("calculate-water").checked ? totalWaterForDays.toFixed(2) : 'N/A'}</td>
                <td>${document.getElementById("calculate-food").checked ? dailyCalorieNeed : 'N/A'}</td>
                <td>${document.getElementById("calculate-food").checked ? totalCaloriesForDays : 'N/A'}</td>
                <td><button onclick="removeEntity(${index})">Remove</button></td>
            </tr>
        `;
        breakdownBody.innerHTML += row;

        if (document.getElementById("calculate-water").checked) {
            totalWaterDaily += dailyWaterNeed;
        }
        if (document.getElementById("calculate-food").checked) {
            totalCaloriesDaily += dailyCalorieNeed;
        }
    });

    let totalWaterForSelectedDays = totalWaterDaily * numDays;
    let totalCaloriesForSelectedDays = totalCaloriesDaily * numDays;

    let outputMessage = `For the selected period of ${numDays} days, you will need a total of `;

    if (document.getElementById("calculate-water").checked) {
        outputMessage += `${totalWaterForSelectedDays.toFixed(2)} gallons of water `;
    }

    if (document.getElementById("calculate-food").checked) {
        if (document.getElementById("calculate-water").checked) {
            outputMessage += `and `;
        }
        outputMessage += `${totalCaloriesForSelectedDays.toLocaleString()} calories `;
    }

    outputMessage += `(${document.getElementById("calculate-water").checked ? totalWaterDaily.toFixed(2) : 'N/A'} gallons of water per day, ${document.getElementById("calculate-food").checked ? totalCaloriesDaily.toLocaleString() : 'N/A'} calories per day).`;

    document.getElementById("total-resources").innerText = outputMessage;

    updateSupplyTracker(totalWaterForSelectedDays, totalCaloriesForSelectedDays);
}

function updateSupplyTracker(totalWaterRequired, totalCaloriesRequired) {
    if (document.getElementById("calculate-water").checked) {
        document.getElementById("total-water-required").innerText = totalWaterRequired.toFixed(2);
        updateSupplyFulfilled('water');
    } else {
        document.getElementById("total-water-required").innerText = 'N/A';
        document.getElementById("water-supply-fulfilled").innerText = 'N/A';
    }

    if (document.getElementById("calculate-food").checked) {
        document.getElementById("total-food-required").innerText = totalCaloriesRequired.toLocaleString();
        updateSupplyFulfilled('food');
    } else {
        document.getElementById("total-food-required").innerText = 'N/A';
        document.getElementById("food-supply-fulfilled").innerText = 'N/A';
    }
}

function updateSupplyFulfilled(resource) {
    let totalRequiredText = document.getElementById(`total-${resource}-required`).innerText;
    if (totalRequiredText === 'N/A') {
        document.getElementById(`${resource}-supply-fulfilled`).innerText = 'N/A';
        return;
    }

    let totalRequired = parseFloat(totalRequiredText.replace(/,/g, ''));
    let availableSupply = parseFloat(document.getElementById(`available-${resource}`).value) || 0;
    let percentageFulfilled = (availableSupply / totalRequired) * 100;

    if (percentageFulfilled > 100) {
        percentageFulfilled = 100;
    }

    document.getElementById(`${resource}-supply-fulfilled`).innerText = `${percentageFulfilled.toFixed(2)}%`;
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
