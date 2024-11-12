import SupplyCalculator from './SupplyCalculator.js';
import { formatNumber, debounce, convertLiquidMeasurement } from './utils.js';
import { categoryGroups, categories } from './data.js';
import { DefaultsManager } from './defaultsManager.js';
import { UnitSystem } from './unitSystem.js';

let currentLiquidUnit = 'gallons'; // Default unit
let currentUnitSystem = 'imperial'; // Default unit system

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
        
        const editDefaultsBtn = document.createElement('button');
        editDefaultsBtn.innerHTML = '⚙️';
        editDefaultsBtn.title = 'Edit Default Values';
        editDefaultsBtn.classList.add('edit-defaults-btn');
        editDefaultsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showDefaultsEditor(group);
        });
        
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
        
        buttonContainer.appendChild(editDefaultsBtn);
        buttonContainer.appendChild(selectGroupBtn);
        buttonContainer.appendChild(deselectGroupBtn);
        
        const groupTitle = document.createElement('div');
        groupTitle.classList.add('group-title-wrapper');
        
        const titleText = document.createElement('h4');
        titleText.textContent = group.name;
        
        const infoIcon = document.createElement('span');
        infoIcon.classList.add('info-icon');
        infoIcon.innerHTML = 'ⓘ';
        
        const tooltip = document.createElement('div');
        tooltip.classList.add('category-tooltip');
        tooltip.textContent = group.description;
        
        groupTitle.appendChild(titleText);
        groupTitle.appendChild(infoIcon);
        groupTitle.appendChild(tooltip);
        
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
                const labelWrapper = document.createElement('div');
                labelWrapper.classList.add('category-label-wrapper');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('category-checkbox');
                checkbox.value = categoryKey;
                checkbox.checked = true;
                checkbox.addEventListener('change', () => updateTable());

                const labelText = document.createTextNode(` ${category.name}`);
                
                const categoryInfoIcon = document.createElement('span');
                categoryInfoIcon.classList.add('info-icon', 'category-info');
                categoryInfoIcon.innerHTML = 'ⓘ';
                
                const categoryTooltip = document.createElement('div');
                categoryTooltip.classList.add('category-tooltip');
                categoryTooltip.textContent = category.description;
                
                labelWrapper.appendChild(checkbox);
                labelWrapper.appendChild(labelText);
                labelWrapper.appendChild(categoryInfoIcon);
                labelWrapper.appendChild(categoryTooltip);
                
                label.appendChild(labelWrapper);
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
    const table = document.querySelector('#supply-table');
    let thead = table.querySelector('thead');
    if (!thead) {
        thead = document.createElement('thead');
        table.insertBefore(thead, table.firstChild);
    }
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Item</th><th>Category</th>';

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
    thead.innerHTML = '';
    thead.appendChild(headerRow);
}

/**
 * Populates the table rows with supply data
 * @param {Array} supplyList - List of supplies to display
 * @param {Object} inputs - Current input values for adults, children, dogs, and cats
 */
