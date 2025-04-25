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
  unidadDestino: string,
  esTasa: boolean = false
): number => {
  if (unidadOrigen === unidadDestino) return valor;

  const factorOrigen = CONVERSION_FACTORS[unidadOrigen];
  const factorDestino = CONVERSION_FACTORS[unidadDestino];

  if (!factorOrigen || !factorDestino) {
    throw new Error(`Unidad no soportada: ${unidadOrigen} o ${unidadDestino}`);
  }

  if (esTasa) {
    // Convertir tasa efectiva: (1 + i)^(factor_origen/factor_destino) - 1
    const exponente = factorOrigen / factorDestino;
    return Math.pow(1 + valor, exponente) - 1;
  } else {
    // Conversión lineal para tiempo
    return valor * (factorOrigen / factorDestino);
  }
};

export interface AnnuityParams {
  valorFuturo?: number;
  valorActual?: number;
  renta?: number;
  tasa?: number; // En porcentaje (ej. 5 para 5%)
  unidadTasa: string;
  tiempo?: number;
  unidadTiempo: string;
  unidadDeseadaTasa?: string;
  unidadDeseadaTiempo?: string;
}

export interface AnnuityResult {
  tipo: "valorFuturo" | "valorActual" | "tasa" | "tiempo";
  valor: number;
  unidad?: string;
}

export const calcularAnualidad = (
  params: AnnuityParams,
  campoACalcular: "valorFuturo" | "valorActual" | "tasa" | "tiempo"
): AnnuityResult => {
  const {
    valorFuturo,
    valorActual,
    renta,
    tasa,
    unidadTasa,
    tiempo,
    unidadTiempo,
    unidadDeseadaTasa = unidadTasa,
    unidadDeseadaTiempo = unidadTiempo,
  } = params;

  // Validar unidades soportadas
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

  // Convertir tasa a decimal y ajustar unidades
  let tasaDecimal: number | undefined;
  let unidadReferenciaTasa = unidadTasa;
  let unidadReferenciaTiempo = unidadTiempo;

  if (tasa !== undefined) {
    tasaDecimal = tasa / 100;
    if (unidadTasa !== unidadTiempo) {
      tasaDecimal = convertirUnidad(
        tasaDecimal,
        unidadTasa,
        unidadTiempo,
        true
      );
      unidadReferenciaTasa = unidadTiempo;
    }
  }

  // Ajustar tiempo si las unidades no coinciden
  let tiempoAjustado = tiempo;
  if (tiempo !== undefined && unidadTiempo !== unidadReferenciaTiempo) {
    tiempoAjustado = convertirUnidad(
      tiempo,
      unidadTiempo,
      unidadReferenciaTiempo
    );
  }

  // Determinar qué calcular
  if (
    campoACalcular === "valorFuturo" &&
    renta !== undefined &&
    tasaDecimal !== undefined &&
    tiempoAjustado !== undefined
  ) {
    // VF = R × [(1 + i)^n - 1] / i
    const valorFuturoCalculado =
      (renta * (Math.pow(1 + tasaDecimal, tiempoAjustado) - 1)) / tasaDecimal;
    return {
      tipo: "valorFuturo",
      valor: valorFuturoCalculado,
    };
  }

  if (
    campoACalcular === "valorActual" &&
    renta !== undefined &&
    tasaDecimal !== undefined &&
    tiempoAjustado !== undefined
  ) {
    // VA = R × [1 - (1 + i)^(-n)] / i
    const valorActualCalculado =
      (renta * (1 - Math.pow(1 + tasaDecimal, -tiempoAjustado))) / tasaDecimal;
    return {
      tipo: "valorActual",
      valor: valorActualCalculado,
    };
  }

  if (
    campoACalcular === "tasa" &&
    valorFuturo !== undefined &&
    valorActual !== undefined &&
    tiempoAjustado !== undefined
  ) {
    // i = (VF / VA)^(1/n) - 1
    let tasaCalculada =
      Math.pow(valorFuturo / valorActual, 1 / tiempoAjustado) - 1;

    if (unidadReferenciaTasa !== unidadDeseadaTasa) {
      tasaCalculada = convertirUnidad(
        tasaCalculada,
        unidadReferenciaTasa,
        unidadDeseadaTasa,
        true
      );
    }

    return {
      tipo: "tasa",
      valor: tasaCalculada * 100, // Convertir a porcentaje
      unidad: unidadDeseadaTasa,
    };
  }

  if (
    campoACalcular === "tiempo" &&
    valorFuturo !== undefined &&
    valorActual !== undefined &&
    tasaDecimal !== undefined
  ) {
    // t = log(VF / VA) / log(1 + i)
    let tiempoCalculado =
      Math.log(valorFuturo / valorActual) / Math.log(1 + tasaDecimal);

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
