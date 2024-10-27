// data.js

// Export an object containing daily requirements for humans and animals using base units
export const dailyRequirements = {
    humans: {
        // Demographic groups with average weight (kg) and per kg per day requirements
        "Infant": { 
            weight: 6,               // Average weight in kg
            waterPerKg: 150,        // ml/kg/day
            caloriesPerKg: 55,       // kcal/kg/day
            proteinPerKg: 2.2        // g/kg/day
        },
        "Toddler": { 
            weight: 12,              
            waterPerKg: 100,        
            caloriesPerKg: 45,       
            proteinPerKg: 1.8        
        },
        "Child": { 
            weight: 20,              
            waterPerKg: 80,         
            caloriesPerKg: 40,       
            proteinPerKg: 1.2        
        },
        "Older Child": { 
            weight: 30,              
            waterPerKg: 60,         
            caloriesPerKg: 35,       
            proteinPerKg: 1.0        
        },
        "Teenager Male": { 
            weight: 60,              
            waterPerKg: 50,         
            caloriesPerKg: 30,       
            proteinPerKg: 0.9        
        },
        "Teenager Female": { 
            weight: 55,              
            waterPerKg: 50,         
            caloriesPerKg: 30,       
            proteinPerKg: 0.9        
        },
        "Adult Male": { 
            weight: 70,              
            waterPerKg: 35,         
            caloriesPerKg: 24,       
            proteinPerKg: 0.8        
        },
        "Adult Female": { 
            weight: 60,              
            waterPerKg: 35,         
            caloriesPerKg: 24,       
            proteinPerKg: 0.8        
        },
        "Pregnant Female": { 
            weight: 65,              
            waterPerKg: 35,         
            caloriesPerKg: 24,       
            proteinPerKg: 0.8,
            extraCalories: 300,     // kcal/day
            extraProtein: 10,       // g/day
            extraWater: 300         // ml/day
        },
        "Lactating Female": { 
            weight: 65,              
            waterPerKg: 35,         
            caloriesPerKg: 24,       
            proteinPerKg: 0.8,
            extraCalories: 500,     // kcal/day
            extraProtein: 15,       // g/day
            extraWater: 700         // ml/day
        },
        "Elderly Male": { 
            weight: 65,              
            waterPerKg: 30,         
            caloriesPerKg: 22,       
            proteinPerKg: 1.2        
        },
        "Elderly Female": { 
            weight: 55,              
            waterPerKg: 30,         
            caloriesPerKg: 22,       
            proteinPerKg: 1.2        
        },
    },
    animals: {
        // Animal types with their respective average weight (kg) and per kg per day requirements
        "Dog": { 
            weight: 20,               
            waterPerKg: 60,           // ml/kg/day
            RER: true,                // Indicates RER calculation for calories
            activityFactor: 1.6       // Multiplicative factor based on activity level
        },
        "Cat": { 
            weight: 5,                
            waterPerKg: 50,           // ml/kg/day
            RER: true,                
            activityFactor: 1.2       
        },
        "Rabbit": { 
            weight: 2,                
            waterPerKg: 100,          // ml/kg/day
            caloriesPerKg: 100        // kcal/kg/day
        },
        "Chicken": { 
            weight: 2,                
            waterPerKg: 100,          // ml/kg/day
            caloriesPerKg: 80         // kcal/kg/day
        },
        // Add other animals as needed
    }
};

