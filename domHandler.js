// domHandler.js

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
    const form = document.getElementById('supply-form');
    const formData = new FormData(form);

    const people = [];
    const demographics = formData.getAll('demographics');
    demographics.forEach(demo => {
        const count = parseInt(formData.get(`${demo}-count`), 10) || 0;
        for (let i = 0; i < count; i++) {
            people.push(demo);
        }
    });

    const animals = [];
    const animalTypes = formData.getAll('animalTypes');
    animalTypes.forEach(animal => {
        const count = parseInt(formData.get(`${animal}-count`), 10) || 0;
        for (let i = 0; i < count; i++) {
            animals.push(animal);
        }
    });

    const duration = parseInt(formData.get('duration'), 10) || 1;

    return { 
        people,
        animals,
        duration
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
 * Populates the table body with calculated supply items.
 * @param {Array<Object>} items - List of supply items.
 */
export function populateTableRows(items) {
    const tbody = document.querySelector('#supply-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // Iterate over each item to create a row
    items.forEach(item => {
        const row = document.createElement('tr');

        // Item Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        // Quantity cell
        const quantityCell = document.createElement('td');
        quantityCell.textContent = `${formatNumber(item.quantity)} ${item.unit}`;
        row.appendChild(quantityCell);

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

    // Create a new SupplyCalculator instance and get the supply list
    const calculator = new SupplyCalculator(inputs, selectedCategories);
    const { supplyList, totalNutrition } = calculator.getSupplyList();

    // Populate the table and nutrition summary with calculated data
    populateTableRows(supplyList);
    populateNutritionSummary(totalNutrition);
}
