// Import necessary modules
import { categories } from './data.js';
import { consolidateItems } from './utils.js';

// Define the SupplyCalculator class
export default class SupplyCalculator {
    /**
     * Constructs the SupplyCalculator.
     * @param {Object} inputs - User inputs.
     * @param {Array<string>} selectedCategories - Categories selected by the user.
     */
    constructor(inputs, selectedCategories) {
        // Initialize properties based on user inputs
        this.adults = inputs.adults;
        this.children = inputs.children;
        this.dogs = inputs.dogs;
        this.cats = inputs.cats;
        this.duration = inputs.duration;
        this.selectedCategories = selectedCategories;
        this.allItems = []; // Array to store all items before consolidation
    }

    /**
     * Generates all items required based on selected categories and duration.
     * @returns {Array<Object>}
     */
    generateAllItems() {
        this.allItems = []; // Reset allItems array
        this.selectedCategories.forEach(categoryKey => {
            const category = categories[categoryKey];
            if (category && category.items) {
                category.items.forEach(item => {
                    // Calculate per-day requirements for adults
                    const perAdult = (item.perAdultPerDay !== undefined) 
                        ? item.perAdultPerDay * this.duration 
                        : (item.perPersonPerDay !== undefined ? item.perPersonPerDay * this.duration : 0);
                    
                    // Calculate per-day requirements for children
                    const perChild = (item.perChildPerDay !== undefined) 
                        ? item.perChildPerDay * this.duration 
                        : (item.perPersonPerDay !== undefined ? item.perPersonPerDay * this.duration : 0);
                    
                    // Calculate per-day requirements for dogs
                    const perDog = (item.perDogPerDay !== undefined) 
                        ? item.perDogPerDay * this.duration 
                        : (item.perAnimalPerDay !== undefined ? item.perAnimalPerDay * this.duration : 0);
                    
                    // Calculate per-day requirements for cats
                    const perCat = (item.perCatPerDay !== undefined) 
                        ? item.perCatPerDay * this.duration 
                        : (item.perAnimalPerDay !== undefined ? item.perAnimalPerDay * this.duration : 0);

                    // Handle one-time items and items shared among group members
                    let perPerson = item.perPerson !== undefined ? item.perPerson : 0;
                    let perHousehold = item.perHousehold !== undefined ? item.perHousehold : 0;
                    let perFamily = item.perFamily !== undefined ? item.perFamily : 0;
                    const thresholdDuration = item.thresholdDuration || 0;
                    const sharedAmong = item.sharedAmong || 1;

                    // If duration is less than thresholdDuration, the item is not needed
                    if (this.duration < thresholdDuration) {
                        perHousehold = 0;
                        perFamily = 0;
                    }

                    // Adjust perHousehold or perFamily items based on sharedAmong group members
                    if (sharedAmong > 1) {
                        perHousehold = perHousehold > 0 ? Math.ceil(perHousehold / sharedAmong) : 0;
                        perFamily = perFamily > 0 ? Math.ceil(perFamily / sharedAmong) : 0;
                    }

                    // Create new item object with calculated quantities
                    const newItem = {
                        name: item.name,
                        perAdult: perAdult + perPerson,
                        perChild: perChild + perPerson,
                        perDog: perDog,
                        perCat: perCat,
                        perHousehold: perHousehold,
                        perFamily: perFamily,
                        unit: item.unit
                    };

                    // Add the new item to the allItems array
                    this.allItems.push(newItem);
                });
            }
        });

        // Return consolidated items
        return consolidateItems(this.allItems);
    }

    /**
     * Calculates the total quantity needed for each item.
     * @param {Array<Object>} consolidatedItems
     * @returns {Array<Object>}
     */
    calculateTotals(consolidatedItems) {
        // Map over consolidated items to calculate total quantities
        return consolidatedItems.map(item => {
            const total = (item.perAdult * this.adults) +
                          (item.perChild * this.children) +
                          (item.perDog * this.dogs) +
                          (item.perCat * this.cats) +
                          item.perHousehold +  // Not multiplied by count
                          item.perFamily;      // Not multiplied by count

            // Return item with total quantity included
            return { ...item, total };
        });
    }

    /**
     * Returns the final supply list with total quantities.
     * @returns {Object}
     */
    getSupplyList() {
        // Generate and consolidate all items
        const consolidatedItems = this.generateAllItems();
        // Calculate total quantities for each item
        return this.calculateTotals(consolidatedItems);
    }
}