function populateTableRows(supplyList, inputs) {
    const table = document.querySelector('#supply-table');
    let tbody = table.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        table.appendChild(tbody);
    }
    
    tbody.innerHTML = '';

    if (!supplyList || supplyList.length === 0) {
        const emptyRow = document.createElement('tr');
        const colspan = 3 + inputs.adults + inputs.children + inputs.dogs + inputs.cats;
        emptyRow.innerHTML = `<td colspan="${colspan}">No items to display</td>`;
        tbody.appendChild(emptyRow);
        return;
    }

    // Group items by their parent category group
    const groupedItems = supplyList.reduce((acc, item) => {
        // Find the category group that contains this item's category
        const groupEntry = Object.entries(categoryGroups).find(([_, group]) => 
            group.categories.some(cat => categories[cat].name === item.category)
        );
        
        if (groupEntry) {
            const [groupKey, group] = groupEntry;
            if (!acc[groupKey]) {
                acc[groupKey] = {
                    name: group.name,
                    items: []
                };
            }
            acc[groupKey].items.push(item);
        }
        return acc;
    }, {});

    // Iterate through grouped items
    let categoryIndex = 0;
    Object.entries(groupedItems).forEach(([groupKey, group]) => {
        // Add category group header row
        const categoryRow = document.createElement('tr');
        categoryRow.classList.add('category-header');
        categoryRow.dataset.category = groupKey;
        categoryRow.dataset.index = categoryIndex++;
        const colspan = 3 + inputs.adults + inputs.children + inputs.dogs + inputs.cats;
        categoryRow.innerHTML = `<td colspan="${colspan}">${group.name}</td>`;
        tbody.appendChild(categoryRow);

        // Add items for this category group
        group.items.forEach(item => {
            const row = document.createElement('tr');
            let rowHTML = `<td>${item.name}</td><td>${item.category}</td>`;

            // Function to format value with unit
            const formatValueWithUnit = (value, itemUnit, itemName) => {
                if (!value) return '0';
                
                // Convert the value based on the current unit system
                const convertedValue = UnitSystem.convertValue(value, itemUnit, currentUnitSystem);
                const displayUnit = UnitSystem.getDisplayUnit(itemUnit, currentUnitSystem);
                
                return `${formatNumber(convertedValue)} ${displayUnit}`;
            };

            // Add cells for each adult
            for (let i = 0; i < inputs.adults; i++) {
                rowHTML += `<td>${formatValueWithUnit(item.perAdult || 0, item.unit, item.name)}</td>`;
            }

            // Add cells for each child
            for (let i = 0; i < inputs.children; i++) {
                rowHTML += `<td>${formatValueWithUnit(item.perChild || 0, item.unit, item.name)}</td>`;
            }

            // Add cells for each dog
            for (let i = 0; i < inputs.dogs; i++) {
                rowHTML += `<td>${formatValueWithUnit(item.perDog || 0, item.unit, item.name)}</td>`;
            }

            // Add cells for each cat
            for (let i = 0; i < inputs.cats; i++) {
                rowHTML += `<td>${formatValueWithUnit(item.perCat || 0, item.unit, item.name)}</td>`;
            }

            // Add total column
            let displayTotal = item.total;
            let displayUnit = item.unit;
            
            if (item.name.toLowerCase().includes('water')) {
                displayTotal = convertLiquidMeasurement(item.total, currentLiquidUnit);
                displayUnit = currentLiquidUnit;
            }
            
            rowHTML += `<td class="total-column">${formatNumber(displayTotal)} ${getUnitLabel(displayUnit)}</td>`;
            
            row.innerHTML = rowHTML;
            tbody.appendChild(row);
        });
    });

    setupStickyCategoryHeaders();
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
 * Creates and adds the unit system selector to the form
 */
function addUnitSystemSelector() {
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group', 'unit-system-input');
    
    const label = document.createElement('label');
    label.htmlFor = 'unit-system';
    label.textContent = 'Measurement System:';
    
    const select = document.createElement('select');
    select.id = 'unit-system';
    select.name = 'unit-system';
    
    const systems = [
        { value: 'imperial', label: 'Imperial (US)' },
        { value: 'metric', label: 'Metric' }
    ];
    
    systems.forEach(system => {
        const option = document.createElement('option');
        option.value = system.value;
        option.textContent = system.label;
        if (system.value === currentUnitSystem) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
        currentUnitSystem = e.target.value;
        updateTable();
    });
    
    inputGroup.appendChild(label);
    inputGroup.appendChild(select);
    
    // Insert after the liquid unit selector
    const liquidUnitGroup = document.querySelector('#liquid-unit').closest('.input-group');
    liquidUnitGroup.after(inputGroup);
}

/**
 * Initializes event listeners and updates the table on load.
 */
