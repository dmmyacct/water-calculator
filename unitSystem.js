export class UnitSystem {
    static isMetricUnit(unit) {
        return ['kg', 'g', 'L', 'mL', 'cm', 'm'].includes(unit);
    }

    static isImperialUnit(unit) {
        return ['lb', 'oz', 'gal', 'qt', 'pt', 'fl oz'].includes(unit);
    }

    static getBaseUnit(type) {
        const baseUnits = {
            liquid: {
                metric: 'L',
                imperial: 'gal'
            },
            weight: {
                metric: 'kg',
                imperial: 'lb'
            },
            length: {
                metric: 'm',
                imperial: 'ft'
            }
        };
        return baseUnits[type];
    }

    static convertUnit(value, fromUnit, toUnit) {
        // If units are the same, return the original value
        if (fromUnit === toUnit) return value;
        
        // Skip conversion for non-convertible units
        if (['units', 'kits', 'rolls', 'kcal', 'cans'].includes(fromUnit)) {
            return value;
        }

        try {
            // Convert to base unit first
            const baseValue = this.toBaseUnit(value, fromUnit);
            // Then convert to target unit
            return this.fromBaseUnit(baseValue, toUnit);
        } catch (error) {
            console.warn(`Conversion error: ${fromUnit} to ${toUnit}`, error);
            return value;
        }
    }

    static toBaseUnit(value, unit) {
        const conversions = {
            // Metric
            'mL': 1,
            'L': 1000,
            'g': 1,
            'kg': 1000,
            // Imperial
            'fl oz': 29.5735,
            'pt': 473.176,
            'qt': 946.353,
            'gal': 3785.41,
            'oz': 28.3495,
            'lb': 453.592
        };
        return value * (conversions[unit] || 1);
    }

    static fromBaseUnit(value, unit) {
        const conversions = {
            // Metric
            'mL': 1,
            'L': 0.001,
            'g': 1,
            'kg': 0.001,
            // Imperial
            'fl oz': 0.033814,
            'pt': 0.002113,
            'qt': 0.001057,
            'gal': 0.000264,
            'oz': 0.035274,
            'lb': 0.002205
        };
        return value * (conversions[unit] || 1);
    }

    static getDisplayUnit(unit, system) {
        // Handle null/undefined cases
        if (!unit) return '';

        // Don't convert these units
        if (['units', 'kits', 'rolls', 'kcal', 'cans'].includes(unit)) {
            return unit;
        }

        const unitMap = {
            imperial: {
                'L': 'gal',
                'mL': 'fl oz',
                'kg': 'lb',
                'g': 'oz',
                'm': 'ft',
                'cm': 'in',
                // Map imperial units to themselves
                'gal': 'gal',
                'fl oz': 'fl oz',
                'lb': 'lb',
                'oz': 'oz',
                'ft': 'ft',
                'in': 'in'
            },
            metric: {
                'gal': 'L',
                'fl oz': 'mL',
                'lb': 'kg',
                'oz': 'g',
                'ft': 'm',
                'in': 'cm',
                // Map metric units to themselves
                'L': 'L',
                'mL': 'mL',
                'kg': 'kg',
                'g': 'g',
                'm': 'm',
                'cm': 'cm'
            }
        };

        return unitMap[system]?.[unit] || unit;
    }

    static getUnitType(unit) {
        const unitTypes = {
            liquid: ['L', 'mL', 'gal', 'fl oz', 'qt', 'pt'],
            weight: ['kg', 'g', 'lb', 'oz'],
            length: ['m', 'cm', 'ft', 'in']
        };

        for (const [type, units] of Object.entries(unitTypes)) {
            if (units.includes(unit)) return type;
        }
        return null;
    }
} 