// Define categories and their respective items using base units
export const categories = {
    water: {
        name: "Water",
        items: [
            {
                name: "Water",
                perUnitVolume: 1000,    // ml per unit (1 liter)
                unit: "liter",
                category: "water"
            },
            // Add more water-related items if needed
        ]
    },
    food: {
        name: "Food",
        items: [
            {
                name: "Rice",
                caloriesPerUnit: 130,    // Calories per 100g
                proteinPerUnit: 2.7,     // Protein grams per 100g
                fatPerUnit: 0.3,         // Fat grams per 100g
                carbsPerUnit: 28,        // Carbs grams per 100g
                unitWeight: 100,         // Unit weight in grams
                unit: "grams",
                category: "food"
            },
            {
                name: "Canned Beans",
                caloriesPerUnit: 110,    // Calories per 100g
                proteinPerUnit: 7,       // Protein grams per 100g
                fatPerUnit: 0.5,         // Fat grams per 100g
                carbsPerUnit: 20,        // Carbs grams per 100g
                unitWeight: 100,
                unit: "grams",
                category: "food"
            },
            {
                name: "Dog Food",
                caloriesPerUnit: 350,    // Calories per 100g
                proteinPerUnit: 18,      // Protein grams per 100g
                fatPerUnit: 8,           // Fat grams per 100g
                carbsPerUnit: 30,        // Carbs grams per 100g
                unitWeight: 100,
                unit: "grams",
                category: "animal_food"
            },
            {
                name: "Cat Food",
                caloriesPerUnit: 400,    // Calories per 100g
                proteinPerUnit: 30,      // Protein grams per 100g
                fatPerUnit: 10,          // Fat grams per 100g
                carbsPerUnit: 15,        // Carbs grams per 100g
                unitWeight: 100,
                unit: "grams",
                category: "animal_food"
            },
            // Add more food items as needed
        ]
    },
    nutrition: {
        name: "Nutrition",
        items: [
            {
                name: "Calories",
                unit: "kcal"
                // Calculated separately in SupplyCalculator
            },
            {
                name: "Protein",
                unit: "g"
                // Calculated separately in SupplyCalculator
            },
            {
                name: "Fat",
                unit: "g"
                // Calculated separately in SupplyCalculator
            },
            {
                name: "Carbohydrates",
                unit: "g"
                // Calculated separately in SupplyCalculator
            }
        ]
    },
    medical: {
        name: "Medical Supplies",
        items: [
            {
                name: "Basic First-Aid Kit",
                perPersonPerDay: 1 / 30,  // One kit per person every 30 days
                unit: "kits",
                category: "medical"
            },
            {
                name: "Pet First Aid Kit",
                perDogPerDay: 1 / 30,
                perCatPerDay: 1 / 30,
                unit: "kits",
                category: "medical"
            },
            // Add more medical items as needed
        ]
    },
    hygiene: {
        name: "Sanitation & Hygiene",
        items: [
            {
                name: "Toilet Paper",
                perPersonPerDay: 0.2,     // Rolls per person per day
                unit: "rolls",
                category: "hygiene"
            },
            // Add more hygiene items as needed
        ]
    },
    communication: {
        name: "Communication",
        items: [
            {
                name: "Battery-powered Radio",
                perHousehold: 1,          // One per household
                unit: "units",
                category: "communication"
            },
            // Add more communication items as needed
        ]
    },
    shelter: {
        name: "Shelter",
        items: [
            {
                name: "Tent",
                perFamily: 1,             // One per family
                unit: "units",
                category: "shelter"
            },
            // Add more shelter items as needed
        ]
    },
    tools: {
        name: "Tools & Equipment",
        items: [
            {
                name: "Multi-tool",
                perPerson: 1,             // One per person
                unit: "units",
                category: "tools"
            },
            // Add more tools items as needed
        ]
    },
    power: {
        name: "Power & Energy",
        items: [
            {
                name: "Batteries (AA)",
                perPersonPerDay: 2,       // Units per person per day
                unit: "units",
                category: "power"
            },
            // Add more power items as needed
        ]
    },
    cooking: {
        name: "Cooking and Heating",
        items: [
            {
                name: "Portable Stove",
                perHousehold: 1,          // One per household
                unit: "units",
                category: "cooking"
            },
            // Add more cooking items as needed
        ]
    },
    security: {
        name: "Personal Security",
        items: [
            {
                name: "Pepper Spray",
                perPerson: 1,             // One per person
                unit: "units",
                category: "security"
            },
            // Add more security items as needed
        ]
    },
};

// Group categories into higher-level groups for UI purposes
export const categoryGroups = {
    critical: {
        name: "Critical Supplies",
        categories: ["water", "food", "nutrition"]
    },
    essential: {
        name: "Essential Supplies",
        categories: ["medical", "hygiene"]
    },
    comfort: {
        name: "Comfort Supplies",
        categories: ["communication", "shelter", "tools"]
    },
    powerAndSecurity: {
        name: "Power & Security",
        categories: ["power", "security"]
    },
    cookingAndGear: {
        name: "Cooking & Gear",
        categories: ["cooking", "tools"]
    }
};
