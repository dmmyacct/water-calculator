// data.js

export const dailyRequirements = {
    humans: {
        "Infant": { weight: 22, water: 0.3, calories: 500 },
        "Child": { weight: 70, water: 0.5, calories: 1400 },
        "Teenager Male": { weight: 150, water: 1, calories: 2800 },
        "Teenager Female": { weight: 125, water: 1, calories: 2200 },
        "Adult Male": { weight: 190, water: 1, calories: 2500 },
        "Adult Female": { weight: 160, water: 0.8, calories: 2000 },
        "Pregnant Female": { weight: 165, water: 1, calories: 2400 },
        "Elderly Male": { weight: 160, water: 1, calories: 2200 },
        "Elderly Female": { weight: 140, water: 0.8, calories: 1800 },
    },
    animals: {
        "Dog": { weight: 50, water: 0.5, calories: 700 },
        "Cat": { weight: 10, water: 0.1, calories: 250 },
        "Rabbit": { weight: 8, water: 0.15, calories: 150 },
        "Chicken": { weight: 7.5, water: 0.075, calories: 100 },
        // Add other animals as needed
    }
};

export const categoryGroups = {
    critical: {
        name: "Critical Supplies",
        categories: ["water", "nutrition"]
    },
    essential: {
        name: "Essential Supplies",
        categories: ["food", "medical"]
    },
    comfort: {
        name: "Comfort Supplies",
        categories: ["hygiene", "communication", "shelter", "tools"]
    },
    powerAndSecurity: {
        name: "Power & Security",
        categories: ["power", "security"]
    },
    cookingAndGear: {
        name: "Cooking & Gear",
        categories: ["cooking", "gear"]
    }
};

export const categories = {
    water: {
        name: "Water",
        items: [
            {
                name: "Water (gallons)",
                perAdultPerDay: 1, 
                perChildPerDay: 0.5,
                perDogPerDay: 1, 
                perCatPerDay: 0.5, 
                unit: "gallons"
            },
            // Add more water-related items if needed
        ]
    },
    food: {
        name: "Food",
        items: [
            {
                name: "Rice (lbs)",
                perAdultPerDay: 0.625,
                perChildPerDay: 0.3,
                unit: "lbs",
                caloriesPerUnit: 1600,
                proteinPerUnit: 30,
                fatPerUnit: 1,
                carbsPerUnit: 350
            },
            {
                name: "Canned Meat (cans)",
                perAdultPerDay: 0.875,
                perChildPerDay: 0.4,
                unit: "cans",
                caloriesPerUnit: 400,
                proteinPerUnit: 20,
                fatPerUnit: 25,
                carbsPerUnit: 10
            },
            {
                name: "Dog Food (lbs)",
                perDogPerDay: 2.5, // Approx. 2.5 lbs of food per dog per day
                unit: "lbs",
                caloriesPerUnit: 350,
                proteinPerUnit: 10,
                fatPerUnit: 15,
                carbsPerUnit: 30
            },
            {
                name: "Cat Food (lbs)",
                perCatPerDay: 0.5, // Approx. 0.5 lbs of food per cat per day
                unit: "lbs",
                caloriesPerUnit: 300,
                proteinPerUnit: 30,
                fatPerUnit: 10,
                carbsPerUnit: 15
            },
            // Add more food items as needed
        ]
    },
    nutrition: {
        name: "Nutrition",
        items: [
            {
                name: "Calories",
                perAdultPerDay: 2000, // kcal
                perChildPerDay: 1500,
                perDogPerDay: 700,
                perCatPerDay: 250,
                unit: "kcal"
            },
            {
                name: "Protein",
                perAdultPerDay: 50, // grams
                perChildPerDay: 30,
                perDogPerDay: 10,
                perCatPerDay: 30,
                unit: "g"
            },
            {
                name: "Fat",
                perAdultPerDay: 70, // grams
                perChildPerDay: 40,
                perDogPerDay: 15,
                perCatPerDay: 10,
                unit: "g"
            },
            {
                name: "Carbohydrates",
                perAdultPerDay: 300, // grams
                perChildPerDay: 200,
                perDogPerDay: 30,
                perCatPerDay: 15,
                unit: "g"
            }
        ]
    },
    medical: {
        name: "Medical Supplies",
        items: [
            {
                name: "Basic First-Aid Kit",
                perPersonPerDay: 1 / 30, // One kit per 30 days per person
                unit: "kits"
            },
            {
                name: "Pet First Aid Kit",
                perDogPerDay: 1 / 30,
                perCatPerDay: 1 / 30,
                unit: "kits"
            },
            // Add more medical items as needed
        ]
    },
    hygiene: {
        name: "Sanitation & Hygiene",
        items: [
            {
                name: "Toilet Paper (rolls)",
                perPersonPerDay: 0.2,
                unit: "rolls"
            },
            // Add more hygiene items as needed
        ]
    },
    communication: {
        name: "Communication",
        items: [
            {
                name: "Battery-powered Radio",
                perHousehold: 1,
                unit: "units"
            },
            // Add more communication items as needed
        ]
    },
    shelter: {
        name: "Shelter",
        items: [
            {
                name: "Tent",
                perFamily: 1,
                unit: "units"
            },
            // Add more shelter items as needed
        ]
    },
    tools: {
        name: "Tools & Equipment",
        items: [
            {
                name: "Multi-tool",
                perPerson: 1,
                unit: "units"
            },
            // Add more tools items as needed
        ]
    },
    power: {
        name: "Power & Energy",
        items: [
            {
                name: "Batteries (AA)",
                perPersonPerDay: 2,
                unit: "units"
            },
            // Add more power items as needed
        ]
    },
    cooking: {
        name: "Cooking and Heating",
        items: [
            {
                name: "Portable Stove",
                perHousehold: 1,
                unit: "units"
            },
            // Add more cooking items as needed
        ]
    },
    security: {
        name: "Personal Security",
        items: [
            {
                name: "Pepper Spray",
                perPerson: 1,
                unit: "units"
            },
            // Add more security items as needed
        ]
    },
};
