// SupplyCalculator.js

// Import necessary modules
import { categories, dailyRequirements } from './data.js';
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
        this.people = inputs.people; // An array of people with their demographic keys
        this.animals = inputs.animals; // An array of animals with their type keys
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
        // Calculate individual requirements
        const individualRequirements = this.calculateIndividualRequirements();

        // Iterate over each selected category
        this.selectedCategories.forEach(categoryKey => {
            const category = categories[categoryKey];
            if (category && category.items) {
                // Iterate over each item in the category
                category.items.forEach(item => {
                    // For each individual
                    individualRequirements.forEach(req => {
                        const newItem = this.calculateItemForIndividual(item, req);
                        if (newItem) {
                            this.allItems.push(newItem);
                        }
                    });
                });
            }
        });

        // Consolidate items with the same name
        return consolidateItems(this.allItems);
    }

    /**
     * Calculates the individual requirements for each person and animal.
     * @returns {Array<Object>}
     */
    calculateIndividualRequirements() {
        const requirements = [];

        // Calculate for humans
        this.people.forEach(person => {
            const demographic = dailyRequirements.humans[person];
            if (demographic) {
                const weight = demographic.weight;
                const waterNeed = (demographic.waterPerKg * weight) + (demographic.extraWater || 0); // ml/day
                const calorieNeed = (demographic.caloriesPerKg * weight) + (demographic.extraCalories || 0); // kcal/day
                const proteinNeed = (demographic.proteinPerKg * weight) + (demographic.extraProtein || 0); // g/day

                requirements.push({
                    type: 'human',
                    name: person,
                    weight,
                    waterNeed,
                    calorieNeed,
                    proteinNeed
                });
            }
        });

        // Calculate for animals
        this.animals.forEach(animal => {
            const animalData = dailyRequirements.animals[animal];
            if (animalData) {
                const weight = animalData.weight;
                // Water need
                const waterNeed = animalData.waterPerKg * weight; // ml/day

                // Calorie need calculated using RER and activity factor
                let calorieNeed = 0;
                if (animalData.RER) {
                    const RER = 70 * Math.pow(weight, 0.75);
                    calorieNeed = RER * animalData.activityFactor;
                } else if (animalData.caloriesPerKg) {
                    calorieNeed = animalData.caloriesPerKg * weight;
                }

                requirements.push({
                    type: 'animal',
                    name: animal,
                    weight,
                    waterNeed,
                    calorieNeed,
                    proteinNeed: null // Can be added if data is available
                });
            }
        });

        return requirements;
    }

    /**
     * Calculates the required quantity of an item for an individual.
     * @param {Object} item - The item object.
     * @param {Object} individual - The individual requirement object.
     * @returns {Object|null}
     */
    calculateItemForIndividual(item, individual) {
        if (item.category === 'water') {
            // Calculate total water needed over the duration (in ml)
            const totalWaterNeeded = individual.waterNeed * this.duration; // ml

            // Calculate number of units needed
            const unitsNeeded = totalWaterNeeded / item.perUnitVolume;

            return {
                name: item.name,
                quantity: unitsNeeded,
                unit: item.unit
            };
        }

        if (item.category === 'food' || item.category === 'animal_food') {
            // Calculate total calories needed over the duration
            const totalCaloriesNeeded = individual.calorieNeed * this.duration;

            // Calculate number of units needed based on calories per unit
            const caloriesPerUnit = item.caloriesPerUnit * (item.unitWeight / 100);
            const unitsNeeded = totalCaloriesNeeded / caloriesPerUnit;

            // Accumulate nutritional information for humans
            if (individual.type === 'human') {
                this.totalNutrition.calories += item.caloriesPerUnit * unitsNeeded * (item.unitWeight / 100) * this.duration;
                this.totalNutrition.protein += item.proteinPerUnit * unitsNeeded * (item.unitWeight / 100) * this.duration;
                this.totalNutrition.fat += item.fatPerUnit * unitsNeeded * (item.unitWeight / 100) * this.duration;
                this.totalNutrition.carbs += item.carbsPerUnit * unitsNeeded * (item.unitWeight / 100) * this.duration;
            }

            return {
                name: item.name,
                quantity: unitsNeeded,
                unit: item.unit
            };
        }

        // Handle other categories as needed
        // ...

        return null; // If item does not apply
    }

    /**
     * Returns the final supply list with total quantities and nutritional summary.
     * @returns {Object}
     */
    getSupplyList() {
        // Generate and consolidate all items
        const consolidatedItems = this.generateAllItems();

        // Return the supply list and total nutrition
        return {
            supplyList: consolidatedItems,
            totalNutrition: this.totalNutrition
        };
    }
}
