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
        // Initialize total nutrition counters
        this.totalNutrition = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0
        };
    }

    /**
     * Generates all items required based on selected categories and duration.
     * @returns {Array<Object>}
     */
    generateAllItems() {
        // Iterate over each selected category
        this.selectedCategories.forEach(categoryKey => {
            const category = categories[categoryKey];
            if (category && category.items) {
                // Iterate over each item in the category
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
                        perHousehold: perHousehold,  // Not multiplied by count
                        perFamily: perFamily,        // Not multiplied by count
                        unit: item.unit,
                        caloriesPerUnit: item.caloriesPerUnit || 0,
                        proteinPerUnit: item.proteinPerUnit || 0,
                        fatPerUnit: item.fatPerUnit || 0,
                        carbsPerUnit: item.carbsPerUnit || 0
                    };

                    // Calculate nutrition contributions if the item is in the Nutrition category
                    if (categoryKey === 'nutrition') {
                        this.calculateNutrition(newItem, perAdult, perChild, perDog, perCat);
                    }

                    // Add the new item to the allItems array
                    this.allItems.push(newItem);
                });
            }
        });

        // Consolidate items with the same name
        return consolidateItems(this.allItems);
    }

    /**
     * Calculates nutrition contributions from a nutrition item.
     * @param {Object} item - The item object.
     * @param {number} perAdult - Quantity per adult.
     * @param {number} perChild - Quantity per child.
     * @param {number} perDog - Quantity per dog.
     * @param {number} perCat - Quantity per cat.
     */
    calculateNutrition(item, perAdult, perChild, perDog, perCat) {
        // Total quantity for the nutrition item
        const totalQuantity = (perAdult * this.adults) +
                              (perChild * this.children) +
                              (perDog * this.dogs) +
                              (perCat * this.cats);

        // Update total nutrition counters based on item name
        switch(item.name) {
            case "Calories":
                this.totalNutrition.calories += totalQuantity;
                break;
            case "Protein":
                this.totalNutrition.protein += totalQuantity;
                break;
            case "Fat":
                this.totalNutrition.fat += totalQuantity;
                break;
            case "Carbohydrates":
                this.totalNutrition.carbs += totalQuantity;
                break;
            default:
                break;
        }
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
     * Returns the final supply list with total quantities and nutritional summary.
     * @returns {Object}
     */
    getSupplyList() {
        // Generate and consolidate all items
        const consolidatedItems = this.generateAllItems();
        // Calculate total quantities for each item
        const supplyList = this.calculateTotals(consolidatedItems);

        // Return the supply list and total nutrition
        return {
            supplyList,
            totalNutrition: this.totalNutrition
        };
    }
}
