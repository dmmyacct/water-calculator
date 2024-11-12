export class UnitSystem {
    static systems = {
        metric: {
            volume: ['milliliters', 'liters'],
            weight: ['grams', 'kilograms'],
            length: ['centimeters', 'meters']
        },
        imperial: {
            volume: ['fluid_ounces', 'gallons'],
            weight: ['ounces', 'pounds'],
            length: ['inches', 'feet']
        }
    };

    static convert(value, fromUnit, toUnit) {
        const converter = this.getConverter(fromUnit, toUnit);
        return converter ? converter(value) : value;
    }
} 