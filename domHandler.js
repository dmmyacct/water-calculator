import SupplyCalculator from './SupplyCalculator.js';
import { formatNumber, debounce, convertLiquidMeasurement } from './utils.js';
import { categoryGroups, categories } from './data.js';

let currentLiquidUnit = 'gallons'; // Default unit

/**
 * Dynamically generates category groups and checkboxes in the UI.
 */
function generateCategoryGroups() {
    const checkboxGroupContainer = document.querySelector('.checkbox-group');
    checkboxGroupContainer.innerHTML = ''; // Clear existing groups

    // Add global category controls
    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('category-controls');
    
    const selectAllBtn = document.createElement('button');
    selectAllBtn.innerHTML = '✓ All';
    selectAllBtn.type = 'button'; // Prevent form submission
    selectAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateAllCheckboxes(true);
    });
    
    const deselectAllBtn = document.createElement('button');
    deselectAllBtn.innerHTML = '✕ All';
    deselectAllBtn.type = 'button'; // Prevent form submission
    deselectAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateAllCheckboxes(false);
    });
    
    controlsDiv.appendChild(selectAllBtn);
    controlsDiv.appendChild(deselectAllBtn);
    checkboxGroupContainer.appendChild(controlsDiv);

    // Iterate over each category group
    Object.values(categoryGroups).forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('category-group');

        // Create group header with new structure
        const groupHeader = document.createElement('div');
        groupHeader.classList.add('group-controls');
        
        // Create container for buttons and title
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('group-title-container');
        
        // Create buttons container and add before title
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('group-buttons');
        
        const selectGroupBtn = document.createElement('button');
        selectGroupBtn.innerHTML = '✓';
        selectGroupBtn.title = 'Select all in group';
        selectGroupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateGroupCheckboxes(groupDiv, true);
        });
        
        const deselectGroupBtn = document.createElement('button');
        deselectGroupBtn.innerHTML = '✕';
        deselectGroupBtn.title = 'Deselect all in group';
        deselectGroupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateGroupCheckboxes(groupDiv, false);
        });
        
        buttonContainer.appendChild(selectGroupBtn);
        buttonContainer.appendChild(deselectGroupBtn);
        
        const groupTitle = document.createElement('h4');
        groupTitle.textContent = group.name;
        
        titleContainer.appendChild(buttonContainer);
        titleContainer.appendChild(groupTitle);
        groupHeader.appendChild(titleContainer);
        groupDiv.appendChild(groupHeader);

        // Create checkbox container
        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('checkbox-container');

        // Add categories within the group
        group.categories.forEach(categoryKey => {
            const category = categories[categoryKey];
            if (category) {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('category-checkbox');
                checkbox.value = categoryKey;
                checkbox.checked = true; // Default to checked
                checkbox.addEventListener('change', () => updateTable());

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${category.name}`));
                checkboxContainer.appendChild(label);
            }
        });

        groupDiv.appendChild(checkboxContainer);

        checkboxGroupContainer.appendChild(groupDiv);
    });
}

/**
 * Updates all checkboxes to the specified state and triggers table update
 * @param {boolean} checked - Whether to check or uncheck the boxes
 */
function updateAllCheckboxes(checked) {
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
    // Explicitly call updateTable without debounce
    updateTable();
}

/**
 * Updates all checkboxes within a group to the specified state and triggers table update
 * @param {HTMLElement} groupDiv - The group container element
 * @param {boolean} checked - Whether to check or uncheck the boxes
 */
function updateGroupCheckboxes(groupDiv, checked) {
    const checkboxes = groupDiv.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
    // Explicitly call updateTable without debounce
    updateTable();
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
    const checkboxes = document.querySelectorAll('.category-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

/**
 * Generates the table header based on current inputs
 * @param {number} adults - Number of adults
 * @param {number} children - Number of children
 * @param {number} dogs - Number of dogs
 * @param {number} cats - Number of cats
 */
function generateTableHeader(adults, children, dogs, cats) {
    const tableHead = document.querySelector('#supply-table thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Item</th>';

    // Add columns for adults
    for (let i = 0; i < adults; i++) {
        headerRow.innerHTML += `<th>Adult ${i + 1}</th>`;
    }

    // Add columns for children
    for (let i = 0; i < children; i++) {
        headerRow.innerHTML += `<th>Child ${i + 1}</th>`;
    }

    // Add columns for dogs
    for (let i = 0; i < dogs; i++) {
        headerRow.innerHTML += `<th>Dog ${i + 1}</th>`;
    }

    // Add columns for cats
    for (let i = 0; i < cats; i++) {
        headerRow.innerHTML += `<th>Cat ${i + 1}</th>`;
    }

    headerRow.innerHTML += '<th>Total Needed</th>';

    // Clear existing header and add the new one
    tableHead.innerHTML = '';
    tableHead.appendChild(headerRow);
}

/**
 * Populates the table rows with supply data
 * @param {Array} supplyList - List of supplies to display
 * @param {Object} inputs - Current input values for adults, children, dogs, and cats
 */
function populateTableRows(supplyList, inputs) {
    const tableBody = document.querySelector('#supply-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (!supplyList || supplyList.length === 0) {
        const emptyRow = document.createElement('tr');
        const colspan = 2 + inputs.adults + inputs.children + inputs.dogs + inputs.cats;
        emptyRow.innerHTML = `<td colspan="${colspan}">No items to display</td>`;
        tableBody.appendChild(emptyRow);
        return;
    }

    supplyList.forEach(item => {
        const row = document.createElement('tr');
        let rowHTML = `<td>${item.name}</td>`;

        // Add cells for each adult
        for (let i = 0; i < inputs.adults; i++) {
            rowHTML += `<td>${formatNumber(item.perAdult || 0)}</td>`;
        }

        // Add cells for each child
        for (let i = 0; i < inputs.children; i++) {
            rowHTML += `<td>${formatNumber(item.perChild || 0)}</td>`;
        }

        // Add cells for each dog
        for (let i = 0; i < inputs.dogs; i++) {
            rowHTML += `<td>${formatNumber(item.perDog || 0)}</td>`;
        }

        // Add cells for each cat
        for (let i = 0; i < inputs.cats; i++) {
            rowHTML += `<td>${formatNumber(item.perCat || 0)}</td>`;
        }

        // Add total column
        let displayTotal = item.total;
        let displayUnit = item.unit;
        
        // Convert liquid measurements if the item is water
        if (item.name.toLowerCase().includes('water')) {
            displayTotal = convertLiquidMeasurement(item.total, currentLiquidUnit);
            displayUnit = currentLiquidUnit;
        }
        
        rowHTML += `<td class="total-column">${formatNumber(displayTotal)} ${getUnitLabel(displayUnit)}</td>`;
        
        row.innerHTML = rowHTML;
        tableBody.appendChild(row);
    });
}

/**
 * Creates and adds the liquid unit selector to the form
 */
function addLiquidUnitSelector() {
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group');
    
    const label = document.createElement('label');
    label.htmlFor = 'liquid-unit';
    label.textContent = 'Liquid Measurement Unit:';
    
    const select = document.createElement('select');
    select.id = 'liquid-unit';
    select.name = 'liquid-unit';
    
    const units = [
        { value: 'milliliters', label: 'mL' },
        { value: 'liters', label: 'L' },
        { value: 'fluid_ounces', label: 'fl oz' },
        { value: 'cups', label: 'cups' },
        { value: 'pints', label: 'pt' },
        { value: 'quarts', label: 'qt' },
        { value: 'gallons', label: 'gal' }
    ];
    
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.value;
        option.textContent = unit.label;
        if (unit.value === currentLiquidUnit) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
        currentLiquidUnit = e.target.value;
        updateTable();
    });
    
    inputGroup.appendChild(label);
    inputGroup.appendChild(select);
    
    // Insert after the duration selector
    const durationGroup = document.querySelector('#duration').closest('.input-group');
    durationGroup.after(inputGroup);
}

/**
 * Initializes event listeners and updates the table on load.
 */
export function initialize() {
    generateCategoryGroups();
    initializeInputControls();
    addLiquidUnitSelector();

    // Add event listeners to all inputs
    const inputs = document.querySelectorAll('#supply-form input, #supply-form select');
    inputs.forEach(input => {
        input.addEventListener('change', debounce(updateTable, 300));
    });

    // Add event listeners to category checkboxes
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', debounce(updateTable, 300));
    });

    // Initial table update
    updateTable();
}

/**
 * Updates the supply table and nutrition summary based on current inputs and selections.
 */
function updateTable() {
    const inputs = getInputValues();
    const selectedCategories = getSelectedCategories();
    
    // Update table header based on current inputs
    generateTableHeader(inputs.adults, inputs.children, inputs.dogs, inputs.cats);
    
    const calculator = new SupplyCalculator(inputs, selectedCategories);
    const supplyList = calculator.getSupplyList();
    
    // Update table rows to match the new header structure
    populateTableRows(supplyList, inputs);
}

/**
 * Helper function to get the abbreviated unit label
 */
function getUnitLabel(unit) {
    const unitMap = {
        'milliliters': 'mL',
        'liters': 'L',
        'fluid_ounces': 'fl oz',
        'cups': 'cups',
        'pints': 'pt',
        'quarts': 'qt',
        'gallons': 'gal',
        'units': 'units',
        'kits': 'kits',
        'rolls': 'rolls',
        'kcal': 'kcal',
        'g': 'g'
    };
    return unitMap[unit] || unit;
}

function initializeInputControls() {
    // Add classes to input groups for styling
    document.querySelectorAll('.input-group').forEach(group => {
        const input = group.querySelector('input, select');
        if (input) {
            const type = input.id;
            if (['adults', 'children'].includes(type)) {
                group.classList.add('people-input');
            } else if (['dogs', 'cats'].includes(type)) {
                group.classList.add('animal-input');
            } else if (type === 'duration') {
                group.classList.add('duration-input');
            } else if (type === 'liquid-unit') {
                group.classList.add('unit-input');
            }
        }
    });

    // Convert number inputs to spinbutton controls
    document.querySelectorAll('input[type="number"]').forEach(input => {
        const container = document.createElement('div');
        container.className = 'spinbutton-controls';

        const decrementBtn = document.createElement('button');
        decrementBtn.type = 'button';
        decrementBtn.textContent = '−';
        decrementBtn.onclick = () => updateValue(input, -1);

        const incrementBtn = document.createElement('button');
        incrementBtn.type = 'button';
        incrementBtn.textContent = '+';
        incrementBtn.onclick = () => updateValue(input, 1);

        // Replace the input with the new control group
        input.parentNode.replaceChild(container, input);
        container.appendChild(decrementBtn);
        container.appendChild(input);
        container.appendChild(incrementBtn);
    });
}

function updateValue(input, change) {
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.min) || 0;
    const newValue = Math.max(min, currentValue + change);
    input.value = newValue;
    input.dispatchEvent(new Event('change'));
}
