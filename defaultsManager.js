export class DefaultsManager {
    constructor() {
        this.defaults = this.loadDefaults();
        this.originalDefaults = {};
    }
    
    async initialize() {
        await this.loadOriginalDefaults();
        return this;
    }
    
    async loadOriginalDefaults() {
        try {
            const { categories } = await import('./data.js');
            this.originalDefaults = {};
            
            Object.entries(categories).forEach(([categoryKey, category]) => {
                category.items.forEach(item => {
                    this.originalDefaults[item.name] = {
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
            
            return this.originalDefaults;
        } catch (error) {
            console.error('Error loading original defaults:', error);
            throw error;
        }
    }
    
    loadDefaults() {
        const stored = localStorage.getItem('supplyDefaults');
        return stored ? JSON.parse(stored) : {};
    }
    
    saveDefaults(newDefaults) {
        this.defaults = newDefaults;
        localStorage.setItem('supplyDefaults', JSON.stringify(newDefaults));
    }
    
    async getItemDefault(itemName, valueType) {
        if (Object.keys(this.originalDefaults).length === 0) {
            await this.loadOriginalDefaults();
        }
        return this.defaults[itemName]?.[valueType] ?? this.originalDefaults[itemName]?.[valueType];
    }
    
    setItemDefault(itemName, valueType, value) {
        if (!this.defaults[itemName]) {
            this.defaults[itemName] = {};
        }
        this.defaults[itemName][valueType] = value;
        this.saveDefaults(this.defaults);
    }
    
    async resetToDefaults() {
        await this.loadOriginalDefaults();
        localStorage.removeItem('supplyDefaults');
        this.defaults = {};
        return this.originalDefaults;
    }
} 