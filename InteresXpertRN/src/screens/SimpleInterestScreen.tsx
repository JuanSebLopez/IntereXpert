import React, { useState } from 'react';
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
import { Picker } from "@react-native-picker/picker";
import {
  calcularInteresSimple,
  formatearResultado,
  InteresSimpleParams,
  ResultadoInteres,
} from "../utils/InteresSimpleCalculator";

// Opciones para los selectores de unidades de tiempo
const UNIDADES_TIEMPO = [
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

const SimpleInterestScreen: React.FC = () => {
  // Variables para el modo avanzado
  const [variableACalcular, setVariableACalcular] = useState<
    "interes" | "capital" | "tasa" | "tiempo"
  >("interes");
  const [interes, setInteres] = useState("");
  const [capitalAvanzado, setCapitalAvanzado] = useState("");
  const [tasaAvanzada, setTasaAvanzada] = useState("");
  const [tiempoAvanzado, setTiempoAvanzado] = useState("");
  const [unidadTasa, setUnidadTasa] = useState("anual");
  const [unidadTiempo, setUnidadTiempo] = useState("anual");
  const [unidadDeseadaTasa, setUnidadDeseadaTasa] = useState("anual");
  const [unidadDeseadaTiempo, setUnidadDeseadaTiempo] = useState("anual");
  const [resultadoAvanzado, setResultadoAvanzado] =
    useState<ResultadoInteres | null>(null);

  // Limpieza del formulario avanzado
  const clearFormAvanzado = () => {
    setInteres("");
    setCapitalAvanzado("");
    setTasaAvanzada("");
    setTiempoAvanzado("");
    setUnidadTasa("anual");
    setUnidadTiempo("anual");
    setUnidadDeseadaTasa("anual");
    setUnidadDeseadaTiempo("anual");
    setResultadoAvanzado(null);
  };

  // Cálculo avanzado de interés simple
  const calcularAvanzado = () => {
    try {
      const params: Partial<InteresSimpleParams> = {
        unidadTasa,
        unidadTiempo,
        unidadDeseadaTasa:
          variableACalcular === "tasa" ? unidadDeseadaTasa : undefined,
        unidadDeseadaTiempo:
          variableACalcular === "tiempo" ? unidadDeseadaTiempo : undefined,
      };

      // Preparamos los parámetros según la variable a calcular
      switch (variableACalcular) {
        case "interes":
          if (!capitalAvanzado || !tasaAvanzada || !tiempoAvanzado) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.capital = parseFloat(capitalAvanzado);
          params.tasa = parseFloat(tasaAvanzada);
          params.tiempo = parseFloat(tiempoAvanzado);
          break;

        case "capital":
          if (!interes || !tasaAvanzada || !tiempoAvanzado) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.interes = parseFloat(interes);
          params.tasa = parseFloat(tasaAvanzada);
          params.tiempo = parseFloat(tiempoAvanzado);
          break;

        case "tasa":
          if (!interes || !capitalAvanzado || !tiempoAvanzado) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.interes = parseFloat(interes);
          params.capital = parseFloat(capitalAvanzado);
          params.tiempo = parseFloat(tiempoAvanzado);
          break;

        case "tiempo":
          if (!interes || !capitalAvanzado || !tasaAvanzada) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.interes = parseFloat(interes);
          params.capital = parseFloat(capitalAvanzado);
          params.tasa = parseFloat(tasaAvanzada);
          break;
      }

      // Realizamos el cálculo
      const resultado = calcularInteresSimple(params as InteresSimpleParams);
      setResultadoAvanzado(resultado);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error en el cálculo"
      );
    }
  };

  // Renderiza los campos según la variable a calcular
  const renderizarCamposAvanzados = () => {
    return (
      <>
        {variableACalcular !== "interes" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interés</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 200"
              keyboardType="numeric"
              value={interes}
              onChangeText={setInteres}
            />
          </View>
        )}

        {variableACalcular !== "capital" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Capital Inicial</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 1000"
              keyboardType="numeric"
              value={capitalAvanzado}
              onChangeText={setCapitalAvanzado}
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
              value={tasaAvanzada}
              onChangeText={setTasaAvanzada}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Unidad de Tasa:</Text>
              <Picker
                selectedValue={unidadTasa}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setUnidadTasa(itemValue as string)
                }
              >
                {UNIDADES_TIEMPO.map((unidad) => (
                  <Picker.Item key={unidad} label={unidad} value={unidad} />
                ))}
              </Picker>
            </View>

            {variableACalcular === "tiempo" && (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Unidad Deseada de Tasa:</Text>
                <Picker
                  selectedValue={unidadDeseadaTasa}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setUnidadDeseadaTasa(itemValue as string)
                  }
                >
                  {UNIDADES_TIEMPO.map((unidad) => (
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
              value={tiempoAvanzado}
              onChangeText={setTiempoAvanzado}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Unidad de Tiempo:</Text>
              <Picker
                selectedValue={unidadTiempo}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setUnidadTiempo(itemValue as string)
                }
              >
                {UNIDADES_TIEMPO.map((unidad) => (
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
                  selectedValue={unidadDeseadaTiempo}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setUnidadDeseadaTiempo(itemValue as string)
                  }
                >
                  {UNIDADES_TIEMPO.map((unidad) => (
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
            <Text style={styles.title}>Calculadora de Interés Simple</Text>
            <Text style={styles.subtitle}>
              Calcula el interés para un capital fijo
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.variableSelector}>
              <Text style={styles.selectorLabel}>¿Qué deseas calcular?</Text>
              <View style={styles.selectorButtonsContainer}>
                {["interes", "capital", "tasa", "tiempo"].map((variable) => (
                  <TouchableOpacity
                    key={variable}
                    style={[
                      styles.selectorButton,
                      variableACalcular === variable &&
                        styles.activeSelectorButton,
                    ]}
                    onPress={() => {
                      setVariableACalcular(
                        variable as "interes" | "capital" | "tasa" | "tiempo"
                      );
                      clearFormAvanzado();
                    }}
                  >
                    <Text
                      style={[
                        styles.selectorButtonText,
                        variableACalcular === variable &&
                          styles.activeSelectorButtonText,
                      ]}
                    >
                      {variable.charAt(0).toUpperCase() + variable.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {renderizarCamposAvanzados()}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={calcularAvanzado}
              >
                <Text style={styles.buttonText}>Calcular</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFormAvanzado}
              >
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            {resultadoAvanzado && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Resultado:</Text>
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      {resultadoAvanzado.tipo.charAt(0).toUpperCase() +
                        resultadoAvanzado.tipo.slice(1)}
                      :
                    </Text>
                    <Text style={styles.resultValue}>
                      {resultadoAvanzado.tipo === "tasa"
                        ? `${resultadoAvanzado.valor.toFixed(2)}%`
                        : resultadoAvanzado.tipo === "tiempo"
                        ? `${resultadoAvanzado.valor.toFixed(2)}`
                        : `$${resultadoAvanzado.valor.toFixed(2)}`}
                      {resultadoAvanzado.unidad
                        ? ` ${resultadoAvanzado.unidad}`
                        : ""}
                    </Text>
                  </View>
                </View>

                <View style={styles.formulaContainer}>
                  <Text style={styles.formulaTitle}>Fórmula Aplicada:</Text>
                  <Text style={styles.formula}>
                    {resultadoAvanzado.tipo === "interes"
                      ? "I = C × i × t"
                      : resultadoAvanzado.tipo === "capital"
                      ? "C = I / (i × t)"
                      : resultadoAvanzado.tipo === "tasa"
                      ? "i = I / (C × t)"
                      : "t = I / (C × i)"}
                  </Text>
                  <Text style={styles.formulaWhere}>
                    Donde: I = Interés, C = Capital, i = Tasa de interés
                    (decimal), t = Tiempo
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
    backgroundColor: "#4527A0",
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
    backgroundColor: "#4527A0",
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
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  calculateButton: {
    backgroundColor: "#4527A0",
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
    borderColor: "#4527A0",
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
    color: "#4527A0",
  },
  formulaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#E1E1F5",
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
    color: "#4527A0",
    fontWeight: "bold",
  },
  formulaWhere: {
    fontSize: 14,
    color: "#555",
  },
});

export default SimpleInterestScreen;