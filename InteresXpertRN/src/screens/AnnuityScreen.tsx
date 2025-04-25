import React, { useState } from "react";
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
  calcularAnualidad,
  AnnuityParams,
  AnnuityResult,
} from "../utils/AnnuityCalculator";

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

const AnnuityScreen: React.FC = () => {
  const [variableACalcular, setVariableACalcular] = useState<
    "valorFuturo" | "valorActual" | "tasa" | "tiempo"
  >("valorFuturo");
  const [valorFuturo, setValorFuturo] = useState("");
  const [valorActual, setValorActual] = useState("");
  const [renta, setRenta] = useState("");
  const [tasa, setTasa] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [unitTasa, setUnitTasa] = useState<Unidad>("anual");
  const [unitTiempo, setUnitTiempo] = useState<Unidad>("anual");
  const [desiredUnitTasa, setDesiredUnitTasa] = useState<Unidad>("anual");
  const [desiredUnitTiempo, setDesiredUnitTiempo] = useState<Unidad>("anual");
  const [result, setResult] = useState<AnnuityResult | null>(null);

  const clearForm = () => {
    setValorFuturo("");
    setValorActual("");
    setRenta("");
    setTasa("");
    setTiempo("");
    setUnitTasa("anual");
    setUnitTiempo("anual");
    setDesiredUnitTasa("anual");
    setDesiredUnitTiempo("anual");
    setResult(null);
  };

  const calculateAnnuity = () => {
    try {
      const params: Partial<AnnuityParams> = {
        unidadTasa: unitTasa,
        unidadTiempo: unitTiempo,
        unidadDeseadaTasa:
          variableACalcular === "tasa" ? desiredUnitTasa : undefined,
        unidadDeseadaTiempo:
          variableACalcular === "tiempo" ? desiredUnitTiempo : undefined,
      };

      switch (variableACalcular) {
        case "valorFuturo":
          if (!renta || !tasa || !tiempo) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.renta = parseFloat(renta);
          params.tasa = parseFloat(tasa);
          params.tiempo = parseFloat(tiempo);
          break;

        case "valorActual":
          if (!renta || !tasa || !tiempo) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.renta = parseFloat(renta);
          params.tasa = parseFloat(tasa);
          params.tiempo = parseFloat(tiempo);
          break;

        case "tasa":
          if (!valorFuturo || !valorActual || !tiempo) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.valorFuturo = parseFloat(valorFuturo);
          params.valorActual = parseFloat(valorActual);
          params.tiempo = parseFloat(tiempo);
          break;

        case "tiempo":
          if (!valorFuturo || !valorActual || !tasa) {
            Alert.alert(
              "Error",
              "Por favor completa todos los campos necesarios"
            );
            return;
          }
          params.valorFuturo = parseFloat(valorFuturo);
          params.valorActual = parseFloat(valorActual);
          params.tasa = parseFloat(tasa);
          break;
      }

      // Validar que los valores sean mayores que cero
      const valores = [
        params.valorFuturo,
        params.valorActual,
        params.renta,
        params.tasa,
        params.tiempo,
      ].filter((v) => v !== undefined);
      if (valores.some((v) => v! <= 0)) {
        Alert.alert("Error", "Todos los valores deben ser mayores que cero");
        return;
      }

      // Validar que VF > VA cuando se calcula tasa o tiempo
      if (
        (variableACalcular === "tasa" || variableACalcular === "tiempo") &&
        params.valorFuturo! <= params.valorActual!
      ) {
        Alert.alert(
          "Error",
          "El Valor Futuro debe ser mayor que el Valor Actual"
        );
        return;
      }

      const resultado = calcularAnualidad(
        params as AnnuityParams,
        variableACalcular
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
        {(variableACalcular === "tasa" || variableACalcular === "tiempo") && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor Futuro (VF)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 15000"
                keyboardType="numeric"
                value={valorFuturo}
                onChangeText={setValorFuturo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor Actual (VA)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 10000"
                keyboardType="numeric"
                value={valorActual}
                onChangeText={setValorActual}
              />
            </View>
          </>
        )}

        {(variableACalcular === "valorFuturo" ||
          variableACalcular === "valorActual") && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Renta (A)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 500"
              keyboardType="numeric"
              value={renta}
              onChangeText={setRenta}
            />
          </View>
        )}

        {(variableACalcular === "valorFuturo" ||
          variableACalcular === "valorActual" ||
          variableACalcular === "tiempo") && (
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

        {(variableACalcular === "valorFuturo" ||
          variableACalcular === "valorActual" ||
          variableACalcular === "tasa") && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiempo (n)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 12"
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
            <Text style={styles.title}>Calculadora de Anualidades</Text>
            <Text style={styles.subtitle}>
              Calcula anualidades ordinarias simples
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.variableSelector}>
              <Text style={styles.selectorLabel}>¿Qué deseas calcular?</Text>
              <View style={styles.selectorButtonsContainer}>
                {["valorFuturo", "valorActual", "tasa", "tiempo"].map(
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
                            | "valorActual"
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
                          ? "Valor Futuro"
                          : variable === "valorActual"
                          ? "Valor Actual"
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
                onPress={calculateAnnuity}
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
                        ? "Valor Futuro"
                        : result.tipo === "valorActual"
                        ? "Valor Actual"
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
                      ? "VF = A × [(1 + i)^n - 1] / i"
                      : result.tipo === "valorActual"
                      ? "VA = A × [1 - (1 + i)^(-n)] / i"
                      : result.tipo === "tasa"
                      ? "i = (VF / VA)^(1/n) - 1"
                      : "n = ln(VF / VA) / ln(1 + i)"}
                  </Text>
                  <Text style={styles.formulaWhere}>
                    Donde: VF = Valor Futuro, VA = Valor Actual, A = Renta, i =
                    Tasa de interés (decimal), n = Tiempo
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
    backgroundColor: "#3F51B5",
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
  modoSelector: {
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
    backgroundColor: "#3F51B5",
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
    marginBottom: 20,
  },
  calculateButton: {
    backgroundColor: "#3F51B5",
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
    marginTop: 10,
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
    borderColor: "#3F51B5",
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
    color: "#3F51B5",
  },
  formulaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#E8EAF6",
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
    color: "#3F51B5",
    fontWeight: "bold",
  },
  formulaWhere: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default AnnuityScreen;
