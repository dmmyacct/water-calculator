// utils.js

/**
 * Formats a number to have up to two decimal places if necessary.
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
    const number = parseFloat(num);
    return Number.isInteger(number) ? number.toString() : number.toFixed(2);
}

/**
 * Consolidates items with the same name by summing their quantities.
 * @param {Array<Object>} items
 * @returns {Array<Object>}
 */
export function consolidateItems(items) {
    const itemMap = {};

    items.forEach(item => {
        if (!itemMap[item.name]) {
            // Initialize all properties if the item is not yet in the map
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
            // Sum up all relevant properties
            itemMap[item.name].perAdult += item.perAdult || 0;
            itemMap[item.name].perChild += item.perChild || 0;
            itemMap[item.name].perDog += item.perDog || 0;
            itemMap[item.name].perCat += item.perCat || 0;
            itemMap[item.name].perHousehold += item.perHousehold || 0;
            itemMap[item.name].perFamily += item.perFamily || 0;
        }
    });

    return Object.values(itemMap);
}

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
