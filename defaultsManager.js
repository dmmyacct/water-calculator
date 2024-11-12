export class DefaultsManager {
    constructor() {
        this.defaults = this.loadDefaults();
        this.originalDefaults = this.getOriginalDefaults();
    }
    
    loadDefaults() {
        const stored = localStorage.getItem('supplyDefaults');
        return stored ? JSON.parse(stored) : {};
    }
    
    saveDefaults(newDefaults) {
        this.defaults = newDefaults;
        localStorage.setItem('supplyDefaults', JSON.stringify(newDefaults));
    }
    
    getItemDefault(itemName, valueType) {
        return this.defaults[itemName]?.[valueType];
    }
    
    setItemDefault(itemName, valueType, value) {
        if (!this.defaults[itemName]) {
            this.defaults[itemName] = {};
        }
        this.defaults[itemName][valueType] = value;
        this.saveDefaults(this.defaults);
    }
    
    getOriginalDefaults() {
        const originalDefaults = {};
        
        import('./data.js').then(({ categories }) => {
            Object.entries(categories).forEach(([categoryKey, category]) => {
                category.items.forEach(item => {
                    originalDefaults[item.name] = {
                        perAdultPerDay: item.perAdultPerDay,
                        perChildPerDay: item.perChildPerDay,
                        perDogPerDay: item.perDogPerDay,
                        perCatPerDay: item.perCatPerDay,
                        perPerson: item.perPerson,
                        perHousehold: item.perHousehold,
                        perFamily: item.perFamily
                    };
                });
            });
        });
        
        return originalDefaults;
    }
    
    resetToDefaults() {
        localStorage.removeItem('supplyDefaults');
        this.defaults = this.originalDefaults;
        return this.defaults;
    }
} 