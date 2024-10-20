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
        "Camel": { weight: 1100, water: 25 },
        "Cow": { weight: 1500, water: 25 },
        "Dog": { weight: 50, water: 0.5 },
        "Cat": { weight: 10, water: 0.1 }
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

function addEntity() {
    // Sample logic to add an entity to the list
    let entityType = document.getElementById("entity-type").value;
    let entityName = prompt("Enter the type (e.g., Adult Male, Alpaca):");
    let quantity = parseInt(prompt("Enter the number of entities:"));

    if (dailyWaterRequirements[entityType] && dailyWaterRequirements[entityType][entityName]) {
        entityList.push({ type: entityType, name: entityName, quantity: quantity });
        updateOutput();
    } else {
        alert("Invalid entity type or name.");
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
