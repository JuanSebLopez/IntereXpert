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
export const calcularInteresSimple = (
  params: InteresSimpleParams
): ResultadoInteres => {
  const {
    capital,
    interes,
    tasa,
    unidadTasa,
    tiempo,
    unidadTiempo,
    unidadDeseadaTasa = unidadTasa,
    unidadDeseadaTiempo = unidadTiempo,
  } = params;

  // Verificamos que solo falte una variable
  const variablesFaltantes = [capital, interes, tasa, tiempo].filter(
    (v) => v === undefined
  ).length;
  if (variablesFaltantes !== 1) {
    throw new Error(
      `Se requiere exactamente una variable faltante. Faltantes: ${variablesFaltantes}`
    );
  }

  // Convertimos la tasa a decimal y ajustamos unidades
  let tasaDecimal = 0;
  let unidadReferenciaTasa = unidadTasa;
  let unidadReferenciaTiempo = unidadTiempo;

  // Caso 1: Falta la tasa, usamos unidadTiempo como referencia
  if (tasa === undefined) {
    unidadReferenciaTasa = unidadTiempo;
  }
  // Caso 2: Falta el tiempo, usamos unidadTasa como referencia
  else if (tiempo === undefined) {
    unidadReferenciaTiempo = unidadTasa;
  }
  // Caso 3: Falta capital o interés, las unidades deben coincidir
  else if (unidadTasa !== unidadTiempo) {
    unidadReferenciaTiempo = unidadTasa; // Aseguramos que coincidan
  }

  // Convertimos la tasa a decimal y a la unidad de referencia
  if (tasa !== undefined) {
    tasaDecimal = tasa / 100; // Convertimos de porcentaje a decimal
    if (unidadTasa !== unidadReferenciaTasa) {
      tasaDecimal = convertirUnidad(
        tasaDecimal,
        unidadTasa,
        unidadReferenciaTasa
      );
    }
  }

  // Convertimos el tiempo a la unidad de referencia si es necesario
  let tiempoAjustado = tiempo;
  if (tiempo !== undefined && unidadTiempo !== unidadReferenciaTiempo) {
    tiempoAjustado = convertirUnidad(
      tiempo,
      unidadTiempo,
      unidadReferenciaTiempo
    );
  }

  // Caso 1: Calcular interés (I = C * i * t)
  if (
    interes === undefined &&
    capital !== undefined &&
    tasa !== undefined &&
    tiempoAjustado !== undefined
  ) {
    const interesCalculado = capital * tasaDecimal * tiempoAjustado;
    return {
      tipo: "interes",
      valor: interesCalculado,
    };
  }

  // Caso 2: Calcular capital (C = I / (t * i))
  if (
    capital === undefined &&
    interes !== undefined &&
    tasa !== undefined &&
    tiempoAjustado !== undefined
  ) {
    const capitalCalculado = interes / (tiempoAjustado * tasaDecimal);
    return {
      tipo: "capital",
      valor: capitalCalculado,
    };
  }

  // Caso 3: Calcular tasa (i = I / (C * t))
  if (
    tasa === undefined &&
    capital !== undefined &&
    interes !== undefined &&
    tiempoAjustado !== undefined
  ) {
    let tasaCalculada = interes / (capital * tiempoAjustado);
    // Convertimos la tasa a la unidad deseada
    if (unidadReferenciaTasa !== unidadDeseadaTasa) {
      // Aseguramos que la conversión sea correcta (multiplicar o dividir según el sentido)
      const factorOrigen = CONVERSION_FACTORS[unidadReferenciaTasa];
      const factorDestino = CONVERSION_FACTORS[unidadDeseadaTasa];
      tasaCalculada = tasaCalculada * (factorOrigen / factorDestino);
    }
    // Convertimos a porcentaje
    tasaCalculada *= 100;
    return {
      tipo: "tasa",
      valor: tasaCalculada,
      unidad: unidadDeseadaTasa,
    };
  }

  // Caso 4: Calcular tiempo (t = I / (C * i))
  if (
    tiempo === undefined &&
    capital !== undefined &&
    interes !== undefined &&
    tasa !== undefined
  ) {
    let tiempoCalculado = interes / (capital * tasaDecimal);
    // Convertimos el tiempo a la unidad deseada
    if (unidadReferenciaTiempo !== unidadDeseadaTiempo) {
      // Aseguramos que la conversión sea correcta
      const factorOrigen = CONVERSION_FACTORS[unidadReferenciaTiempo];
      const factorDestino = CONVERSION_FACTORS[unidadDeseadaTiempo];
      tiempoCalculado = tiempoCalculado * (factorOrigen / factorDestino);
    }
    return {
      tipo: "tiempo",
      valor: tiempoCalculado,
      unidad: unidadDeseadaTiempo,
    };
  }

  throw new Error("No se pudo determinar qué variable calcular");
};

/**
 * Función de ayuda para formatear los resultados
 * @param resultado Resultado del cálculo
 * @returns Texto formateado para mostrar al usuario
 */
export const formatearResultado = (resultado: ResultadoInteres): string => {
  const { tipo, valor, unidad } = resultado;

  switch (tipo) {
    case "capital":
      return `Capital: $${valor.toFixed(2)}`;
    case "interes":
      return `Interés: $${valor.toFixed(2)}`;
    case "tasa":
      return `Tasa: ${valor.toFixed(2)}% ${unidad}`;
    case "tiempo":
      return `Tiempo: ${valor.toFixed(2)} ${unidad}`;
    default:
      return `Resultado: ${valor.toFixed(2)}`;
  }
};

// Exportamos las interfaces para usar en otros archivos
export type { InteresSimpleParams, ResultadoInteres };