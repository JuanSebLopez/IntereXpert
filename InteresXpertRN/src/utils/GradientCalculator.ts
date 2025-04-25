interface GradientParams {
  renta: number;
  tasaInteres: number;
  tiempo: number;
  crecimiento: number;
  modo: "gradienteAritmetico" | "gradienteGeometrico";
  campoACalcular: "valorFuturo" | "valorPresente";
  unidadTasa: string;
  unidadTiempo: string;
}

// Función para convertir la tasa de interés según las unidades de tiempo
export const convertRate = (
  rate: number,
  fromUnit: string,
  toUnit: string
): number => {
  const periodsPerYear: { [key: string]: number } = {
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

  const fromPeriods = periodsPerYear[fromUnit] || 1;
  const toPeriods = periodsPerYear[toUnit] || 1;

  // Convertir la tasa a una tasa efectiva por período
  const ratePerFromPeriod = rate / fromPeriods;
  const ratePerToPeriod = ratePerFromPeriod * (fromPeriods / toPeriods);

  return ratePerToPeriod;
};

// Función principal para calcular el gradiente
const GradientCalculator = (params: GradientParams): number => {
  const {
    renta: A,
    tasaInteres: i,
    tiempo: n,
    crecimiento: G,
    modo,
    campoACalcular,
    unidadTasa,
    unidadTiempo,
  } = params;

  // Convertir la tasa de interés según las unidades de tiempo usando la función exportada
  const iEffective = convertRate(i, unidadTasa, unidadTiempo);

  if (modo === "gradienteAritmetico") {
    if (campoACalcular === "valorFuturo") {
      const term1 = (A * ((1 + iEffective) ** n - 1)) / iEffective;
      const term2 = (G * ((1 + iEffective) ** n - 1)) / iEffective ** 2;
      return term1 + term2;
    } else {
      const term1 = (A * (1 - (1 + iEffective) ** -n)) / iEffective;
      const term2 = (G * (1 - (1 + iEffective) ** -n)) / iEffective ** 2;
      return term1 + term2;
    }
  } else {
    // Para gradiente geométrico, G debe ser un porcentaje (decimal)
    const GDecimal = G / 100; // Convertir G a decimal solo para gradiente geométrico

    // Validar que iEffective no sea igual a GDecimal
    if (iEffective === GDecimal) {
      throw new Error(
        "La tasa de interés y el crecimiento no pueden ser iguales en gradiente geométrico."
      );
    }

    if (campoACalcular === "valorFuturo") {
      return (A * ((1 + GDecimal) ** n - 1)) / (iEffective - GDecimal);
    } else {
      return (A * (1 - (1 + GDecimal) ** n)) / (iEffective - GDecimal);
    }
  }
};

// Exportar la función calculate como el valor por defecto
export default GradientCalculator;