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
        ]
    },
    medical: {
        name: "Medical Supplies",
        items: [
            {
                name: "Basic First-Aid Kit",
                perPerson: 1 / 30,
                unit: "kits"
            },
            {
                name: "Pet First Aid Kit",
                perDog: 1 / 30,
                perCat: 1 / 30,
                unit: "kits"
            },
        ]
    },
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('adults').addEventListener('input', updateTable);
    document.getElementById('children').addEventListener('input', updateTable);
    document.getElementById('dogs').addEventListener('input', updateTable);
    document.getElementById('cats').addEventListener('input', updateTable);
    document.getElementById('duration').addEventListener('change', updateTable);
    document.getElementById('water').addEventListener('change', updateTable);
    document.getElementById('food').addEventListener('change', updateTable);
    document.getElementById('medical').addEventListener('change', updateTable);

    updateTable();
});

function getInputValues() {
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const dogs = parseInt(document.getElementById('dogs').value) || 0;
    const cats = parseInt(document.getElementById('cats').value) || 0;
    const duration = parseInt(document.getElementById('duration').value) || 1;

    return { adults, children, dogs, cats, duration };
}

function getSelectedCategories() {
    const selected = [];
    if (document.getElementById('water').checked) selected.push('water');
    if (document.getElementById('food').checked) selected.push('food');
    if (document.getElementById('medical').checked) selected.push('medical');
    return selected;
}

function updateTable() {
    const { adults, children, dogs, cats, duration } = getInputValues();
    const selectedCategories = getSelectedCategories();

    const totalIndividuals = adults + children;

    generateTableHeader(adults, children, dogs, cats);

    let allItems = [];
    selectedCategories.forEach(categoryKey => {
        const category = categories[categoryKey];
        category.items.forEach(item => {
            allItems.push({
                name: item.name,
                perAdult: item.perAdultPerDay ? item.perAdultPerDay * duration : (item.perPerson || 0) * duration,
                perDog: item.perDogPerDay ? item.perDogPerDay * duration : (item.perDog || 0) * duration,
                perCat: item.perCatPerDay ? item.perCatPerDay * duration : (item.perCat || 0) * duration,
                unit: item.unit
            });
        });
    });

    const consolidatedItems = consolidateItems(allItems);
    generateTableBody(consolidatedItems, adults, children, dogs, cats);
}

function generateTableHeader(adults, children, dogs, cats) {
    const thead = document.querySelector('#supply-table thead tr');
    thead.innerHTML = '<th>Item</th>';

    for (let i = 1; i <= adults; i++) {
        thead.innerHTML += `<th>Adult ${i}</th>`;
    }

    for (let i = 1; i <= children; i++) {
        thead.innerHTML += `<th>Child ${i}</th>`;
    }

    for (let i = 1; i <= dogs; i++) {
        thead.innerHTML += `<th>Dog ${i}</th>`;
    }

    for (let i = 1; i <= cats; i++) {
        thead.innerHTML += `<th>Cat ${i}</th>`;
    }

    thead.innerHTML += '<th>Total Needed</th>';
}

function consolidateItems(items) {
    const itemMap = {};

    items.forEach(item => {
        if (!itemMap[item.name]) {
            itemMap[item.name] = { ...item };
        } else {
            itemMap[item.name].perAdult += item.perAdult;
            itemMap[item.name].perDog += item.perDog;
            itemMap[item.name].perCat += item.perCat;
        }
    });

    return Object.values(itemMap);
}

function generateTableBody(items, adults, children, dogs, cats) {
    const tbody = document.querySelector('#supply-table tbody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = `${item.name}`;
        row.appendChild(nameCell);

        for (let i = 0; i < adults; i++) {
            const adultCell = document.createElement('td');
            adultCell.textContent = formatNumber(item.perAdult.toFixed(2));
            row.appendChild(adultCell);
        }

        for (let i = 0; i < children; i++) {
            const childCell = document.createElement('td');
            childCell.textContent = formatNumber(item.perAdult.toFixed(2));
            row.appendChild(childCell);
        }

        for (let i = 0; i < dogs; i++) {
            const dogCell = document.createElement('td');
            dogCell.textContent = formatNumber(item.perDog.toFixed(2));
            row.appendChild(dogCell);
        }

        for (let i = 0; i < cats; i++) {
            const catCell = document.createElement('td');
            catCell.textContent = formatNumber(item.perCat.toFixed(2));
            row.appendChild(catCell);
        }

        const total = (item.perAdult * adults) + (item.perAdult * children) + (item.perDog * dogs) + (item.perCat * cats);
        const totalCell = document.createElement('td');
        totalCell.textContent = `${formatNumber(total.toFixed(2))} ${item.unit}`;
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });
}

function formatNumber(num) {
    return num % 1 === 0 ? num : parseFloat(num).toFixed(2);
}
