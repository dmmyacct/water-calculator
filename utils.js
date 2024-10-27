// utils.js

/**
 * Formats a number to have up to two decimal places if necessary.
 * @param {number} num - The number to format.
 * @returns {string} - Formatted number as a string.
 */
export function formatNumber(num) {
    const number = parseFloat(num);
    // Return integer as string or fixed decimal places
    return Number.isInteger(number) ? number.toString() : number.toFixed(2);
}

/**
 * Consolidates items with the same name by summing their quantities.
 * @param {Array<Object>} items - Array of item objects.
 * @returns {Array<Object>} - Consolidated array of items.
 */
export function consolidateItems(items) {
    const itemMap = {};

    // Iterate over each item to consolidate
    items.forEach(item => {
        if (!itemMap[item.name]) {
            // Initialize item in map if it doesn't exist
            itemMap[item.name] = {
                name: item.name,
                quantity: item.quantity,
                unit: item.unit
            };
        } else {
            // Sum up quantities for existing item
            itemMap[item.name].quantity += item.quantity;
        }
    });

    // Return consolidated items as an array
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
