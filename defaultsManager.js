export class DefaultsManager {
    constructor() {
        this.defaults = this.loadDefaults();
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
} 