export function initialize() {
    generateCategoryGroups();
    initializeInputControls();
    addLiquidUnitSelector();
    addUnitSystemSelector();
    addSearchBar();
    addResetButton();
    addSaveExportButtons();
    
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

    initializeStickyHeaders();
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
    setupStickyCategoryHeaders();

    // Log the table structure
    console.log('Table structure:', document.querySelector('#supply-table').outerHTML);
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
    // Add tooltips to input groups
    const tooltips = {
        adults: {
            title: "Number of Adults (18+ years)",
            help: "Include all household members aged 18 and above"
        },
        children: {
            title: "Number of Children (under 18)",
            help: "Include all household members under 18 years of age"
        },
        dogs: {
            title: "Number of Dogs",
            help: "Include all dogs in your household"
        },
        cats: {
            title: "Number of Cats",
            help: "Include all cats in your household"
        },
        duration: {
            title: "Duration of Supply",
            help: "Select how many days of supplies you want to prepare"
        },
        'liquid-unit': {
            title: "Liquid Measurement Unit",
            help: "Choose your preferred unit for liquid measurements"
        }
    };

    // Add help icons and tooltips to each input group
    document.querySelectorAll('.input-group').forEach(group => {
        const input = group.querySelector('input, select');
        if (input && tooltips[input.id]) {
            addHelpIcon(group, tooltips[input.id]);
        }

        // Add input-specific classes
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

    // Initialize spinbutton controls
    initializeSpinButtons();
}

function addHelpIcon(group, tooltipInfo) {
    const labelContainer = document.createElement('div');
    labelContainer.classList.add('label-container');
    
    // Move the existing label into the container
    const existingLabel = group.querySelector('label');
    labelContainer.appendChild(existingLabel);
    
    // Create help icon
    const helpIcon = document.createElement('span');
    helpIcon.classList.add('help-icon');
    helpIcon.innerHTML = '?';
    helpIcon.setAttribute('role', 'button');
    helpIcon.setAttribute('tabindex', '0');
    helpIcon.setAttribute('aria-label', 'Help');
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    
    const tooltipTitle = document.createElement('strong');
    tooltipTitle.textContent = tooltipInfo.title;
    
    const tooltipText = document.createElement('p');
    tooltipText.textContent = tooltipInfo.help;
    
    tooltip.appendChild(tooltipTitle);
    tooltip.appendChild(tooltipText);
    
    // Add tooltip to help icon
    helpIcon.appendChild(tooltip);
    
    // Add help icon to label container
    labelContainer.appendChild(helpIcon);
    
    // Insert label container at the start of the input group
    group.insertBefore(labelContainer, group.firstChild);
    
    // Add keyboard support for accessibility
    helpIcon.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            helpIcon.classList.toggle('tooltip-active');
        }
    });
    
    // Add click support
    helpIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        helpIcon.classList.toggle('tooltip-active');
    });
    
    // Close tooltip when clicking outside
    document.addEventListener('click', () => {
        helpIcon.classList.remove('tooltip-active');
    });
}

function initializeSpinButtons() {
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

function showDefaultsEditor(group) {
    const modal = document.createElement('div');
    modal.classList.add('defaults-modal');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('defaults-modal-content');
    
    const header = document.createElement('h3');
    header.textContent = `Edit Default Values - ${group.name}`;
    
    const itemsContainer = document.createElement('div');
    itemsContainer.classList.add('defaults-items');
    
    // Create input fields for each item in the category
    group.categories.forEach(categoryKey => {
        const category = categories[categoryKey];
        category.items.forEach(item => {
            const itemEditor = createItemEditor(item);
            itemsContainer.appendChild(itemEditor);
        });
    });
    
    // Add save and cancel buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-buttons');
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Changes';
    saveBtn.addEventListener('click', () => saveDefaultValues(modal));
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => modal.remove());
    
    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    
    modalContent.appendChild(header);
    modalContent.appendChild(itemsContainer);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function createItemEditor(item) {
    const container = document.createElement('div');
    container.classList.add('item-editor');
    
    const nameLabel = document.createElement('div');
    nameLabel.textContent = item.name;
    
    const inputs = {
        perAdultPerDay: createNumberInput(item.perAdultPerDay, 'Per Adult/Day', 'adult'),
        perChildPerDay: createNumberInput(item.perChildPerDay, 'Per Child/Day', 'child'),
        perDogPerDay: createNumberInput(item.perDogPerDay, 'Per Dog/Day', 'dog'),
        perCatPerDay: createNumberInput(item.perCatPerDay, 'Per Cat/Day', 'cat')
    };
    
    container.appendChild(nameLabel);
    Object.values(inputs).forEach(input => container.appendChild(input));
    
    return container;
}

function createNumberInput(value, label, type) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('number-input-wrapper');
    
    const input = document.createElement('input');
    input.type = 'number';
    input.value = value || 0;
    input.step = 'any';
    input.min = 0;
    input.dataset.type = type; // Add data attribute for type
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    
    wrapper.appendChild(labelElement);
    wrapper.appendChild(input);
    
    return wrapper;
}

/**
 * Saves the default values from the modal editor
 * @param {HTMLElement} modal - The modal element containing the editors
 */
