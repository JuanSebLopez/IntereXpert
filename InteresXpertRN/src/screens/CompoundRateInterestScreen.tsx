import React, { useState } from 'react';
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  calcularInteresCompuesto,
  ResultadoInteresCompuesto,
  InteresCompuestoParams,
} from "../utils/InteresCompuestoCalculator";

// Definimos un tipo para las unidades
type Unidad =
  | "anual"
  | "semestral"
  | "cuatrimestral"
  | "trimestral"
  | "bimestral"
  | "mensual"
  | "semanal"
  | "diario"
  | "horas"
  | "minutos"
  | "segundos";
const UNIDADES: Unidad[] = [
  "anual",
  "semestral",
  "cuatrimestral",
  "trimestral",
  "bimestral",
  "mensual",
  "semanal",
  "diario",
  "horas",
  "minutos",
  "segundos",
];

const CompoundRateInterestScreen: React.FC = () => {
  const [variableACalcular, setVariableACalcular] = useState<
    "valorFuturo" | "capital" | "tasa" | "tiempo"
  >("valorFuturo");
  const [capital, setCapital] = useState("");
  const [valorFuturo, setValorFuturo] = useState("");
  const [tasa, setTasa] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [unitTasa, setUnitTasa] = useState<Unidad>("anual");
  const [unitTiempo, setUnitTiempo] = useState<Unidad>("anual");
  const [desiredUnitTasa, setDesiredUnitTasa] = useState<Unidad>("anual");
  const [desiredUnitTiempo, setDesiredUnitTiempo] = useState<Unidad>("anual");
  const [result, setResult] = useState<ResultadoInteresCompuesto | null>(null);

  const clearForm = () => {
    setCapital("");
    setValorFuturo("");
    setTasa("");
    setTiempo("");
    setUnitTasa("anual");
    setUnitTiempo("anual");
    setDesiredUnitTasa("anual");
    setDesiredUnitTiempo("anual");
    setResult(null);
  };

  const calculateCompoundInterest = () => {
    try {
      const params: Partial<InteresCompuestoParams> = {
        unidadTasa: unitTasa,
        unidadTiempo: unitTiempo,
        unidadDeseadaTasa:
          variableACalcular === "tasa" ? desiredUnitTasa : undefined,
        unidadDeseadaTiempo:
          variableACalcular === "tiempo" ? desiredUnitTiempo : undefined,
      };

      switch (variableACalcular) {
        case "valorFuturo":
          if (!capital || !tasa || !tiempo) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.capital = parseFloat(capital);
          params.tasa = parseFloat(tasa);
          params.tiempo = parseFloat(tiempo);
          break;

        case "capital":
          if (!valorFuturo || !tasa || !tiempo) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.valorFuturo = parseFloat(valorFuturo);
          params.tasa = parseFloat(tasa);
          params.tiempo = parseFloat(tiempo);
          break;

        case "tasa":
          if (!capital || !valorFuturo || !tiempo) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.capital = parseFloat(capital);
          params.valorFuturo = parseFloat(valorFuturo);
          params.tiempo = parseFloat(tiempo);
          if (parseFloat(valorFuturo) <= parseFloat(capital)) {
            Alert.alert(
              "Error",
              "El monto final debe ser mayor que el capital inicial"
            );
            return;
          }
          break;

        case "tiempo":
          if (!capital || !valorFuturo || !tasa) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.capital = parseFloat(capital);
          params.valorFuturo = parseFloat(valorFuturo);
          params.tasa = parseFloat(tasa);
          if (parseFloat(valorFuturo) <= parseFloat(capital)) {
            Alert.alert(
              "Error",
              "El monto final debe ser mayor que el capital inicial"
            );
            return;
          }
          break;
      }

      // Validar que los valores sean mayores que cero
      const valores = [
        params.capital,
        params.valorFuturo,
        params.tasa,
        params.tiempo,
      ].filter((v) => v !== undefined);
      if (valores.some((v) => v! <= 0)) {
        Alert.alert("Error", "Todos los valores deben ser mayores que cero");
        return;
      }

      const resultado = calcularInteresCompuesto(
        params as InteresCompuestoParams
      );
      setResult(resultado);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error en el cálculo"
      );
    }
  };

  const renderizarCampos = () => {
    return (
      <>
        {variableACalcular !== "capital" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Capital Inicial (P)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 1000"
              keyboardType="numeric"
              value={capital}
              onChangeText={setCapital}
            />
          </View>
        )}

        {variableACalcular !== "valorFuturo" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto Final (A)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 1500"
              keyboardType="numeric"
              value={valorFuturo}
              onChangeText={setValorFuturo}
            />
          </View>
        )}

        {variableACalcular !== "tasa" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tasa de Interés (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 5"
              keyboardType="numeric"
              value={tasa}
              onChangeText={setTasa}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Unidad de Tasa:</Text>
              <Picker
                selectedValue={unitTasa}
                style={styles.picker}
                onValueChange={(itemValue: Unidad) => setUnitTasa(itemValue)}
              >
                {UNIDADES.map((unidad) => (
                  <Picker.Item key={unidad} label={unidad} value={unidad} />
                ))}
              </Picker>
            </View>

            {variableACalcular === "tiempo" && (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Unidad Deseada de Tasa:</Text>
                <Picker
                  selectedValue={desiredUnitTasa}
                  style={styles.picker}
                  onValueChange={(itemValue: Unidad) =>
                    setDesiredUnitTasa(itemValue)
                  }
                >
                  {UNIDADES.map((unidad) => (
                    <Picker.Item key={unidad} label={unidad} value={unidad} />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        )}

        {variableACalcular !== "tiempo" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiempo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 2"
              keyboardType="numeric"
              value={tiempo}
              onChangeText={setTiempo}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Unidad de Tiempo:</Text>
              <Picker
                selectedValue={unitTiempo}
                style={styles.picker}
                onValueChange={(itemValue: Unidad) => setUnitTiempo(itemValue)}
              >
                {UNIDADES.map((unidad) => (
                  <Picker.Item key={unidad} label={unidad} value={unidad} />
                ))}
              </Picker>
            </View>

            {variableACalcular === "tasa" && (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>
                  Unidad Deseada de Tiempo:
                </Text>
                <Picker
                  selectedValue={desiredUnitTiempo}
                  style={styles.picker}
                  onValueChange={(itemValue: Unidad) =>
                    setDesiredUnitTiempo(itemValue)
                  }
                >
                  {UNIDADES.map((unidad) => (
                    <Picker.Item key={unidad} label={unidad} value={unidad} />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Calculadora de Interés Compuesto</Text>
            <Text style={styles.subtitle}>
              Calcula variables para un interés compuesto
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.variableSelector}>
              <Text style={styles.selectorLabel}>¿Qué deseas calcular?</Text>
              <View style={styles.selectorButtonsContainer}>
                {["valorFuturo", "capital", "tasa", "tiempo"].map(
                  (variable) => (
                    <TouchableOpacity
                      key={variable}
                      style={[
                        styles.selectorButton,
                        variableACalcular === variable &&
                          styles.activeSelectorButton,
                      ]}
                      onPress={() => {
                        setVariableACalcular(
                          variable as
                            | "valorFuturo"
                            | "capital"
                            | "tasa"
                            | "tiempo"
                        );
                        clearForm();
                      }}
                    >
                      <Text
                        style={[
                          styles.selectorButtonText,
                          variableACalcular === variable &&
                            styles.activeSelectorButtonText,
                        ]}
                      >
                        {variable === "valorFuturo"
                          ? "Monto Final"
                          : variable.charAt(0).toUpperCase() +
                            variable.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {renderizarCampos()}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={calculateCompoundInterest}
              >
                <Text style={styles.buttonText}>Calcular</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            {result && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Resultado:</Text>
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      {result.tipo === "valorFuturo"
                        ? "Monto Final"
                        : result.tipo.charAt(0).toUpperCase() +
                          result.tipo.slice(1)}
                      :
                    </Text>
                    <Text style={styles.resultValue}>
                      {result.tipo === "tasa"
                        ? `${result.valor.toFixed(2)}%`
                        : result.tipo === "tiempo"
                        ? `${result.valor.toFixed(2)}`
                        : `$${result.valor.toFixed(2)}`}
                      {result.unidad ? ` ${result.unidad.toUpperCase()}` : ""}
                    </Text>
                  </View>
                </View>

                <View style={styles.formulaContainer}>
                  <Text style={styles.formulaTitle}>Fórmula Aplicada:</Text>
                  <Text style={styles.formula}>
                    {result.tipo === "valorFuturo"
                      ? "A = P × (1 + i)^n"
                      : result.tipo === "capital"
                      ? "P = A / (1 + i)^n"
                      : result.tipo === "tasa"
                      ? "i = (A / P)^(1/n) - 1"
                      : "n = ln(A / P) / ln(1 + i)"}
                  </Text>
                  <Text style={styles.formulaWhere}>
                    Donde: A = Monto Final, P = Capital Inicial, i = Tasa de
                    interés (decimal), n = Tiempo
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#9C27B0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#E1E1F5",
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
  },
  variableSelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  selectorButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  selectorButton: {
    width: "48%",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  selectorButtonText: {
    color: "#333",
  },
  activeSelectorButton: {
    backgroundColor: "#9C27B0",
  },
  activeSelectorButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  pickerContainer: {
    marginTop: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  calculateButton: {
    backgroundColor: "#9C27B0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    marginLeft: 8,
  },
  clearButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    marginTop: 25,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  resultBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#9C27B0",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9C27B0",
  },
  formulaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F3E5F5",
    borderRadius: 8,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  formula: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 8,
    color: "#9C27B0",
    fontWeight: "bold",
  },
  formulaWhere: {
    fontSize: 14,
    color: "#555",
  },
});

export default CompoundRateInterestScreen;