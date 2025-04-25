interface AmortizationParams {
  capital: number;
  tasaInteres: number;
  numPagos: number;
  metodo: "frances" | "aleman" | "americano";
  unidadTasa: string;
  unidadTiempo: string;
}

interface AmortizationResult {
  cuota?: number;
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
    semestral: 2,
    cuatrimestral: 3,
    trimestral: 4,
    bimestral: 6,
    mensual: 12,
    quincenal: 24,
    semanal: 52,
    diario: 365,
    horario: 8760, // 365 días * 24 horas
    minuto: 525600, // 365 días * 24 horas * 60 minutos
    segundo: 31536000, // 365 días * 24 horas * 60 minutos * 60 segundos
  };

  const fromPeriods = periodsPerYear[fromUnit] || 1;
  const toPeriods = periodsPerYear[toUnit] || 1;

  // Convertir la tasa a tasa efectiva anual
  const ratePerYear = Math.pow(1 + rate, fromPeriods) - 1;

  // Convertir de tasa efectiva anual a la unidad deseada
  const ratePerToPeriod = Math.pow(1 + ratePerYear, 1 / toPeriods) - 1;

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
    const amortizacionFija = P / n; // Amortización fija de capital
    let saldo = P; // Saldo inicial
    let sumaCuotas = 0;

    for (let periodo = 1; periodo <= n; periodo++) {
      // Calcular intereses sobre el saldo pendiente actual
      const interes = saldo * iEffective;

      // La cuota total es la suma de la amortización fija más los intereses
      const cuota = amortizacionFija + interes;

      // Agregar la fila a la tabla
      tabla.push({
        periodo,
        cuota,
        interes,
        capitalAmortizado: amortizacionFija,
        saldo,
      });

      // Actualizar el saldo restando la amortización fija
      saldo = Math.max(0, saldo - amortizacionFija);
      sumaCuotas += cuota;
    }

    // Verificar que el último saldo sea 0 o muy cercano a 0
    if (Math.abs(saldo) > 0.01) {
      throw new Error("Error en el cálculo: el saldo final no es cero");
    }

    // Solo retornamos la tabla sin cuota promedio para el sistema alemán
    return { tabla };
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
