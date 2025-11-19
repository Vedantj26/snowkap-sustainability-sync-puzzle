export function detectScope(fieldName) {
    const name = fieldName.toLowerCase();

    if (name.includes("scope1") || name.includes("scope_1") || name.includes("scope-1")) {
        return "scope_1";
    }
    if (name.includes("scope2") || name.includes("scope_2") || name.includes("scope-2")) {
        return "scope_2";
    }
    if (name.includes("scope3") || name.includes("scope_3") || name.includes("scope-3")) {
        return "scope_3";
    }

    if (name.includes("direct_emission") || name.includes("co2")) {
        return "scope_1";
    }

    return null;
}

export function detectUnit(fieldName) {
    const name = fieldName.toLowerCase();

    if (name.includes("kg")) return "kg";
    if (name.includes("tonnes") || name.includes("tonne") || name.includes("tco2")) {
        return "tonnes";
    }

    return "tonnes";
}

export function toTonnes(value, unit) {
    if (unit === "kg") {
        return value / 1000.0;
    }
    return value;
}

export function normalizeSourceObject(sourceName, obj) {
    const metrics = [];

    for (const [field, rawValue] of Object.entries(obj)) {
        if (typeof rawValue !== "number") continue;

        const scope = detectScope(field);
        if (!scope) continue;

        const unit = detectUnit(field);
        const valueTonnes = toTonnes(rawValue, unit);

        metrics.push({
            source: sourceName,
            field,
            scope,
            unit,
            rawValue,
            value_tonnes: valueTonnes
        });
    }

    return metrics;
}

export function unifyScopeMetrics(metrics, scope = "scope_1") {
    const scopeMetrics = metrics.filter(m => m.scope === scope);

    if (scopeMetrics.length === 0) return null;

    const total = scopeMetrics.reduce((sum, m) => sum + m.value_tonnes, 0);
    const avg = total / scopeMetrics.length;

    return {
        metric: "Scope 1 Emissions",
        scope,
        value_tonnes: Number(avg.toFixed(1)),
        source_count: scopeMetrics.length,
        details: scopeMetrics
    };
}
