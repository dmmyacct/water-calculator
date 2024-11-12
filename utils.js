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

    // Iterate over each item to consolidate
    items.forEach(item => {
        if (!itemMap[item.name]) {
            // Initialize item in map if it doesn't exist
            itemMap[item.name] = {
                name: item.name,
                perAdult: item.perAdult || 0,
                perChild: item.perChild || 0,
                perDog: item.perDog || 0,
                perCat: item.perCat || 0,
                perHousehold: item.perHousehold || 0,
                perFamily: item.perFamily || 0,
                unit: item.unit
            };
        } else {
            // Sum up quantities for existing item
            itemMap[item.name].perAdult += item.perAdult || 0;
            itemMap[item.name].perChild += item.perChild || 0;
            itemMap[item.name].perDog += item.perDog || 0;
            itemMap[item.name].perCat += item.perCat || 0;
            itemMap[item.name].perHousehold += item.perHousehold || 0;
            itemMap[item.name].perFamily += item.perFamily || 0;
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

/**
 * Liquid conversion rates relative to milliliters
 */
export const liquidConversions = {
    'milliliters': 1,
    'liters': 1000,
    'fluid_ounces': 29.5735,
    'cups': 236.588,
    'pints': 473.176,
    'quarts': 946.353,
    'gallons': 3785.41
};

/**
 * Formats liquid measurements based on user preference
 * @param {number} amount - The amount in original units (gallons)
 * @param {string} targetUnit - The desired unit of measurement
 * @returns {number} - Converted amount
 */
export function convertLiquidMeasurement(amount, targetUnit) {
    // Convert from gallons to milliliters first
    const milliliters = amount * liquidConversions['gallons'];
    // Then convert to target unit
    return milliliters / liquidConversions[targetUnit];
}
