// Import necessary modules
import { categories } from './data.js';
import { consolidateItems } from './utils.js';
import { DefaultsManager } from './defaultsManager.js';

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
        this.defaultsManager = new DefaultsManager();
        // Initialize the defaultsManager
        this.defaultsManager.initialize();
    }

    /**
     * Generates all items required based on selected categories and duration.
     * @returns {Array<Object>}
     */
    async generateAllItems() {
        this.allItems = []; // Reset allItems array
        for (const categoryKey of this.selectedCategories) {
            const category = categories[categoryKey];
            if (category && category.items) {
                for (const item of category.items) {
                    // Get the daily requirements asynchronously
                    const perAdultDaily = await this.getItemQuantity(item, 'perAdultPerDay') || 0;
                    const perChildDaily = await this.getItemQuantity(item, 'perChildPerDay') || 0;
                    const perDogDaily = await this.getItemQuantity(item, 'perDogPerDay') || 0;
                    const perCatDaily = await this.getItemQuantity(item, 'perCatPerDay') || 0;

                    // Calculate total requirements for the duration
                    const perAdult = perAdultDaily * this.duration;
                    const perChild = perChildDaily * this.duration;
                    const perDog = perDogDaily * this.duration;
                    const perCat = perCatDaily * this.duration;

                    // Handle one-time items
                    const perPerson = item.perPerson || 0;
                    const perHousehold = item.perHousehold || 0;
                    const perFamily = item.perFamily || 0;

                    // Create new item object with calculated quantities
                    const newItem = {
                        name: item.name,
                        category: category.name,
                        perAdult,
                        perChild,
                        perDog,
                        perCat,
                        perHousehold,
                        perFamily,
                        unit: item.unit
                    };

                    this.allItems.push(newItem);
                }
            }
        }

        return consolidateItems(this.allItems);
    }

    /**
     * Calculates the total quantity needed for each item.
     * @param {Array<Object>} consolidatedItems
     * @returns {Array<Object>}
     */
    calculateTotals(consolidatedItems) {
        return consolidatedItems.map(item => {
            // Calculate total based on per-person quantities and counts
            const total = (
                (item.perAdult * this.adults) +
                (item.perChild * this.children) +
                (item.perDog * this.dogs) +
                (item.perCat * this.cats) +
                item.perHousehold +
                item.perFamily
            );

            // For debugging
            console.log(`Calculating total for ${item.name}:`, {
                perAdult: item.perAdult,
                adults: this.adults,
                adultTotal: item.perAdult * this.adults,
                perChild: item.perChild,
                children: this.children,
                childTotal: item.perChild * this.children,
                perDog: item.perDog,
                dogs: this.dogs,
                dogTotal: item.perDog * this.dogs,
                perCat: item.perCat,
                cats: this.cats,
                catTotal: item.perCat * this.cats,
                perHousehold: item.perHousehold,
                perFamily: item.perFamily,
                finalTotal: total
            });

            return { ...item, total };
        });
    }

    /**
     * Returns the final supply list with total quantities.
     * @returns {Object}
     */
    async getSupplyList() {
        // Generate and consolidate all items
        const consolidatedItems = await this.generateAllItems();
        // Calculate total quantities for each item
        return this.calculateTotals(consolidatedItems);
    }

    async getItemQuantity(item, type) {
        const defaultValue = await this.defaultsManager.getItemDefault(item.name, type);
        return defaultValue !== undefined ? defaultValue : item[type];
    }

    ensureMinimumQuantities(item) {
        if (this.adults > 0 || this.children > 0) {
            item.perPerson = Math.max(item.perPerson || 0, 1);
        }
        return item;
    }
}
