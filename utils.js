import { UnitSystem } from './unitSystem.js';

/**
 * Formats a number to have up to two decimal places if necessary and adds commas for thousands.
 * @param {number} num - The number to format.
 * @returns {string} - Formatted number as a string.
 */
export function formatNumber(num) {
    const number = parseFloat(num);
    
    // Format the number with appropriate decimal places
    const formattedNum = Number.isInteger(number) ? number : number.toFixed(2);
    
    // Add commas for thousands and return
    return formattedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Consolidates items with the same name by summing their quantities.
 * @param {Array<Object>} items - Array of item objects.
 * @returns {Array<Object>} - Consolidated array of items.
 */
export function consolidateItems(items) {
    const itemMap = {};

    items.forEach(item => {
        if (!itemMap[item.name]) {
            // Initialize item in map if it doesn't exist
            itemMap[item.name] = { ...item };
        } else {
            // Sum up quantities for existing item
            ['perAdult', 'perChild', 'perDog', 'perCat', 'perHousehold', 'perFamily'].forEach(prop => {
                itemMap[item.name][prop] += item[prop] || 0;
            });
        }
    });

    // For debugging, log the consolidated items
    console.log('Consolidated items:', Object.values(itemMap));

    return Object.values(itemMap);
}

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - Time in milliseconds to wait.
 * @returns {Function} - Debounced function.
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        // Clear any existing timeout
        clearTimeout(timeout);
        // Set a new timeout to call the function after the wait period
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Formats liquid measurements based on user preference
 * @param {number} amount - The amount in original units (gallons)
 * @param {string} targetUnit - The desired unit of measurement
 * @returns {number} - Converted amount
 */
export function convertLiquidMeasurement(amount, fromUnit, toUnit) {
    return UnitSystem.convertUnit(amount, fromUnit, toUnit);
}
