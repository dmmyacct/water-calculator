// Data Structures for Daily Requirements
const dailyRequirements = {
    human: {
        "Infant": { weight: 22, water: 0.3, calories: 500 },
        "Child": { weight: 70, water: 0.5, calories: 1400 },
        "Teenager Male": { weight: 150, water: 1, calories: 2800 },
        "Teenager Female": { weight: 125, water: 1, calories: 2200 },
        "Adult Male": { weight: 190, water: 1, calories: 2500 },
        "Adult Female": { weight: 160, water: 0.8, calories: 2000 },
        "Pregnant Female": { weight: 165, water: 1, calories: 2400 },
        "Elderly Male": { weight: 160, water: 1, calories: 2200 },
        "Elderly Female": { weight: 140, water: 0.8, calories: 1800 },
    },
    animal: {
        "Dog": { weight: 50, water: 0.5, calories: 700 },
        "Cat": { weight: 10, water: 0.1, calories: 250 },
        "Rabbit": { weight: 8, water: 0.15, calories: 150 },
        "Chicken": { weight: 7.5, water: 0.075, calories: 100 },
        // Add other animals as needed
    }
};

// Categories with Supply Items
const categories = {
    water: {
        name: "Water",
        items: [
            {
                name: "Water (gallons)",
                perAdultPerDay: 1, 
                perDogPerDay: 1, // 1 gallon per dog per day
                perCatPerDay: 0.5, // 0.5 gallon per cat per day
                unit: "gallons"
            },
            // Add more water-related items if needed
        ]
    },
    food: {
        name: "Food",
        items: [
            {
                name: "Rice (lbs)",
                perAdultPerDay: 0.625,
                unit: "lbs"
            },
            {
                name: "Canned Meat (cans)",
                perAdultPerDay: 0.875,
                unit: "cans"
            },
            {
                name: "Dog Food (lbs)",
                perDogPerDay: 2.5, // Approx. 2.5 lbs of food per dog per day
                unit: "lbs"
            },
            {
                name: "Cat Food (lbs)",
                perCatPerDay: 0.5, // Approx. 0.5 lbs of food per cat per day
                unit: "lbs"
            },
            // Add more food items as needed
        ]
    },
    medical: {
        name: "Medical Supplies",
        items: [
            {
                name: "Basic First-Aid Kit",
                perPersonPerDay: 1 / 30, // One kit per 30 days per person
                unit: "kits"
            },
            {
                name: "Pet First Aid Kit",
                perDogPerDay: 1 / 30,
                perCatPerDay: 1 / 30,
                unit: "kits"
            },
            // Add more medical items as needed
        ]
    },
    gear: {
        name: "Gear",
        items: [
            // Define gear items here
            // Example:
            {
                name: "Flashlight",
                perPerson: 1,
                unit: "units"
            },
            // ...
        ]
    },
    hygiene: {
        name: "Sanitation & Hygiene",
        items: [
            // Define hygiene items here
            {
                name: "Toilet Paper (rolls)",
                perPersonPerDay: 0.2,
                unit: "rolls"
            },
            // ...
        ]
    },
    communication: {
        name: "Communication",
        items: [
            // Define communication items here
            {
                name: "Battery-powered Radio",
                perHousehold: 1,
                unit: "units"
            },
            // ...
        ]
    },
    shelter: {
        name: "Shelter",
        items: [
            // Define shelter items here
            {
                name: "Tent",
                perFamily: 1,
                unit: "units"
            },
            // ...
        ]
    },
    tools: {
        name: "Tools & Equipment",
        items: [
            // Define tools items here
            {
                name: "Multi-tool",
                perPerson: 1,
                unit: "units"
            },
            // ...
        ]
    },
    power: {
        name: "Power & Energy",
        items: [
            // Define power items here
            {
                name: "Batteries (AA)",
                perPersonPerDay: 2,
                unit: "units"
            },
            // ...
        ]
    },
    cooking: {
        name: "Cooking and Heating",
        items: [
            // Define cooking items here
            {
                name: "Portable Stove",
                perHousehold: 1,
                unit: "units"
            },
            // ...
        ]
    },
    security: {
        name: "Personal Security",
        items: [
            // Define security items here
            {
                name: "Pepper Spray",
                perPerson: 1,
                unit: "units"
            },
            // ...
        ]
    },
};

// Event Listener for DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('supply-form');
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

    // Add event listeners to all input fields and checkboxes
    form.addEventListener('input', updateTable);
    form.addEventListener('change', updateTable);

    // Initial table generation
    updateTable();
});

// Function to Retrieve Input Values
function getInputValues() {
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const dogs = parseInt(document.getElementById('dogs').value) || 0;
    const cats = parseInt(document.getElementById('cats').value) || 0;
    const duration = parseInt(document.getElementById('duration').value) || 1;

    return { adults, children, dogs, cats, duration };
}

// Function to Retrieve Selected Categories
function getSelectedCategories() {
    const selected = [];
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selected.push(checkbox.value);
        }
    });
    return selected;
}

