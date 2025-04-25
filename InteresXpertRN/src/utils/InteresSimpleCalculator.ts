// Constantes para conversión entre unidades de tiempo
const CONVERSION_FACTORS: Record<string, number> = {
  "anual": 1,
  "semestral": 2,        // 2 semestres en un año
  "cuatrimestral": 3,     // 3 cuatrimestres en un año
  "trimestral": 4,        // 4 trimestres en un año
  "bimestral": 6,         // 6 bimestres en un año
  "mensual": 12,          // 12 meses en un año
  "semanal": 52,          // 52 semanas aproximadamente en un año
  "diario": 365,          // 365 días en un año (no considera años bisiestos)
  "horas": 365 * 24,      // 8760 horas en un año
  "minutos": 365 * 24 * 60, // 525,600 minutos en un año
  "segundos": 365 * 24 * 60 * 60 // 31,536,000 segundos en un año
};

// Interfaz para los parámetros de entrada
interface InteresSimpleParams {
  capital?: number;
  interes?: number;
  tasa?: number;
  unidadTasa: string;
  tiempo?: number;
  unidadTiempo: string;
  unidadDeseadaTasa?: string;
  unidadDeseadaTiempo?: string;
}

// Interfaz para el resultado
interface ResultadoInteres {
  tipo: 'capital' | 'interes' | 'tasa' | 'tiempo';
  valor: number;
  unidad?: string;
}

/**
 * Convierte una unidad de tiempo a otra
 * @param valor Valor a convertir
 * @param unidadOrigen Unidad de origen
 * @param unidadDestino Unidad de destino
 * @returns Valor convertido
 */
const convertirUnidad = (valor: number, unidadOrigen: string, unidadDestino: string): number => {
  if (!CONVERSION_FACTORS[unidadOrigen] || !CONVERSION_FACTORS[unidadDestino]) {
    throw new Error(`Unidad no válida. Unidades aceptadas: ${Object.keys(CONVERSION_FACTORS).join(", ")}`);
  }
  
  // Convertimos primero a la unidad base (anual)
  const valorEnBase = valor / CONVERSION_FACTORS[unidadOrigen];
  
  // Convertimos de la unidad base a la unidad destino
  return valorEnBase * CONVERSION_FACTORS[unidadDestino];
};

/**
 * Calcula el interés simple según los parámetros proporcionados
 * @param params Parámetros para el cálculo
 * @returns Resultado del cálculo
 */
export const calcularInteresSimple = (params: InteresSimpleParams): ResultadoInteres => {
  const { 
    capital, 
    interes, 
    tasa, 
    unidadTasa, 
    tiempo, 
    unidadTiempo, 
    unidadDeseadaTasa = unidadTasa, 
    unidadDeseadaTiempo = unidadTiempo 
  } = params;

  // Verificamos que solo falte una variable
  const variablesFaltantes = [capital, interes, tasa, tiempo].filter(v => v === undefined).length;
  if (variablesFaltantes !== 1) {
    throw new Error(`Se requiere exactamente una variable faltante. Faltantes: ${variablesFaltantes}`);
  }

  // Convertimos la tasa a decimal y a la misma base temporal que el tiempo
  let tasaDecimal = 0;
  if (tasa !== undefined) {
    tasaDecimal = tasa / 100; // Convertimos de porcentaje a decimal
    
    // Convertimos la tasa a la misma unidad temporal que el tiempo
    tasaDecimal = convertirUnidad(tasaDecimal, unidadTasa, unidadTiempo);
  }

  // Caso 1: Calcular interés
  if (interes === undefined && capital !== undefined && tasa !== undefined && tiempo !== undefined) {
    // I = C * i * t
    const interesCalculado = capital * tasaDecimal * tiempo;
    return {
      tipo: 'interes',
      valor: interesCalculado
    };
  }

  // Caso 2: Calcular capital
  if (capital === undefined && interes !== undefined && tasa !== undefined && tiempo !== undefined) {
    // C = I / (i * t)
    const capitalCalculado = interes / (tasaDecimal * tiempo);
    return {
      tipo: 'capital',
      valor: capitalCalculado
    };
  }

  // Caso 3: Calcular tasa
  if (tasa === undefined && capital !== undefined && interes !== undefined && tiempo !== undefined) {
    // i = I / (C * t)
    // Calculamos la tasa en la unidad temporal del tiempo
    let tasaCalculada = interes / (capital * tiempo);
    
    // Convertimos la tasa a la unidad deseada
    tasaCalculada = convertirUnidad(tasaCalculada, unidadTiempo, unidadDeseadaTasa);
    
    // Convertimos a porcentaje
    tasaCalculada *= 100;
    
    return {
      tipo: 'tasa',
      valor: tasaCalculada,
      unidad: unidadDeseadaTasa
    };
  }

  // Caso 4: Calcular tiempo
  if (tiempo === undefined && capital !== undefined && interes !== undefined && tasa !== undefined) {
    // t = I / (C * i)
    // Calculamos el tiempo en la unidad temporal de la tasa
    let tiempoCalculado = interes / (capital * tasaDecimal);
    
    // Convertimos el tiempo a la unidad deseada
    tiempoCalculado = convertirUnidad(tiempoCalculado, unidadTasa, unidadDeseadaTiempo);
    
    return {
      tipo: 'tiempo',
      valor: tiempoCalculado,
      unidad: unidadDeseadaTiempo
    };
  }

  throw new Error('No se pudo determinar qué variable calcular');
};

/**
 * Función de ayuda para formatear los resultados
 * @param resultado Resultado del cálculo
 * @returns Texto formateado para mostrar al usuario
 */
export const formatearResultado = (resultado: ResultadoInteres): string => {
  const { tipo, valor, unidad } = resultado;
  
  switch (tipo) {
    case 'capital':
      return `Capital: $${valor.toFixed(2)}`;
    case 'interes':
      return `Interés: $${valor.toFixed(2)}`;
    case 'tasa':
      return `Tasa: ${valor.toFixed(2)}% ${unidad}`;
    case 'tiempo':
      return `Tiempo: ${valor.toFixed(2)} ${unidad}`;
    default:
      return `Resultado: ${valor.toFixed(2)}`;
  }
};

// Exportamos la interfaz para usar en otros archivos
export type { InteresSimpleParams, ResultadoInteres }; 