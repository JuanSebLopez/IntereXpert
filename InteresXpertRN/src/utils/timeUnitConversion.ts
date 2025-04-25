import { TimeUnit, timeUnitFactors } from '../components/UnitSelector';

/**
 * Convierte una tasa de interés de una unidad a otra
 * @param rate Tasa de interés en formato decimal (ej: 0.05 para 5%)
 * @param fromUnit Unidad original de la tasa
 * @param toUnit Unidad a la que se quiere convertir
 * @returns Tasa convertida en formato decimal
 */
export const convertRate = (
  rate: number,
  fromUnit: TimeUnit,
  toUnit: TimeUnit
): number => {
  if (fromUnit === toUnit) {
    return rate;
  }

  // Primero normalizamos a tasa anual
  const annualRate = normalizeToAnnualRate(rate, fromUnit);
  
  // Luego convertimos de anual a la unidad objetivo
  return convertFromAnnualRate(annualRate, toUnit);
};

/**
 * Convierte un periodo de tiempo de una unidad a otra
 * @param time Periodo de tiempo
 * @param fromUnit Unidad original del tiempo
 * @param toUnit Unidad a la que se quiere convertir
 * @returns Tiempo convertido
 */
export const convertTime = (
  time: number,
  fromUnit: TimeUnit,
  toUnit: TimeUnit
): number => {
  if (fromUnit === toUnit) {
    return time;
  }

  // Factores de conversión entre unidades
  const fromFactor = timeUnitFactors[fromUnit];
  const toFactor = timeUnitFactors[toUnit];
  
  // Convertir a la nueva unidad (regla de tres)
  return (time * toFactor) / fromFactor;
};

/**
 * Normaliza una tasa a su equivalente anual
 * @param rate Tasa en formato decimal
 * @param unit Unidad de la tasa
 * @returns Tasa anual equivalente en formato decimal
 */
export const normalizeToAnnualRate = (rate: number, unit: TimeUnit): number => {
  if (unit === 'anual') {
    return rate;
  }

  const factor = timeUnitFactors[unit];
  
  // Para tasas compuestas: (1 + r)^n - 1
  return Math.pow(1 + rate, factor) - 1;
};

/**
 * Convierte una tasa anual a otra unidad de tiempo
 * @param annualRate Tasa anual en formato decimal
 * @param toUnit Unidad objetivo
 * @returns Tasa convertida en formato decimal
 */
export const convertFromAnnualRate = (
  annualRate: number,
  toUnit: TimeUnit
): number => {
  if (toUnit === 'anual') {
    return annualRate;
  }

  const factor = timeUnitFactors[toUnit];
  
  // Para tasas compuestas: (1 + r)^(1/n) - 1
  return Math.pow(1 + annualRate, 1 / factor) - 1;
};

/**
 * Calcula una tasa de interés cuando se conocen capital, tiempo e interés generado
 * @param principal Capital inicial
 * @param interest Interés generado
 * @param time Tiempo
 * @param timeUnit Unidad del tiempo
 * @param rateUnit Unidad deseada para la tasa de interés
 * @returns Tasa de interés en la unidad especificada (formato decimal)
 */
export const calculateRate = (
  principal: number,
  interest: number,
  time: number,
  timeUnit: TimeUnit,
  rateUnit: TimeUnit
): number => {
  // Calculamos la tasa simple en la unidad de tiempo dada
  const rateInTimeUnit = interest / (principal * time);
  
  // Convertimos a la unidad deseada para la tasa
  return convertRate(rateInTimeUnit, timeUnit, rateUnit);
};

/**
 * Calcula el tiempo necesario cuando se conocen capital, tasa e interés generado
 * @param principal Capital inicial
 * @param interest Interés generado
 * @param rate Tasa de interés (formato decimal)
 * @param rateUnit Unidad de la tasa
 * @param timeUnit Unidad deseada para el tiempo
 * @returns Tiempo en la unidad especificada
 */
export const calculateTime = (
  principal: number,
  interest: number,
  rate: number,
  rateUnit: TimeUnit,
  timeUnit: TimeUnit
): number => {
  // Primero convertimos la tasa a la unidad de tiempo deseada
  const rateInTimeUnit = convertRate(rate, rateUnit, timeUnit);
  
  // Calculamos el tiempo usando la fórmula de interés simple
  return interest / (principal * rateInTimeUnit);
};

/**
 * Calcula el interés simple generado
 * @param principal Capital inicial
 * @param rate Tasa de interés (formato decimal)
 * @param time Tiempo
 * @param rateUnit Unidad de la tasa
 * @param timeUnit Unidad del tiempo
 * @returns Interés generado
 */
export const calculateInterest = (
  principal: number,
  rate: number,
  time: number,
  rateUnit: TimeUnit,
  timeUnit: TimeUnit
): number => {
  // Si las unidades son distintas, normalizamos
  let normalizedRate: number;
  let normalizedTime: number;

  if (rateUnit === timeUnit) {
    // Si las unidades coinciden, usamos los valores directamente
    normalizedRate = rate;
    normalizedTime = time;
  } else {
    // Convertimos la tasa a la misma unidad que el tiempo
    normalizedRate = convertRate(rate, rateUnit, timeUnit);
    normalizedTime = time;
  }
  
  // Calculamos el interés simple
  return principal * normalizedRate * normalizedTime;
};

/**
 * Calcula el capital inicial necesario
 * @param interest Interés generado
 * @param rate Tasa de interés (formato decimal)
 * @param time Tiempo
 * @param rateUnit Unidad de la tasa
 * @param timeUnit Unidad del tiempo
 * @returns Capital inicial
 */
export const calculatePrincipal = (
  interest: number,
  rate: number,
  time: number,
  rateUnit: TimeUnit,
  timeUnit: TimeUnit
): number => {
  // Si las unidades son distintas, normalizamos
  let normalizedRate: number;
  let normalizedTime: number;

  if (rateUnit === timeUnit) {
    // Si las unidades coinciden, usamos los valores directamente
    normalizedRate = rate;
    normalizedTime = time;
  } else {
    // Convertimos la tasa a la misma unidad que el tiempo
    normalizedRate = convertRate(rate, rateUnit, timeUnit);
    normalizedTime = time;
  }
  
  // Calculamos el capital inicial
  return interest / (normalizedRate * normalizedTime);
}; 