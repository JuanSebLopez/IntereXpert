import { TimeUnit, timeUnitFactors } from '../components/UnitSelector';

/**
 * Calcula el interés compuesto
 * @param principal Capital inicial
 * @param rate Tasa de interés (decimal)
 * @param time Tiempo
 * @param compounds Periodos de capitalización por unidad de tiempo
 * @param rateUnit Unidad de la tasa
 * @param timeUnit Unidad del tiempo
 * @returns Interés generado
 */
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
  compounds: number,
  rateUnit: TimeUnit,
  timeUnit: TimeUnit
): {interest: number, amount: number} => {
  let normalizedRate: number;
  let normalizedTime: number;

  // Si las unidades coinciden, la tasa ya está normalizada respecto al tiempo
  if (rateUnit === timeUnit) {
    normalizedRate = rate;
    normalizedTime = time;
  } else {
    // Si las unidades no coinciden, convertimos la tasa a la unidad del tiempo
    // Para interés compuesto la conversión es diferente que para interés simple
    
    // Si la tasa es anual y el tiempo es mensual, necesitamos la tasa mensual equivalente
    // (1+r)^(1/n) - 1 donde n es el factor de conversión
    const rateFactor = timeUnitFactors[rateUnit];
    const timeFactor = timeUnitFactors[timeUnit];
    
    // Convertir a tasa anual primero (si no lo está ya)
    const annualRate = rateUnit === 'anual' ? rate : Math.pow(1 + rate, rateFactor) - 1;
    
    // Luego convertir de anual a la unidad de tiempo
    normalizedRate = Math.pow(1 + annualRate, 1 / timeFactor) - 1;
    normalizedTime = time;
  }

  // Fórmula de interés compuesto: A = P * (1 + r/n)^(n*t)
  const amount = principal * Math.pow(1 + normalizedRate / compounds, compounds * normalizedTime);
  const interest = amount - principal;

  return { interest, amount };
};

/**
 * Calcula la tasa de interés compuesto necesaria
 * @param principal Capital inicial
 * @param finalAmount Monto final
 * @param time Tiempo
 * @param compounds Periodos de capitalización por unidad de tiempo
 * @param timeUnit Unidad del tiempo
 * @param outputRateUnit Unidad de salida para la tasa
 * @returns Tasa de interés (decimal) en la unidad especificada
 */
export const calculateCompoundRate = (
  principal: number,
  finalAmount: number,
  time: number,
  compounds: number,
  timeUnit: TimeUnit,
  outputRateUnit: TimeUnit
): number => {
  // Para calcular la tasa, usamos la unidad de tiempo como referencia
  
  // Fórmula despejada: r = n * [(A/P)^(1/(n*t)) - 1]
  const base = finalAmount / principal;
  const exponent = 1 / (compounds * time);
  const rateInTimeUnit = compounds * (Math.pow(base, exponent) - 1);
  
  // Si la unidad de salida es la misma que la del tiempo, ya tenemos el resultado
  if (timeUnit === outputRateUnit) {
    return rateInTimeUnit;
  }
  
  // Si no, convertimos la tasa de la unidad de tiempo a la unidad de salida
  // Primero convertimos a tasa anual
  const timeFactor = timeUnitFactors[timeUnit];
  const annualRate = Math.pow(1 + rateInTimeUnit, timeFactor) - 1;
  
  // Luego convertimos de anual a la unidad de salida
  const outputFactor = timeUnitFactors[outputRateUnit];
  return Math.pow(1 + annualRate, 1 / outputFactor) - 1;
};

/**
 * Calcula el tiempo necesario para un interés compuesto
 * @param principal Capital inicial
 * @param finalAmount Monto final
 * @param rate Tasa de interés (decimal)
 * @param compounds Periodos de capitalización por unidad de tiempo
 * @param rateUnit Unidad de la tasa
 * @param outputTimeUnit Unidad de salida para el tiempo
 * @returns Tiempo en la unidad especificada
 */
export const calculateCompoundTime = (
  principal: number,
  finalAmount: number,
  rate: number,
  compounds: number,
  rateUnit: TimeUnit,
  outputTimeUnit: TimeUnit
): number => {
  // Normalizamos la tasa a la unidad de salida del tiempo
  let normalizedRate: number;
  
  if (rateUnit === outputTimeUnit) {
    normalizedRate = rate;
  } else {
    // Convertir a tasa anual primero (si no lo está ya)
    const rateFactor = timeUnitFactors[rateUnit];
    const timeFactor = timeUnitFactors[outputTimeUnit];
    
    const annualRate = rateUnit === 'anual' ? rate : Math.pow(1 + rate, rateFactor) - 1;
    
    // Luego convertir de anual a la unidad de tiempo de salida
    normalizedRate = Math.pow(1 + annualRate, 1 / timeFactor) - 1;
  }
  
  // Fórmula para el tiempo: t = ln(A/P) / (n * ln(1 + r/n))
  const numerator = Math.log(finalAmount / principal);
  const denominator = compounds * Math.log(1 + normalizedRate / compounds);
  
  return numerator / denominator;
};

/**
 * Calcula el capital inicial para un interés compuesto
 * @param finalAmount Monto final
 * @param rate Tasa de interés (decimal)
 * @param time Tiempo
 * @param compounds Periodos de capitalización por unidad de tiempo
 * @param rateUnit Unidad de la tasa
 * @param timeUnit Unidad del tiempo
 * @returns Capital inicial
 */
export const calculateCompoundPrincipal = (
  finalAmount: number,
  rate: number,
  time: number,
  compounds: number,
  rateUnit: TimeUnit,
  timeUnit: TimeUnit
): number => {
  let normalizedRate: number;
  let normalizedTime: number;

  // Si las unidades coinciden, la tasa ya está normalizada respecto al tiempo
  if (rateUnit === timeUnit) {
    normalizedRate = rate;
    normalizedTime = time;
  } else {
    // Si las unidades no coinciden, convertimos la tasa a la unidad del tiempo
    
    // Convertir a tasa anual primero (si no lo está ya)
    const rateFactor = timeUnitFactors[rateUnit];
    const timeFactor = timeUnitFactors[timeUnit];
    
    const annualRate = rateUnit === 'anual' ? rate : Math.pow(1 + rate, rateFactor) - 1;
    
    // Luego convertir de anual a la unidad de tiempo
    normalizedRate = Math.pow(1 + annualRate, 1 / timeFactor) - 1;
    normalizedTime = time;
  }
  
  // Fórmula para el capital inicial: P = A / (1 + r/n)^(n*t)
  return finalAmount / Math.pow(1 + normalizedRate / compounds, compounds * normalizedTime);
}; 