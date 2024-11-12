export class UnitSystem {
    static conversions = {
        // Weight conversions
        lbs: {
            metric: {
                value: 0.453592,
                unit: 'kg'
            }
        },
        oz: {
            metric: {
                value: 28.3495,
                unit: 'g'
            }
        },
        // Volume conversions
        gallons: {
            metric: {
                value: 3.78541,
                unit: 'L'
            }
        },
        'fl oz': {
            metric: {
                value: 29.5735,
                unit: 'mL'
            }
        },
        // Length conversions
        inches: {
            metric: {
                value: 2.54,
                unit: 'cm'
            }
        },
        feet: {
            metric: {
                value: 0.3048,
                unit: 'm'
            }
        }
    };

    static displayUnits = {
        imperial: {
            weight: { large: 'lbs', small: 'oz' },
            volume: { large: 'gal', small: 'fl oz' },
            length: { large: 'ft', small: 'in' }
        },
        metric: {
            weight: { large: 'kg', small: 'g' },
            volume: { large: 'L', small: 'mL' },
            length: { large: 'm', small: 'cm' }
        }
    };

    static convertValue(value, fromUnit, toSystem) {
        if (!value || !fromUnit) return value;
        
        // If we're already in the target system, return the value
        if ((toSystem === 'imperial' && this.isImperialUnit(fromUnit)) ||
            (toSystem === 'metric' && this.isMetricUnit(fromUnit))) {
            return value;
        }

        const conversion = this.conversions[fromUnit]?.[toSystem];
        if (!conversion) return value;

        return value * conversion.value;
    }

    static getDisplayUnit(unit, system) {
        if (!unit) return '';
        
        // Special cases for units that don't change
        if (['units', 'kits', 'rolls', 'kcal'].includes(unit)) {
            return unit;
        }

        // If we're already in the correct system, return the unit
        if ((system === 'imperial' && this.isImperialUnit(unit)) ||
            (system === 'metric' && this.isMetricUnit(unit))) {
            return unit;
        }

        const conversion = this.conversions[unit]?.[system];
        return conversion ? conversion.unit : unit;
    }

    static isImperialUnit(unit) {
        return ['lbs', 'oz', 'gallons', 'fl oz', 'inches', 'feet'].includes(unit);
    }

    static isMetricUnit(unit) {
        return ['kg', 'g', 'L', 'mL', 'cm', 'm'].includes(unit);
    }
} 