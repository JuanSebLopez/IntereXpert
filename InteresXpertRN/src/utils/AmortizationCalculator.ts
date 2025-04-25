interface AmortizationParams {
  capital: number;
  tasaInteres: number;
  numPagos: number;
  metodo: "frances" | "aleman" | "americano";
  unidadTasa: string;
  unidadTiempo: string;
}

interface AmortizationResult {
  cuota: number;
  tabla: {
    periodo: number;
    cuota: number;
    interes: number;
    capitalAmortizado: number;
    saldo: number;
  }[];
}

// Función para convertir la tasa de interés según las unidades de tiempo
export const convertRate = (
  rate: number,
  fromUnit: string,
  toUnit: string
): number => {
  const periodsPerYear: { [key: string]: number } = {
    anual: 1,
    mensual: 12,
    semanal: 52,
    diario: 365,
  };

  const fromPeriods = periodsPerYear[fromUnit] || 1;
  const toPeriods = periodsPerYear[toUnit] || 1;

  const ratePerFromPeriod = rate / fromPeriods;
  const ratePerToPeriod = ratePerFromPeriod * (fromPeriods / toPeriods);

  return ratePerToPeriod;
};

// Función principal para calcular la amortización
const AmortizationCalculator = (
  params: AmortizationParams
): AmortizationResult => {
  const {
    capital: P,
    tasaInteres: i,
    numPagos: n,
    metodo,
    unidadTasa,
    unidadTiempo,
  } = params;

  // Convertir la tasa de interés según las unidades de tiempo
  const iEffective = convertRate(i, unidadTasa, unidadTiempo);

  let cuotaPromedio = 0;
  const tabla: {
    periodo: number;
    cuota: number;
    interes: number;
    capitalAmortizado: number;
    saldo: number;
  }[] = [];

  if (metodo === "frances") {
    // Sistema Francés: Cuotas fijas
    const cuota =
      (P * iEffective * Math.pow(1 + iEffective, n)) /
      (Math.pow(1 + iEffective, n) - 1);
    let saldo = P;

    for (let periodo = 1; periodo <= n; periodo++) {
      const interes = saldo * iEffective;
      const capitalAmortizado = cuota - interes;
      saldo -= capitalAmortizado;

      tabla.push({
        periodo,
        cuota,
        interes,
        capitalAmortizado,
        saldo: saldo < 0 ? 0 : saldo,
      });
    }

    cuotaPromedio = cuota;
  } else if (metodo === "aleman") {
    // Sistema Alemán: Amortización fija de capital
    const amortizacionFija = P / n;
    let saldo = P;
    let totalCuotas = 0;

    for (let periodo = 1; periodo <= n; periodo++) {
      const interes = saldo * iEffective;
      const cuota = amortizacionFija + interes;
      saldo -= amortizacionFija;

      tabla.push({
        periodo,
        cuota,
        interes,
        capitalAmortizado: amortizacionFija,
        saldo: saldo < 0 ? 0 : saldo,
      });

      totalCuotas += cuota;
    }

    cuotaPromedio = totalCuotas / n;
  } else {
    // Sistema Americano: Solo intereses y pago final del capital
    const interesPeriodico = P * iEffective;
    let saldo = P;

    for (let periodo = 1; periodo <= n; periodo++) {
      const cuota = periodo === n ? interesPeriodico + P : interesPeriodico;
      const capitalAmortizado = periodo === n ? P : 0;
      saldo = periodo === n ? 0 : P;

      tabla.push({
        periodo,
        cuota,
        interes: interesPeriodico,
        capitalAmortizado,
        saldo,
      });
    }

    cuotaPromedio = (interesPeriodico * (n - 1) + (interesPeriodico + P)) / n;
  }

  return { cuota: cuotaPromedio, tabla };
};

// Exportar la función calculate como el valor por defecto
export default AmortizationCalculator;