function saveDefaultValues(modal) {
    const defaultsManager = new DefaultsManager();
    const itemEditors = modal.querySelectorAll('.item-editor');
    
    itemEditors.forEach(editor => {
        const itemName = editor.querySelector('div').textContent; // Get item name from first div
        const inputs = editor.querySelectorAll('input[type="number"]');
        
        // Get values from inputs in order (adult, child, dog, cat)
        const [adultInput, childInput, dogInput, catInput] = inputs;
        
        // Save each value if it's different from 0
        if (adultInput?.value) {
            defaultsManager.setItemDefault(itemName, 'perAdultPerDay', parseFloat(adultInput.value));
        }
        if (childInput?.value) {
            defaultsManager.setItemDefault(itemName, 'perChildPerDay', parseFloat(childInput.value));
        }
        if (dogInput?.value) {
            defaultsManager.setItemDefault(itemName, 'perDogPerDay', parseFloat(dogInput.value));
        }
        if (catInput?.value) {
            defaultsManager.setItemDefault(itemName, 'perCatPerDay', parseFloat(catInput.value));
        }
    });

    // Update the table with new values
    updateTable();
    
    // Close the modal
    modal.remove();
}

function setupStickyCategoryHeaders() {
    const tableSection = document.querySelector('#table-section');
    const categoryHeaders = document.querySelectorAll('.category-header');
    const tableHeader = document.querySelector('#supply-table thead');
    const tableHeaderHeight = tableHeader.offsetHeight;

    let lastActiveHeader = null;

    function updateStickyHeaders() {
        const scrollPosition = tableSection.scrollTop;
        let activeHeader = null;

        categoryHeaders.forEach((header) => {
            const headerTop = header.offsetTop - tableHeaderHeight;
            const headerBottom = headerTop + header.offsetHeight;

            if (scrollPosition >= headerTop && scrollPosition < headerBottom) {
                activeHeader = header;
            }
        });

        if (activeHeader !== lastActiveHeader) {
            if (lastActiveHeader) {
                lastActiveHeader.classList.remove('sticky-active');
                lastActiveHeader.style.top = '';
            }
            if (activeHeader) {
                activeHeader.classList.add('sticky-active');
                activeHeader.style.top = `${tableHeaderHeight}px`;
            }
            lastActiveHeader = activeHeader;
        }
    }

    tableSection.addEventListener('scroll', updateStickyHeaders);
    updateStickyHeaders(); // Initial call to set the correct header
}

function addSearchBar() {
    const tableSection = document.querySelector('#table-section');
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'supply-search';
    searchInput.placeholder = 'Search supplies...';
    
    // Add search event listener
    searchInput.addEventListener('input', debounce(filterSupplyTable, 300));
    
    searchContainer.appendChild(searchInput);
    tableSection.insertBefore(searchContainer, tableSection.firstChild);
}

function filterSupplyTable() {
    const searchTerm = document.getElementById('supply-search').value.toLowerCase();
    const rows = document.querySelectorAll('#supply-table tbody tr');
    
    let currentGroup = null;
    let groupHasVisibleItems = false;
    
    rows.forEach(row => {
        if (row.classList.contains('category-header')) {
            // If we have a previous group, show/hide it based on whether it had visible items
            if (currentGroup) {
                currentGroup.style.display = groupHasVisibleItems ? '' : 'none';
            }
            // Start new group
            currentGroup = row;
            groupHasVisibleItems = false;
        } else {
            const itemName = row.cells[0]?.textContent.toLowerCase() || '';
            const category = row.cells[1]?.textContent.toLowerCase() || '';
            const isMatch = itemName.includes(searchTerm) || category.includes(searchTerm);
            
            row.style.display = isMatch ? '' : 'none';
            if (isMatch) {
                groupHasVisibleItems = true;
            }
        }
    });
    
    // Handle the last group
    if (currentGroup) {
        currentGroup.style.display = groupHasVisibleItems ? '' : 'none';
    }
}

function addResetButton() {
    const controlsDiv = document.querySelector('.category-controls');
    
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '↺ Reset Defaults';
    resetBtn.classList.add('reset-defaults-btn');
    resetBtn.type = 'button';
    resetBtn.addEventListener('click', showResetConfirmation);
    
    controlsDiv.appendChild(resetBtn);
}

