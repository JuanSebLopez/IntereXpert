const CONVERSION_FACTORS: { [key: string]: number } = {
  anual: 1,
  semestral: 2,
  cuatrimestral: 3,
  trimestral: 4,
  bimestral: 6,
  mensual: 12,
  semanal: 52,
  diario: 365,
  horas: 365 * 24,
  minutos: 365 * 24 * 60,
  segundos: 365 * 24 * 60 * 60,
};

const convertirUnidad = (
  valor: number,
  unidadOrigen: string,
  unidadDestino: string
): number => {
  if (unidadOrigen === unidadDestino) return valor;

  const factorOrigen = CONVERSION_FACTORS[unidadOrigen];
  const factorDestino = CONVERSION_FACTORS[unidadDestino];

  if (!factorOrigen || !factorDestino) {
    throw new Error(`Unidad no soportada: ${unidadOrigen} o ${unidadDestino}`);
  }

  return valor * (factorOrigen / factorDestino);
};

export interface InteresCompuestoParams {
  capital?: number;
  valorFuturo?: number;
  tasa?: number;
  unidadTasa: string;
  tiempo?: number;
  unidadTiempo: string;
  unidadDeseadaTasa?: string;
  unidadDeseadaTiempo?: string;
}

export interface ResultadoInteresCompuesto {
  tipo: "capital" | "valorFuturo" | "tasa" | "tiempo";
  valor: number;
  unidad?: string;
}

export const calcularInteresCompuesto = (
  params: InteresCompuestoParams
): ResultadoInteresCompuesto => {
  const {
    capital,
    valorFuturo,
    tasa,
    unidadTasa,
    tiempo,
    unidadTiempo,
    unidadDeseadaTasa = unidadTasa,
    unidadDeseadaTiempo = unidadTiempo,
  } = params;

  const variablesFaltantes = [capital, valorFuturo, tasa, tiempo].filter(
    (v) => v === undefined
  ).length;
  if (variablesFaltantes !== 1) {
    throw new Error(
      `Se requiere exactamente una variable faltante. Faltantes: ${variablesFaltantes}`
    );
  }

  if (!CONVERSION_FACTORS[unidadTasa] || !CONVERSION_FACTORS[unidadTiempo]) {
    throw new Error(`Unidad no soportada: ${unidadTasa} o ${unidadTiempo}`);
  }
  if (unidadDeseadaTasa && !CONVERSION_FACTORS[unidadDeseadaTasa]) {
    throw new Error(
      `Unidad deseada no soportada para tasa: ${unidadDeseadaTasa}`
    );
  }
  if (unidadDeseadaTiempo && !CONVERSION_FACTORS[unidadDeseadaTiempo]) {
    throw new Error(
      `Unidad deseada no soportada para tiempo: ${unidadDeseadaTiempo}`
    );
  }

  let tasaDecimal: number | undefined;
  let unidadReferenciaTasa = unidadTasa;
  let unidadReferenciaTiempo = unidadTiempo;

  if (tasa !== undefined) {
    tasaDecimal = tasa / 100;
    if (unidadTasa !== unidadTiempo) {
      tasaDecimal = convertirUnidad(tasaDecimal, unidadTasa, unidadTiempo);
      unidadReferenciaTasa = unidadTiempo;
    }
  }

  let tiempoAjustado = tiempo;
  if (tiempo !== undefined && unidadTiempo !== unidadReferenciaTiempo) {
    tiempoAjustado = convertirUnidad(
      tiempo,
      unidadTiempo,
      unidadReferenciaTiempo
    );
  }

  if (
    valorFuturo === undefined &&
    capital !== undefined &&
    tasaDecimal !== undefined &&
    tiempoAjustado !== undefined
  ) {
    const valorFuturoCalculado =
      capital * Math.pow(1 + tasaDecimal, tiempoAjustado);
    return {
      tipo: "valorFuturo",
      valor: valorFuturoCalculado,
    };
  }

  if (
    capital === undefined &&
    valorFuturo !== undefined &&
    tasaDecimal !== undefined &&
    tiempoAjustado !== undefined
  ) {
    const capitalCalculado =
      valorFuturo / Math.pow(1 + tasaDecimal, tiempoAjustado);
    return {
      tipo: "capital",
      valor: capitalCalculado,
    };
  }

  if (
    tasa === undefined &&
    capital !== undefined &&
    valorFuturo !== undefined &&
    tiempoAjustado !== undefined
  ) {
    const base = valorFuturo / capital;
    const exponent = 1 / tiempoAjustado;
    let tasaCalculada = Math.pow(base, exponent) - 1;

    if (unidadReferenciaTasa !== unidadDeseadaTasa) {
      tasaCalculada = convertirUnidad(
        tasaCalculada,
        unidadReferenciaTasa,
        unidadDeseadaTasa
      );
    }

    tasaCalculada *= 100;
    return {
      tipo: "tasa",
      valor: tasaCalculada,
      unidad: unidadDeseadaTasa,
    };
  }

  if (
    tiempo === undefined &&
    capital !== undefined &&
    valorFuturo !== undefined &&
    tasaDecimal !== undefined
  ) {
    const base = valorFuturo / capital;
    const logBase = Math.log(base);
    const logRate = Math.log(1 + tasaDecimal);
    let tiempoCalculado = logBase / logRate;

    if (unidadReferenciaTiempo !== unidadDeseadaTiempo) {
      tiempoCalculado = convertirUnidad(
        tiempoCalculado,
        unidadReferenciaTiempo,
        unidadDeseadaTiempo
      );
    }

    return {
      tipo: "tiempo",
      valor: tiempoCalculado,
      unidad: unidadDeseadaTiempo,
    };
  }

  throw new Error("No se pudo determinar qué variable calcular");
};
