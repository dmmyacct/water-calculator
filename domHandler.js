import SupplyCalculator from './SupplyCalculator.js';
import { formatNumber, debounce } from './utils.js';
import { categoryGroups, categories } from './data.js';

/**
 * Dynamically generates category groups and checkboxes in the UI.
 */
function generateCategoryGroups() {
    const checkboxGroupContainer = document.querySelector('.checkbox-group');
    checkboxGroupContainer.innerHTML = ''; // Clear existing groups if any

    // Iterate over each category group
    Object.values(categoryGroups).forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('category-group');

        // Create group header
        const groupHeader = document.createElement('h4');
        groupHeader.textContent = group.name;
        groupDiv.appendChild(groupHeader);

        // Iterate over categories within the group
        group.categories.forEach(categoryKey => {
            const category = categories[categoryKey];
            if (category) {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('category-checkbox');
                checkbox.value = categoryKey;
                checkbox.checked = true; // Default to checked

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${category.name}`));
                groupDiv.appendChild(label);
            }
        });

        // Append the group to the container
        checkboxGroupContainer.appendChild(groupDiv);
    });
}

/**
 * Retrieves and validates input values from the form.
 * @returns {Object} - An object containing validated input values.
 */
export function getInputValues() {
    const adults = parseInt(document.getElementById('adults').value, 10);
    const children = parseInt(document.getElementById('children').value, 10);
    const dogs = parseInt(document.getElementById('dogs').value, 10);
    const cats = parseInt(document.getElementById('cats').value, 10);
    const duration = parseInt(document.getElementById('duration').value, 10);

    // Ensure values are numbers and not negative
    return { 
        adults: isNaN(adults) || adults < 0 ? 0 : adults,
        children: isNaN(children) || children < 0 ? 0 : children,
        dogs: isNaN(dogs) || dogs < 0 ? 0 : dogs,
        cats: isNaN(cats) || cats < 0 ? 0 : cats,
        duration: isNaN(duration) || duration < 1 ? 1 : duration 
    };
}

/**
 * Retrieves selected categories based on user input.
 * @returns {Array<string>} - An array of selected category keys.
 */
export function getSelectedCategories() {
    const selected = [];
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selected.push(checkbox.value);
        }
    });
    return selected;
}

/**
 * Generates the table header based on the number of adults, children, dogs, and cats.
 * @param {number} adults
 * @param {number} children
 * @param {number} dogs
 * @param {number} cats
 */
export function generateTableHeader(adults, children, dogs, cats) {
    const theadRow = document.querySelector('#supply-table thead tr');
    let headerHTML = '<th>Item</th>';

    // Add columns for each adult
    for (let i = 1; i <= adults; i++) {
        headerHTML += `<th>Adult ${i}</th>`;
    }

    // Add columns for each child
    for (let i = 1; i <= children; i++) {
        headerHTML += `<th>Child ${i}</th>`;
    }

    // Add columns for each dog
    for (let i = 1; i <= dogs; i++) {
        headerHTML += `<th>Dog ${i}</th>`;
    }

    // Add columns for each cat
    for (let i = 1; i <= cats; i++) {
        headerHTML += `<th>Cat ${i}</th>`;
    }

    // Add Total Needed column
    headerHTML += '<th>Total Needed</th>';
    theadRow.innerHTML = headerHTML;
}

/**
 * Populates the table body with calculated supply items.
 * @param {Array<Object>} items - List of supply items.
 * @param {number} adults
 * @param {number} children
 * @param {number} dogs
 * @param {number} cats
 */
export function populateTableRows(items, adults, children, dogs, cats) {
    const tbody = document.querySelector('#supply-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // Iterate over each item to create a row
    items.forEach(item => {
        const row = document.createElement('tr');

        // Item Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        // Helper function to create individual cells
        const createCell = (value) => {
            const cell = document.createElement('td');
            if (value > 0) {
                cell.textContent = formatNumber(value);
            } else {
                cell.textContent = '';
                cell.classList.add('blocked-cell'); // Style for zero values
            }
            return cell;
        };

        // Adult columns
        for (let i = 0; i < adults; i++) {
            row.appendChild(createCell(item.perAdult));
        }

        // Child columns
        for (let i = 0; i < children; i++) {
            row.appendChild(createCell(item.perChild));
        }

        // Dog columns
        for (let i = 0; i < dogs; i++) {
            row.appendChild(createCell(item.perDog));
        }

        // Cat columns
        for (let i = 0; i < cats; i++) {
            row.appendChild(createCell(item.perCat));
        }

        // Total Needed cell
        const totalCell = document.createElement('td');
        if (item.total > 0) {
            totalCell.textContent = `${formatNumber(item.total)} ${item.unit}`;
        } else {
            totalCell.textContent = '';
            totalCell.classList.add('blocked-cell');
        }
        totalCell.classList.add('total-column');
        row.appendChild(totalCell);

        // Append the row to the table body
        tbody.appendChild(row);
    });
}

/**
 * Populates the nutrition summary section with total nutrition information.
 * @param {Object} totalNutrition - Object containing total calories, protein, fat, and carbs.
 */
export function populateNutritionSummary(totalNutrition) {
    const nutritionSection = document.getElementById('nutrition-summary');
    nutritionSection.innerHTML = `
        <h3>Nutrition Overview</h3>
        <p><strong>Total Calories:</strong> ${formatNumber(totalNutrition.calories)} kcal</p>
        <p><strong>Total Protein:</strong> ${formatNumber(totalNutrition.protein)} g</p>
        <p><strong>Total Fat:</strong> ${formatNumber(totalNutrition.fat)} g</p>
        <p><strong>Total Carbohydrates:</strong> ${formatNumber(totalNutrition.carbs)} g</p>
    `;
}

/**
 * Initializes event listeners and updates the table on load.
 */
export function initialize() {
    const form = document.getElementById('supply-form');

    // Dynamically generate category groups and checkboxes
    generateCategoryGroups();

    // Debounced update function to prevent excessive calculations
    const debouncedUpdate = debounce(updateTable, 300);

    // Add event listeners to form inputs and checkboxes
    form.addEventListener('input', debouncedUpdate);
    form.addEventListener('change', debouncedUpdate);

    // Initial table generation
    updateTable();
}

/**
 * Updates the supply table and nutrition summary based on current inputs and selections.
 */
function updateTable() {
    const inputs = getInputValues();
    const selectedCategories = getSelectedCategories();

    // Generate table header based on inputs
    generateTableHeader(inputs.adults, inputs.children, inputs.dogs, inputs.cats);

    // Create a new SupplyCalculator instance and get the supply list
    const calculator = new SupplyCalculator(inputs, selectedCategories);
    const { supplyList, totalNutrition } = calculator.getSupplyList();

    // Populate the table and nutrition summary with calculated data
    populateTableRows(supplyList, inputs.adults, inputs.children, inputs.dogs, inputs.cats);
    populateNutritionSummary(totalNutrition);
}