function showResetConfirmation() {
    const modal = document.createElement('div');
    modal.classList.add('reset-modal');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('reset-modal-content');
    
    const header = document.createElement('h3');
    header.textContent = 'Reset to Defaults';
    
    const message = document.createElement('p');
    message.textContent = 'This will reset all custom values to their original defaults. This action cannot be undone. Do you want to continue?';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-buttons');
    
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Reset';
    confirmBtn.classList.add('confirm-reset-btn');
    confirmBtn.addEventListener('click', () => {
        resetAllDefaults();
        modal.remove();
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.classList.add('cancel-btn');
    cancelBtn.addEventListener('click', () => modal.remove());
    
    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    
    modalContent.appendChild(header);
    modalContent.appendChild(message);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
}

function resetAllDefaults() {
    // Reset defaults
    const defaultsManager = new DefaultsManager();
    defaultsManager.resetToDefaults();
    
    // Reset form inputs
    document.getElementById('adults').value = '1';
    document.getElementById('children').value = '0';
    document.getElementById('dogs').value = '0';
    document.getElementById('cats').value = '0';
    document.getElementById('duration').value = '1';
    document.getElementById('unit-system').value = 'imperial';
    
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Update the table
    updateTable();
    
    // Show success message
    showToast('Settings reset to defaults');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast-message');
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Adds save and export buttons to the table section
 */
function addSaveExportButtons() {
    const tableSection = document.querySelector('#table-section');
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action-buttons-container');
    
    // Primary Actions Group
    const primaryActions = document.createElement('div');
    primaryActions.classList.add('action-buttons-group', 'primary-actions');
    
    const saveButton = document.createElement('button');
    saveButton.innerHTML = '💾 Save Plan';
    saveButton.classList.add('action-btn', 'primary-btn');
    saveButton.addEventListener('click', savePlan);
    
    const loadButton = document.createElement('button');
    loadButton.innerHTML = '📂 Load Plan';
    loadButton.classList.add('action-btn', 'primary-btn');
    loadButton.addEventListener('click', loadPlan);
    
    primaryActions.appendChild(saveButton);
    primaryActions.appendChild(loadButton);
    
    // Export Actions Group
    const exportActions = document.createElement('div');
    exportActions.classList.add('action-buttons-group', 'export-actions');
    
    const pdfButton = document.createElement('button');
    pdfButton.innerHTML = '📄 Export PDF';
    pdfButton.classList.add('action-btn', 'secondary-btn');
    pdfButton.addEventListener('click', exportToPDF);
    
    const csvButton = document.createElement('button');
    csvButton.innerHTML = '📊 Export CSV';
    csvButton.classList.add('action-btn', 'secondary-btn');
    csvButton.addEventListener('click', exportToCSV);
    
    exportActions.appendChild(pdfButton);
    exportActions.appendChild(csvButton);
    
    buttonContainer.appendChild(primaryActions);
    buttonContainer.appendChild(exportActions);
    
    // Insert buttons at the top of the table section
    tableSection.insertBefore(buttonContainer, tableSection.firstChild);
}

/**
 * Saves the current plan to localStorage and allows download as JSON
 */
function savePlan() {
    const plan = {
        inputs: getInputValues(),
        selectedCategories: getSelectedCategories(),
        timestamp: new Date().toISOString(),
        name: `Emergency Supply Plan - ${new Date().toLocaleDateString()}`
    };
    
    // Save to localStorage
    const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
    savedPlans.push(plan);
    localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emergency-supply-plan-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Plan saved successfully');
}

/**
 * Loads a saved plan from a file or localStorage
 */
function loadPlan() {
    const modal = document.createElement('div');
    modal.classList.add('load-plan-modal');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('load-plan-content');
    
    const header = document.createElement('h3');
    header.textContent = 'Load Saved Plan';
    
    // File upload section
    const fileSection = document.createElement('div');
    fileSection.classList.add('file-upload-section');
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', handleFileUpload);
    
    const fileLabel = document.createElement('label');
    fileLabel.textContent = 'Upload Plan File';
    fileLabel.appendChild(fileInput);
    
    fileSection.appendChild(fileLabel);
    
    // Saved plans section
    const savedSection = document.createElement('div');
    savedSection.classList.add('saved-plans-section');
    
    const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
    if (savedPlans.length > 0) {
        const savedHeader = document.createElement('h4');
        savedHeader.textContent = 'Saved Plans';
        savedSection.appendChild(savedHeader);
        
        savedPlans.forEach((plan, index) => {
            const planButton = document.createElement('button');
            planButton.classList.add('saved-plan-btn');
            planButton.innerHTML = `
                <span>${plan.name}</span>
                <span class="plan-date">${new Date(plan.timestamp).toLocaleDateString()}</span>
            `;
            planButton.addEventListener('click', () => {
                applySavedPlan(plan);
                modal.remove();
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-plan-btn');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSavedPlan(index);
                planButton.remove();
                if (savedSection.querySelectorAll('.saved-plan-btn').length === 0) {
                    savedSection.innerHTML = '<p>No saved plans</p>';
                }
            });
            
            planButton.appendChild(deleteBtn);
            savedSection.appendChild(planButton);
        });
    } else {
        savedSection.innerHTML = '<p>No saved plans</p>';
    }
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.classList.add('close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modalContent.appendChild(header);
    modalContent.appendChild(fileSection);
    modalContent.appendChild(savedSection);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Handles file upload for loading a plan
 * @param {Event} event - The file input change event
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const plan = JSON.parse(e.target.result);
                applySavedPlan(plan);
                event.target.closest('.load-plan-modal').remove();
            } catch (error) {
                showToast('Error loading plan file', 'error');
            }
        };
        reader.readAsText(file);
    }
}

/**
 * Applies a saved plan to the current form
 * @param {Object} plan - The plan to apply
 */
function applySavedPlan(plan) {
    // Apply input values
    const inputs = plan.inputs;
    Object.keys(inputs).forEach(key => {
        const input = document.getElementById(key);
        if (input) input.value = inputs[key];
    });
    
    // Apply selected categories
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = plan.selectedCategories.includes(checkbox.value);
    });
    
    updateTable();
    showToast('Plan loaded successfully');
}

