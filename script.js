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
        "Donkey": { weight: 485, water: 7.5 },
        "Duck": { weight: 6, water: 0.15 },
        "Goat": { weight: 200, water: 2 },
        "Goose": { weight: 11, water: 0.15 },
        "Guinea Fowl": { weight: 3.5, water: 0.05 },
        "Horse": { weight: 1550, water: 15 },
        "Llama": { weight: 350, water: 2.5 },
        "Mule": { weight: 900, water: 9 },
        "Ostrich": { weight: 250, water: 1.5 },
        "Pig": { weight: 550, water: 3.5 },
        "Pigeon": { weight: 1.5, water: 0.02 },
        "Quail": { weight: 0.3, water: 0.01 },
        "Rabbit": { weight: 8, water: 0.15 },
        "Sheep": { weight: 225, water: 2 },
        "Turkey": { weight: 22.5, water: 0.2 },
        "Yak": { weight: 1150, water: 12.5 },
        "Cat": { weight: 10, water: 0.1 },
        "Dog": { weight: 50, water: 0.5 },
        "Ferret": { weight: 2, water: 0.05 },
        "Hamster": { weight: 0.2, water: 0.01 },
        "Parrot": { weight: 1, water: 0.02 },
        "Guinea Pig": { weight: 2.5, water: 0.05 }
    }
};

let entityList = [];
let numDays = 7;

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
    numDays = parseInt(this.value);
    if (numDays > 0 && numDays <= 365) {
        updateOutput();
    }
});

document.getElementById("entity-type").addEventListener("change", function () {
    const entityType = this.value;
    const entityNameSelect = document.getElementById("entity-name");

    entityNameSelect.innerHTML = ''; // Clear the current options

    if (entityType === "human") {
        for (const name in dailyWaterRequirements.human) {
            const option = document.createElement("option");
            option.value = name;
            option.text = name;
            entityNameSelect.appendChild(option);
        }
    } else if (entityType === "animal") {
        for (const name in dailyWaterRequirements.animal) {
            const option = document.createElement("option");
            option.value = name;
            option.text = name;
            entityNameSelect.appendChild(option);
        }
    }

    entityNameSelect.classList.remove("hidden"); // Make the dropdown visible
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
        entityList.push({ type: entityType, name: entityName, quantity: quantity });
        updateOutput();

        // Clear quantity field for next input
        document.getElementById("entity-quantity").value = '';
    }
}

function updateOutput() {
    let breakdownBody = document.getElementById("breakdown-body");
    breakdownBody.innerHTML = "";

    let totalWater = 0;

    entityList.forEach(entity => {
        let data = dailyWaterRequirements[entity.type][entity.name];
        let dailyWaterNeed = data.water * entity.quantity;
        let totalForDays = dailyWaterNeed * numDays;

        let row = `
            <tr>
                <td>${entity.name}</td>
                <td>${entity.quantity}</td>
                <td>${data.weight}</td>
                <td>${data.water}</td>
                <td>${dailyWaterNeed}</td>
                <td>${totalForDays}</td>
            </tr>
        `;
        breakdownBody.innerHTML += row;

        totalWater += dailyWaterNeed;
    });

    document.getElementById("total-water").innerText = `You will need ${totalWater} gallons of water daily for ${numDays} days.`;
}