// Main Function to Update the Supply Table
function updateTable() {
    const { adults, children, dogs, cats, duration } = getInputValues();
    const selectedCategories = getSelectedCategories();

    generateTableHeader(adults, children, dogs, cats);
    generateTableBody(selectedCategories, adults, children, dogs, cats, duration);
}

// Function to Generate Table Header Dynamically
function generateTableHeader(adults, children, dogs, cats) {
    const theadRow = document.querySelector('#supply-table thead tr');
    theadRow.innerHTML = '<th>Item</th>';

    // Add Adult Columns
    for (let i = 1; i <= adults; i++) {
        theadRow.innerHTML += `<th>Adult ${i}</th>`;
    }

    // Add Child Columns
    for (let i = 1; i <= children; i++) {
        theadRow.innerHTML += `<th>Child ${i}</th>`;
    }

    // Add Dog Columns
    for (let i = 1; i <= dogs; i++) {
        theadRow.innerHTML += `<th>Dog ${i}</th>`;
    }

    // Add Cat Columns
    for (let i = 1; i <= cats; i++) {
        theadRow.innerHTML += `<th>Cat ${i}</th>`;
    }

    theadRow.innerHTML += '<th>Total Needed</th>';
}

// Function to Generate Table Body Based on Selected Categories and Inputs
function generateTableBody(selectedCategories, adults, children, dogs, cats, duration) {
    const tbody = document.querySelector('#supply-table tbody');
    tbody.innerHTML = '';

    let allItems = [];

    selectedCategories.forEach(categoryKey => {
        const category = categories[categoryKey];
        category.items.forEach(item => {
            allItems.push({
                name: item.name,
                perAdult: item.perAdultPerDay ? item.perAdultPerDay * duration : (item.perAdult || 0),
                perChild: item.perChildPerDay ? item.perChildPerDay * duration : (item.perChild || 0),
                perDog: item.perDogPerDay ? item.perDogPerDay * duration : (item.perDog || 0),
                perCat: item.perCatPerDay ? item.perCatPerDay * duration : (item.perCat || 0),
                perPerson: item.perPersonPerDay ? item.perPersonPerDay * duration : (item.perPerson || 0),
                perHousehold: item.perHousehold ? item.perHousehold * duration : (item.perHousehold || 0),
                perFamily: item.perFamily || 0, // Assuming perFamily is one per family, duration may not apply
                unit: item.unit
            });
        });
    });

    const consolidatedItems = consolidateItems(allItems);
    populateTableRows(consolidatedItems, adults, children, dogs, cats);
}

// Function to Consolidate Items with the Same Name
function consolidateItems(items) {
    const itemMap = {};

    items.forEach(item => {
        if (!itemMap[item.name]) {
            itemMap[item.name] = { ...item };
        } else {
            itemMap[item.name].perAdult += item.perAdult;
            itemMap[item.name].perChild += item.perChild;
            itemMap[item.name].perDog += item.perDog;
            itemMap[item.name].perCat += item.perCat;
            itemMap[item.name].perPerson += item.perPerson;
            itemMap[item.name].perHousehold += item.perHousehold;
            itemMap[item.name].perFamily += item.perFamily;
        }
    });

    return Object.values(itemMap);
}

// Function to Populate Table Rows with Consolidated Items
function populateTableRows(items, adults, children, dogs, cats) {
    const tbody = document.querySelector('#supply-table tbody');

    items.forEach(item => {
        const row = document.createElement('tr');

        // Item Name
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        // Adult Columns
        for (let i = 0; i < adults; i++) {
            const adultCell = document.createElement('td');
            adultCell.textContent = formatNumber(item.perAdult);
            row.appendChild(adultCell);
        }

        // Child Columns
        for (let i = 0; i < children; i++) {
            const childCell = document.createElement('td');
            childCell.textContent = formatNumber(item.perChild);
            row.appendChild(childCell);
        }

        // Dog Columns
        for (let i = 0; i < dogs; i++) {
            const dogCell = document.createElement('td');
            dogCell.textContent = formatNumber(item.perDog);
            row.appendChild(dogCell);
        }

        // Cat Columns
        for (let i = 0; i < cats; i++) {
            const catCell = document.createElement('td');
            catCell.textContent = formatNumber(item.perCat);
            row.appendChild(catCell);
        }

        // Total Needed
        const total = (item.perAdult * adults) + 
                      (item.perChild * children) + 
                      (item.perDog * dogs) + 
                      (item.perCat * cats) + 
                      (item.perPerson * (adults + children)) + 
                      (item.perHousehold) + 
                      (item.perFamily);
        const totalCell = document.createElement('td');
        totalCell.textContent = `${formatNumber(total)} ${item.unit}`;
        totalCell.classList.add('total-column');
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });
}

// Utility Function to Format Numbers
function formatNumber(num) {
    const number = parseFloat(num);
    return Number.isInteger(number) ? number : number.toFixed(2);
}