/**
 * Deletes a saved plan from localStorage
 * @param {number} index - The index of the plan to delete
 */
function deleteSavedPlan(index) {
    const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]');
    savedPlans.splice(index, 1);
    localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
    showToast('Plan deleted');
}

/**
 * Exports the current supply table to PDF
 */
function exportToPDF() {
    try {
        const element = document.querySelector('#supply-table');
        const opt = {
            margin: 1,
            filename: `emergency-supply-plan-${new Date().toISOString()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        
        // Generate PDF using the globally available html2pdf
        html2pdf().set(opt).from(element).save();
        showToast('PDF export started');
    } catch (error) {
        showToast('Error exporting PDF', 'error');
        console.error('PDF export error:', error);
    }
}

/**
 * Exports the current supply table to CSV
 */
function exportToCSV() {
    const table = document.querySelector('#supply-table');
    let csv = [];
    
    // Get headers
    const headers = [];
    table.querySelectorAll('th').forEach(th => headers.push(th.textContent));
    csv.push(headers.join(','));
    
    // Get rows
    table.querySelectorAll('tbody tr').forEach(tr => {
        if (!tr.classList.contains('category-header')) {
            const row = [];
            tr.querySelectorAll('td').forEach(td => {
                row.push(`"${td.textContent.trim()}"`);
            });
            csv.push(row.join(','));
        }
    });
    
    // Download CSV file
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emergency-supply-plan-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('CSV exported successfully');
}

function initializeStickyHeaders() {
    const tableContainer = document.querySelector('.table-container');
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    tableContainer.addEventListener('scroll', () => {
        let activeHeader = null;
        const containerTop = tableContainer.getBoundingClientRect().top;
        const scrollTop = tableContainer.scrollTop;
        
        categoryHeaders.forEach((header) => {
            const headerTop = header.offsetTop - scrollTop;
            const nextHeader = header.nextElementSibling;
            const nextHeaderTop = nextHeader ? nextHeader.offsetTop - scrollTop : Infinity;
            
            if (headerTop <= containerTop && nextHeaderTop > containerTop) {
                activeHeader = header;
            }
        });
        
        // Update active state
        categoryHeaders.forEach(header => {
            if (header === activeHeader) {
                header.classList.add('sticky-active');
            } else {
                header.classList.remove('sticky-active');
            }
        });
    });
}
