import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Definir tipos para claridad
type CalculationType = 'simple' | 'compound' | 'continuous' | 'periodic' | 'anticipated' | 'deferred';
type PeriodType = 'annual' | 'semiannual' | 'quarterly' | 'monthly' | 'daily';
type TimeUnitType = 'years' | 'semesters' | 'quarters' | 'months' | 'weeks' | 'days';
type CalculationMode = 'capitalFinal' | 'capitalInicial';

interface InputFields {
  capital: string;
  capitalFinal: string;
  rate: string;
  time: string;
  periods?: string;
  deferredTime?: string;
}

const periodsPerYear: Record<PeriodType, number> = {
  annual: 1,
  semiannual: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365, // Simplificación, podría ser 360 en algunos contextos
};

const timeUnitsToYearsFactor: Record<TimeUnitType, number> = {
    years: 1,
    semesters: 1 / 2,
    quarters: 1 / 4,
    months: 1 / 12,
    weeks: 1 / 52, // Aproximación común
    days: 1 / 365,
};

const AdvancedCalculationsScreen: React.FC = () => {
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType>('simple');
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('capitalFinal');
  const [inputFields, setInputFields] = useState<InputFields>({ capital: '', capitalFinal: '', rate: '', time: '' });
  const [ratePeriod, setRatePeriod] = useState<PeriodType>('annual');
  const [timeUnit, setTimeUnit] = useState<TimeUnitType>('years');
  const [deferredTimeUnit, setDeferredTimeUnit] = useState<TimeUnitType>('years'); // Para capitalización diferida
  const [result, setResult] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');

  const handleInputChange = (field: keyof InputFields, value: string) => {
    setInputFields(prev => ({ ...prev, [field]: value }));
  };

  const resetFields = () => {
    setInputFields({ capital: '', capitalFinal: '', rate: '', time: '', periods: '', deferredTime: '' });
    setResult(null);
    setExplanation('');
    // No resetear los pickers de periodo/unidad
  };

  // Funciones de cálculo (sin cambios en la lógica interna, reciben tasa y tiempo ANUAL)
  const calculateSimpleCapitalization = (C: number, r_annual: number, t_years: number) => C * (1 + r_annual * t_years);
  const calculateCompoundCapitalization = (C: number, r_annual: number, t_years: number) => C * Math.pow(1 + r_annual, t_years);
  const calculateContinuousCapitalization = (C: number, r_annual: number, t_years: number) => C * Math.exp(r_annual * t_years);
  const calculatePeriodicCapitalization = (C: number, r_annual: number, t_years: number, n: number) => {
    // La tasa anual (r_annual) se divide entre los periodos de capitalización (n)
    // El tiempo en años (t_years) se multiplica por los periodos de capitalización (n)
    // Fórmula: M = C * (1 + i/m)^(m*n) donde:
    // C = capital inicial
    // i = tasa anual nominal
    // m = número de periodos de capitalización por año
    // n = número de años
    return C * Math.pow(1 + r_annual / n, n * t_years);
  }
  const calculateAnticipatedCapitalization = (C: number, r_annual: number, t_years: number) => C * Math.pow(1 + r_annual, t_years + (1 / periodsPerYear[ratePeriod])); // Ajuste para anticipada según periodo
  const calculateDeferredCapitalization = (C: number, r_annual: number, t_years: number, d_years: number) => C * Math.pow(1 + r_annual, t_years - d_years);

  // Función inversa para calcular capital inicial dado el capital final
  const calculateInitialCapital = (M: number, r_annual: number, t_years: number, timeUnit: TimeUnitType, t_input: number, type: CalculationType, n?: number, d_years?: number) => {
    let C: number;

    switch (type) {
      case 'simple':
        // Para el caso simple, necesitamos calcular la tasa por unidad de tiempo
        const ratePerTimeUnit = r_annual * timeUnitsToYearsFactor[timeUnit];
        // Fórmula correcta para interés simple: C = M / (1 + i*n)
        // Donde i es la tasa por unidad de tiempo y n es el tiempo en esa unidad
        C = M / (1 + ratePerTimeUnit * t_input);
        break;
      case 'compound':
        const n_compound = periodsPerYear[ratePeriod];
        const r_eff_compound = Math.pow(1 + r_annual / n_compound, n_compound) - 1;
        C = M / Math.pow(1 + r_eff_compound, t_years);
        break;
      case 'continuous':
        C = M / Math.exp(r_annual * t_years);
        break;
      case 'periodic':
        if (!n) throw new Error('Número de períodos requerido para capitalización periódica');
        // Fórmula: C = M / (1 + i/m)^(m*n) donde:
        // M = monto final
        // i = tasa anual nominal
        // m = número de periodos de capitalización por año
        // n = número de años
        C = M / Math.pow(1 + r_annual / n, n * t_years);
        break;
      case 'anticipated':
        const n_anticipated = periodsPerYear[ratePeriod];
        const r_eff_anticipated = Math.pow(1 + r_annual / n_anticipated, n_anticipated) - 1;
        const one_period_in_years = 1 / n_anticipated;
        C = M / Math.pow(1 + r_eff_anticipated, t_years + one_period_in_years);
        break;
      case 'deferred':
        if (d_years === undefined) throw new Error('Tiempo diferido requerido para capitalización diferida');
        const n_deferred = periodsPerYear[ratePeriod];
        const r_eff_deferred = Math.pow(1 + r_annual / n_deferred, n_deferred) - 1;
        C = M / Math.pow(1 + r_eff_deferred, t_years - d_years);
        break;
      default:
        throw new Error('Tipo de cálculo no soportado');
    }

    return C;
  };

  const handleCalculate = () => {
    const { capital, capitalFinal, rate, time, periods, deferredTime } = inputFields;
    
    // Validar si tenemos el campo requerido dependiendo del modo
    if (calculationMode === 'capitalFinal' && (capital === '' || isNaN(parseFloat(capital)))) {
      Alert.alert('Error', 'Ingrese un valor numérico válido para Capital Inicial.');
      return;
    }
    
    if (calculationMode === 'capitalInicial' && (capitalFinal === '' || isNaN(parseFloat(capitalFinal)))) {
      Alert.alert('Error', 'Ingrese un valor numérico válido para Capital Final.');
      return;
    }
    
    const r_input = parseFloat(rate);
    const t_input = parseFloat(time);

    if (isNaN(r_input) || isNaN(t_input)) {
      Alert.alert('Error', 'Ingrese valores numéricos válidos para Tasa y Tiempo.');
      return;
    }

    // Convertir tasa a efectiva anual
    const periodsForRate = periodsPerYear[ratePeriod];
    // Tasa efectiva anual = (1 + Tasa Nominal / m)^(m) - 1
    // Asumimos que la tasa ingresada es NOMINAL para el periodo seleccionado
    const r_annual_effective = Math.pow(1 + (r_input / 100) / periodsForRate, periodsForRate) - 1;
    // Si la tasa es continua, r_anual = r_input (ya es efectiva anual)
    // Necesitamos clarificar si la tasa ingresada es nominal o efectiva...
    // Por ahora, asumamos que es NOMINAL anual capitalizable según `ratePeriod`.
    // Tasa anual equivalente = (1 + i/m)^m - 1 -> Usaremos r_annual = r_input/100 si ratePeriod es annual
    let r_annual_calc = r_input / 100; // Tasa anual para cálculo (ajustar si no es anual)
     if (ratePeriod !== 'annual') {
        // Si la tasa dada NO es anual, la convertimos a anual EFECTIVA
        const ratePerPeriod = r_input / 100;
        r_annual_calc = Math.pow(1 + ratePerPeriod, periodsPerYear[ratePeriod]) -1;
        // OJO: Esto asume que la tasa dada es EFECTIVA para ese periodo
        // Si fuera NOMINAL anual cap. en ese periodo, sería r_annual_calc = r_input / 100;
        // --> Simplificación: Asumimos que la tasa ingresada es EFECTIVA para el periodo seleccionado
        // EXCEPTO si es anual, donde se asume nominal anual.
        // --> REVISAR: Esta lógica puede ser confusa. Sería mejor pedir tasa EFECTIVA ANUAL siempre?
        // --> Decisión: Pedir Tasa Nominal Anual y el periodo de capitalización.
        // --> Nueva Lógica: r_nominal_anual = r_input / 100. n_rate = periodsPerYear[ratePeriod]
         r_annual_calc = r_input / 100; // Asumimos tasa Nominal Anual
     }
    
    // Convertir tiempo a años
    const t_years = t_input * timeUnitsToYearsFactor[timeUnit];

    let M: number | null = null;
    let C: number | null = null;
    let calcExplanation = `Tasa Nominal Anual: ${r_input}% (${ratePeriod})\nTiempo: ${t_input} ${timeUnit} (${t_years.toFixed(4)} años)\n`;

    try {
      if (calculationMode === 'capitalFinal') {
        // Modo capital final (mantener lógica existente)
        C = parseFloat(capital);
        calcExplanation = `Capital Inicial (C): ${C}\n` + calcExplanation;

        switch (selectedCalculation) {
          case 'simple':
            const ratePerTimeUnit = r_annual_calc * timeUnitsToYearsFactor[timeUnit];
            // Usar la fórmula correcta para interés simple: M = C * (1 + i*n)
            // donde i es la tasa por unidad de tiempo y n es el tiempo en esa unidad
            M = C * (1 + ratePerTimeUnit * t_input);
            calcExplanation += `Fórmula Simple: M = C * (1 + (tasa_periodo * tiempo_en_periodos))\n`;
            calcExplanation += `Tasa por ${timeUnit}: ${(ratePerTimeUnit * 100).toFixed(4)}%`;
            break;
          case 'compound':
              const n_compound = periodsPerYear[ratePeriod];
              const r_eff_compound = Math.pow(1 + r_annual_calc / n_compound, n_compound) - 1;
              M = C * Math.pow(1 + r_eff_compound, t_years);
              calcExplanation += `Capitalización: ${ratePeriod}\nTasa Efectiva Anual: ${(r_eff_compound * 100).toFixed(4)}%\n`;
              calcExplanation += `Fórmula Compuesta: M = C(1 + r_efectiva_anual)^t_años`;
            break;
          case 'continuous':
            M = C * Math.exp(r_annual_calc * t_years);
            calcExplanation += `Fórmula Continua: M = C·e^(r_nominal_anual * t_años)`;
            break;
          case 'periodic':
            const n_periodic = parseFloat(periods || '');
            if (isNaN(n_periodic) || n_periodic <= 0) {
              Alert.alert('Error', 'Ingrese un número válido y positivo de períodos de capitalización por año (n).');
              return;
            }
            M = C * Math.pow(1 + r_annual_calc / n_periodic, n_periodic * t_years);
            calcExplanation += `Períodos Capitalización (n): ${n_periodic} por año\n`;
            calcExplanation += `Fórmula Periódica: M = C * (1 + i/m)^(m*n)\n`;
            calcExplanation += `M = ${C} * (1 + ${(r_annual_calc * 100).toFixed(2)}%/${n_periodic})^(${n_periodic} * ${t_years})\n`;
            calcExplanation += `M = ${C} * (1 + ${(r_annual_calc / n_periodic).toFixed(6)})^(${n_periodic * t_years})\n`;
            calcExplanation += `M = ${C} * ${Math.pow(1 + r_annual_calc / n_periodic, n_periodic * t_years).toFixed(6)}\n`;
            break;
          case 'anticipated':
             const n_anticipated = periodsPerYear[ratePeriod];
             const r_eff_anticipated = Math.pow(1 + r_annual_calc / n_anticipated, n_anticipated) - 1;
             const one_period_in_years = 1 / n_anticipated;
             M = C * Math.pow(1 + r_eff_anticipated, t_years + one_period_in_years);
              calcExplanation += `Capitalización: ${ratePeriod}\nTasa Efectiva Anual: ${(r_eff_anticipated * 100).toFixed(4)}%\n`;
              calcExplanation += `Fórmula Anticipada: M = C(1 + r_efectiva_anual)^(t_años + 1/n)`;
            break;
          case 'deferred':
            const d_input = parseFloat(deferredTime || '');
            if (isNaN(d_input) || d_input < 0) {
              Alert.alert('Error', 'Ingrese un tiempo de espera (d) válido.');
              return;
            }
            const d_years = d_input * timeUnitsToYearsFactor[deferredTimeUnit];
            if (t_years <= d_years) {
              Alert.alert('Error', 'El tiempo (t) debe ser mayor que el tiempo de espera (d) en la misma unidad.');
              return;
            }
             const n_deferred = periodsPerYear[ratePeriod];
             const r_eff_deferred = Math.pow(1 + r_annual_calc / n_deferred, n_deferred) - 1;
             M = C * Math.pow(1 + r_eff_deferred, t_years - d_years);
              calcExplanation += `Capitalización: ${ratePeriod}\nTasa Efectiva Anual: ${(r_eff_deferred * 100).toFixed(4)}%\n`;
              calcExplanation += `Tiempo Espera: ${d_input} ${deferredTimeUnit} (${d_years.toFixed(4)} años)\n`;
              calcExplanation += `Fórmula Diferida: M = C(1 + r_efectiva_anual)^(t_años - d_años)`;
            break;
        }
        if (M !== null && !isNaN(M) && isFinite(M)) {
          setResult(`Monto Final: $${M.toFixed(2)}`);
          setExplanation(calcExplanation);
        } else {
          throw new Error('El resultado del cálculo no es válido.');
        }
      } else {
        // Modo capital inicial (nueva lógica)
        M = parseFloat(capitalFinal);
        calcExplanation = `Capital Final (M): ${M}\n` + calcExplanation;

        switch (selectedCalculation) {
          case 'simple':
            C = calculateInitialCapital(M, r_annual_calc, t_years, timeUnit, t_input, selectedCalculation);
            const ratePerTimeUnit = r_annual_calc * timeUnitsToYearsFactor[timeUnit];
            calcExplanation += `Fórmula Simple Inversa: C = M / (1 + (tasa_periodo * tiempo_en_periodos))\n`;
            calcExplanation += `C = ${M} / (1 + ${(ratePerTimeUnit * 100).toFixed(2)}% * ${t_input})\n`;
            calcExplanation += `C = ${M} / ${(1 + ratePerTimeUnit * t_input).toFixed(4)}\n`;
            calcExplanation += `Tasa por ${timeUnit}: ${(ratePerTimeUnit * 100).toFixed(4)}%`;
            break;
          case 'compound':
            C = calculateInitialCapital(M, r_annual_calc, t_years, timeUnit, t_input, selectedCalculation);
            calcExplanation += `Capitalización: ${ratePeriod}\n`;
            calcExplanation += `Fórmula Compuesta Inversa: C = M / (1 + r_efectiva_anual)^t_años`;
            break;
          case 'continuous':
            C = calculateInitialCapital(M, r_annual_calc, t_years, timeUnit, t_input, selectedCalculation);
            calcExplanation += `Fórmula Continua Inversa: C = M / e^(r_nominal_anual * t_años)`;
            break;
          case 'periodic':
            const n_periodic = parseFloat(periods || '');
            if (isNaN(n_periodic) || n_periodic <= 0) {
              Alert.alert('Error', 'Ingrese un número válido y positivo de períodos de capitalización por año (n).');
              return;
            }
            C = calculateInitialCapital(M, r_annual_calc, t_years, timeUnit, t_input, selectedCalculation, n_periodic);
            calcExplanation += `Períodos Capitalización (n): ${n_periodic} por año\n`;
            calcExplanation += `Fórmula Periódica Inversa: C = M / (1 + i/m)^(m*n)\n`;
            calcExplanation += `C = ${M} / (1 + ${(r_annual_calc * 100).toFixed(2)}%/${n_periodic})^(${n_periodic} * ${t_years})\n`;
            calcExplanation += `C = ${M} / (1 + ${(r_annual_calc / n_periodic).toFixed(6)})^(${n_periodic * t_years})\n`;
            calcExplanation += `C = ${M} / ${Math.pow(1 + r_annual_calc / n_periodic, n_periodic * t_years).toFixed(6)}\n`;
            break;
          case 'anticipated':
            C = calculateInitialCapital(M, r_annual_calc, t_years, timeUnit, t_input, selectedCalculation);
            calcExplanation += `Capitalización: ${ratePeriod}\n`;
            calcExplanation += `Fórmula Anticipada Inversa: C = M / (1 + r_efectiva_anual)^(t_años + 1/n)`;
            break;
          case 'deferred':
            const d_input = parseFloat(deferredTime || '');
            if (isNaN(d_input) || d_input < 0) {
              Alert.alert('Error', 'Ingrese un tiempo de espera (d) válido.');
              return;
            }
            const d_years = d_input * timeUnitsToYearsFactor[deferredTimeUnit];
            if (t_years <= d_years) {
              Alert.alert('Error', 'El tiempo (t) debe ser mayor que el tiempo de espera (d) en la misma unidad.');
              return;
            }
            C = calculateInitialCapital(M, r_annual_calc, t_years, timeUnit, t_input, selectedCalculation, undefined, d_years);
            calcExplanation += `Capitalización: ${ratePeriod}\n`;
            calcExplanation += `Tiempo Espera: ${d_input} ${deferredTimeUnit} (${d_years.toFixed(4)} años)\n`;
            calcExplanation += `Fórmula Diferida Inversa: C = M / (1 + r_efectiva_anual)^(t_años - d_años)`;
            break;
        }
        if (C !== null && !isNaN(C) && isFinite(C)) {
          setResult(`Capital Inicial: $${C.toFixed(2)}`);
          setExplanation(calcExplanation);
        } else {
          throw new Error('El resultado del cálculo no es válido.');
        }
      }
    } catch (error: any) {
      console.error("Error en cálculo:", error);
      Alert.alert('Error', `No se pudo realizar el cálculo. ${error.message || 'Revise los datos ingresados.'}`);
      setResult(null);
      setExplanation('');
    }
  };

  const getCalculationLabel = (type: CalculationType): string => {
      switch (type) {
          case 'simple': return 'Capitalización Simple';
          case 'compound': return 'Capitalización Compuesta';
          case 'continuous': return 'Capitalización Continua';
          case 'periodic': return 'Capitalización Periódica';
          case 'anticipated': return 'Capitalización Anticipada';
          case 'deferred': return 'Capitalización Diferida';
          default: return '';
      }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Calculadora de Capitalizaciones</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de Capitalización:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCalculation}
              onValueChange={(itemValue) => {
                setSelectedCalculation(itemValue as CalculationType);
                resetFields();
              }}
              style={styles.picker}
            >
              <Picker.Item label="Simple" value="simple" />
              <Picker.Item label="Compuesta" value="compound" />
              <Picker.Item label="Continua" value="continuous" />
              <Picker.Item label="Periódica" value="periodic" />
              <Picker.Item label="Anticipada" value="anticipated" />
              <Picker.Item label="Diferida" value="deferred" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Modo de Cálculo:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={calculationMode}
              onValueChange={(itemValue) => {
                setCalculationMode(itemValue as CalculationMode);
                resetFields();
              }}
              style={styles.picker}
            >
              <Picker.Item label="Calcular Capital Final" value="capitalFinal" />
              <Picker.Item label="Calcular Capital Inicial" value="capitalInicial" />
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{getCalculationLabel(selectedCalculation)}</Text>

        {calculationMode === 'capitalFinal' ? (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capital Inicial (C)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 1000"
              keyboardType="numeric"
              value={inputFields.capital}
              onChangeText={value => handleInputChange('capital', value)}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capital Final (M)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 1500"
              keyboardType="numeric"
              value={inputFields.capitalFinal}
              onChangeText={value => handleInputChange('capitalFinal', value)}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tasa de Interés Nominal Anual (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5"
            keyboardType="numeric"
            value={inputFields.rate}
            onChangeText={value => handleInputChange('rate', value)}
          />
        </View>
        
        {/* Selector Periodo Tasa (Capitalización) - No aplica a simple/continua */} 
        {selectedCalculation !== 'simple' && selectedCalculation !== 'continuous' && (
           <View style={styles.inputContainer}>
             <Text style={styles.label}>Periodo Capitalización Tasa:</Text>
             <View style={styles.pickerWrapper}>
               <Picker
                 selectedValue={ratePeriod}
                 onValueChange={(itemValue) => setRatePeriod(itemValue as PeriodType)}
                 style={styles.picker}
               >
                 <Picker.Item label="Anual" value="annual" />
                 <Picker.Item label="Semestral" value="semiannual" />
                 <Picker.Item label="Trimestral" value="quarterly" />
                 <Picker.Item label="Mensual" value="monthly" />
                 <Picker.Item label="Diaria" value="daily" />
               </Picker>
             </View>
           </View>
        )}
        {/* Mostrar periodo para Simple (tasa no se capitaliza, pero aplica a un periodo) */} 
         {selectedCalculation === 'simple' && (
           <View style={styles.inputContainer}>
             <Text style={styles.label}>Periodo de la Tasa (Simple):</Text>
             <View style={styles.pickerWrapper}>
               <Picker
                 selectedValue={ratePeriod} 
                 onValueChange={(itemValue) => setRatePeriod(itemValue as PeriodType)}
                 style={styles.picker}
               >
                 <Picker.Item label="Anual" value="annual" />
                 <Picker.Item label="Semestral" value="semiannual" />
                 <Picker.Item label="Trimestral" value="quarterly" />
                 <Picker.Item label="Mensual" value="monthly" />
                 <Picker.Item label="Diaria" value="daily" />
               </Picker>
             </View>
             <Text style={styles.infoText}>Para Interés Simple, la Tasa Nominal Anual se aplica proporcionalmente al Periodo del Tiempo.</Text>
           </View>
         )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tiempo (t)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Ej: 3"
              keyboardType="numeric"
              value={inputFields.time}
              onChangeText={value => handleInputChange('time', value)}
            />
            <View style={[styles.pickerWrapper, { flex: 1 }]}>
              <Picker
                selectedValue={timeUnit}
                onValueChange={(itemValue) => setTimeUnit(itemValue as TimeUnitType)}
                style={styles.picker}
              >
                <Picker.Item label="Años" value="years" />
                <Picker.Item label="Semestres" value="semesters" />
                <Picker.Item label="Trimestres" value="quarters" />
                <Picker.Item label="Meses" value="months" />
                <Picker.Item label="Semanas" value="weeks" />
                <Picker.Item label="Días" value="days" />
              </Picker>
            </View>
          </View>
        </View>

        {selectedCalculation === 'periodic' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Períodos Capitalización por Año (n)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 12 (para mensual)"
              keyboardType="numeric"
              value={inputFields.periods}
              onChangeText={value => handleInputChange('periods', value)}
            />
            <Text style={styles.infoText}>Este 'n' define cuántas veces al año se calcula y añade el interés al capital.</Text>
          </View>
        )}

        {selectedCalculation === 'deferred' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tiempo de Espera (d)</Text>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  placeholder="Ej: 1"
                  keyboardType="numeric"
                  value={inputFields.deferredTime}
                  onChangeText={value => handleInputChange('deferredTime', value)}
                />
                 <View style={[styles.pickerWrapper, { flex: 1 }]}>
                  <Picker
                    selectedValue={deferredTimeUnit}
                    onValueChange={(itemValue) => setDeferredTimeUnit(itemValue as TimeUnitType)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Años" value="years" />
                    <Picker.Item label="Semestres" value="semesters" />
                    <Picker.Item label="Trimestres" value="quarters" />
                    <Picker.Item label="Meses" value="months" />
                    <Picker.Item label="Semanas" value="weeks" />
                    <Picker.Item label="Días" value="days" />
                  </Picker>
                 </View>
            </View>
             <Text style={styles.infoText}>Tiempo antes de que los intereses comiencen a generarse. Debe estar en la misma unidad que el Tiempo (t).</Text>
          </View>
        )}

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateButtonText}>
            {calculationMode === 'capitalFinal' ? 'Calcular Monto Final' : 'Calcular Capital Inicial'}
          </Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Resultado:</Text>
            <Text style={styles.resultText}>{result}</Text>
            <Text style={styles.explanationTitle}>Detalle del Cálculo:</Text>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos actualizados y consistentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50, // Espacio extra al final
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
   pickerWrapper: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // Quitar marginBottom de aquí para controlarlo en el contenedor
  },
  picker: {
     height: 50, 
     width: '100%', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4527A0',
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    // height: 50, // Altura fija para alinear con pickers
  },
   infoText: {
      fontSize: 12,
      color: '#666',
      marginTop: 5,
  },
  calculateButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15, // Aumentar espacio antes del botón
    marginBottom: 25,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 15,
    textAlign: 'center',
  },
  explanationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555',
      marginTop: 10,
      marginBottom: 5,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default AdvancedCalculationsScreen; 