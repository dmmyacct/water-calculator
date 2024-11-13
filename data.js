// Export an object containing daily requirements for humans and animals
export const dailyRequirements = {
    humans: {
        // Age groups with their respective weight, water, and calorie needs
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
        // Animal types with their respective weight, water, and calorie needs
        "Dog": { weight: 50, water: 0.5, calories: 700 },
        "Cat": { weight: 10, water: 0.1, calories: 250 },
        "Rabbit": { weight: 8, water: 0.15, calories: 150 },
        "Chicken": { weight: 7.5, water: 0.075, calories: 100 },
        // Add other animals as needed
    }
};

// Updated category groups
export const categoryGroups = {
    critical: {
        name: "Critical Supplies",
        description: "Essential items needed for immediate survival, including water and food supplies. These should be your top priority.",
        categories: ["water", "food"]
    },
    nutrition: {
        name: "Nutrition",
        description: "Detailed nutritional requirements and supplements to maintain health during emergency situations.",
        categories: ["nutrition"]
    },
    essential: {
        name: "Essential Supplies",
        description: "Medical and first-aid supplies crucial for treating injuries and maintaining health in emergencies.",
        categories: ["medical"]
    },
    comfort: {
        name: "Comfort Supplies",
        description: "Items that improve quality of life during emergencies, including hygiene products and basic shelter needs.",
        categories: ["hygiene", "communication", "shelter", "tools"]
    },
    powerAndSecurity: {
        name: "Power & Security",
        description: "Equipment and supplies for maintaining power, light, and personal security during emergencies.",
        categories: ["power", "security"]
    },
    cookingAndGear: {
        name: "Cooking & Gear",
        description: "Equipment for food preparation and general survival gear for emergency situations.",
        categories: ["cooking", "gear"]
    }
};

// Define categories and their respective items
export const categories = {
    water: {
        name: "Water",
        description: "Clean water for drinking, cooking, and basic hygiene.",
        items: [
            {
                name: "Water",
                perAdultPerDay: 1,
                perChildPerDay: 0.5,
                perDogPerDay: 1,
                perCatPerDay: 0.5,
                unit: "gal"
            }
        ]
    },
    food: {
        name: "Food",
        description: "Non-perishable food items that provide necessary calories and nutrition.",
        items: [
            {
                name: "Rice",
                perAdultPerDay: 0.625,
                perChildPerDay: 0.3,
                unit: "lb"
            },
            {
                name: "Canned Meat (cans)",
                perAdultPerDay: 0.875,
                perChildPerDay: 0.4,
                unit: "cans"
            },
            {
                name: "Dog Food (lbs)",
                perDogPerDay: 2.5,
                unit: "lbs"
            },
            {
                name: "Cat Food (lbs)",
                perCatPerDay: 0.5,
                unit: "lbs"
            }
        ]
    },
    nutrition: {
        name: "Nutrition",
        description: "Specific nutritional requirements including calories, protein, and essential nutrients.",
        items: [
            {
                name: "Calories",
                perAdultPerDay: 2000,
                perChildPerDay: 1500,
                perDogPerDay: 700,
                perCatPerDay: 250,
                unit: "kcal"
            },
            {
                name: "Protein",
                perAdultPerDay: 50,
                perChildPerDay: 30,
                perDogPerDay: 10,
                perCatPerDay: 30,
                unit: "g"
            },
            {
                name: "Fat",
                perAdultPerDay: 70,
                perChildPerDay: 40,
                perDogPerDay: 15,
                perCatPerDay: 10,
                unit: "g"
            },
            {
                name: "Carbohydrates",
                perAdultPerDay: 300,
                perChildPerDay: 200,
                perDogPerDay: 30,
                perCatPerDay: 15,
                unit: "g"
            }
        ]
    },
    medical: {
        name: "Medical Supplies",
        description: "First aid supplies and basic medical equipment for treating injuries and illness.",
        items: [
            {
                name: "Basic First-Aid Kit",
                perPersonPerDay: 1 / 30,  // One kit per person every 30 days
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
        description: "Items for maintaining cleanliness and preventing disease in emergency situations.",
        items: [
            {
                name: "Toilet Paper (rolls)",
                perPersonPerDay: 0.2,     // Rolls per person per day
                unit: "rolls"
            },
            // Add more hygiene items as needed
        ]
    },
    communication: {
        name: "Communication",
        description: "Equipment to stay informed and maintain contact during emergencies.",
        items: [
            {
                name: "Battery-powered Radio",
                perHousehold: 1,          // One per household
                unit: "units"
            },
            // Add more communication items as needed
        ]
    },
    shelter: {
        name: "Shelter",
        description: "Equipment and supplies for creating or maintaining emergency shelter.",
        items: [
            {
                name: "Tent",
                perFamily: 1,             // One per family
                unit: "units"
            },
            // Add more shelter items as needed
        ]
    },
    tools: {
        name: "Tools & Equipment",
        description: "Essential tools for emergency repairs and survival situations.",
        items: [
            {
                name: "Multi-tool",
                perPerson: 1,             // One per person
                unit: "units"
            },
            // Add more tools items as needed
        ]
    },
    power: {
        name: "Power & Energy",
        description: "Equipment and supplies for maintaining electrical power and lighting.",
        items: [
            {
                name: "Batteries (AA)",
                perPersonPerDay: 2,       // Units per person per day
                unit: "units"
            },
            // Add more power items as needed
        ]
    },
    cooking: {
        name: "Cooking and Heating",
        description: "Equipment for food preparation and maintaining warmth in emergencies.",
        items: [
            {
                name: "Portable Stove",
                perHousehold: 1,          // One per household
                unit: "units"
            },
            // Add more cooking items as needed
        ]
    },
    security: {
        name: "Personal Security",
        description: "Items for maintaining personal and family safety during emergencies.",
        items: [
            {
                name: "Pepper Spray",
                perPerson: 1,             // One per person
                unit: "units"
            },
            // Add more security items as needed
        ]
    },
};
