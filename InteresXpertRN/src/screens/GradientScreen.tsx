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
import GradientCalculator, { convertRate } from "../utils/GradientCalculator";

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

const GradientScreen: React.FC = () => {
  const [renta, setRenta] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [crecimiento, setCrecimiento] = useState("");
  const [modo, setModo] = useState<
    "gradienteAritmetico" | "gradienteGeometrico"
  >("gradienteAritmetico");
  const [campoACalcular, setCampoACalcular] = useState<
    "valorFuturo" | "valorPresente"
  >("valorFuturo");
  const [unidadTasa, setUnidadTasa] = useState("anual");
  const [unidadTiempo, setUnidadTiempo] = useState("anual");
  const [resultado, setResultado] = useState<{
    valor: number;
    formula: string;
    pasos: string[];
  } | null>(null);

  const clearForm = () => {
    setRenta("");
    setTasaInteres("");
    setTiempo("");
    setCrecimiento("");
    setModo("gradienteAritmetico");
    setCampoACalcular("valorFuturo");
    setUnidadTasa("anual");
    setUnidadTiempo("anual");
    setResultado(null);
  };

  const handleCalculate = () => {
    try {
      const A = parseFloat(renta);
      const i = parseFloat(tasaInteres) / 100; // Convertir a decimal
      const n = parseFloat(tiempo);
      const G = parseFloat(crecimiento);

      if (isNaN(A) || isNaN(i) || isNaN(n) || isNaN(G)) {
        Alert.alert("Error", "Por favor, ingrese valores numéricos válidos");
        return;
      }

      const result = GradientCalculator({
        renta: A,
        tasaInteres: i,
        tiempo: n,
        crecimiento: G,
        modo,
        campoACalcular,
        unidadTasa,
        unidadTiempo,
      });

      // Preparar los pasos intermedios y la fórmula
      let formula = "";
      let pasos: string[] = [];
      const iEffective = convertRate(i, unidadTasa, unidadTiempo);

      if (modo === "gradienteAritmetico") {
        if (campoACalcular === "valorFuturo") {
          formula = "VF = A × ((1 + i)^n - 1) / i + G × ((1 + i)^n - 1) / i^2";
          const term1 = (A * ((1 + iEffective) ** n - 1)) / iEffective;
          const term2 = (G * ((1 + iEffective) ** n - 1)) / iEffective ** 2;
          pasos = [
            `Sustituyendo: VF = ${A} × ((1 + ${iEffective})^${n} - 1) / ${iEffective} + ${G} × ((1 + ${iEffective})^${n} - 1) / ${iEffective}^2`,
            `VF = ${A} × (${
              (1 + iEffective) ** n
            } - 1) / ${iEffective} + ${G} × (${(1 + iEffective) ** n} - 1) / ${
              iEffective ** 2
            }`,
            `VF = ${A} × ${
              (1 + iEffective) ** n - 1
            } / ${iEffective} + ${G} × ${(1 + iEffective) ** n - 1} / ${
              iEffective ** 2
            }`,
            `VF = ${term1.toFixed(2)} + ${term2.toFixed(2)}`,
            `VF ≈ ${(term1 + term2).toFixed(2)}`,
          ];
        } else {
          formula =
            "VP = A × (1 - (1 + i)^(-n)) / i + G × (1 - (1 + i)^(-n)) / i^2";
          const term1 = (A * (1 - (1 + iEffective) ** -n)) / iEffective;
          const term2 = (G * (1 - (1 + iEffective) ** -n)) / iEffective ** 2;
          pasos = [
            `Sustituyendo: VP = ${A} × (1 - (1 + ${iEffective})^(-${n})) / ${iEffective} + ${G} × (1 - (1 + ${iEffective})^(-${n})) / ${iEffective}^2`,
            `VP = ${A} × (1 - ${
              (1 + iEffective) ** -n
            }) / ${iEffective} + ${G} × (1 - ${(1 + iEffective) ** -n}) / ${
              iEffective ** 2
            }`,
            `VP = ${term1.toFixed(2)} + ${term2.toFixed(2)}`,
            `VP ≈ ${(term1 + term2).toFixed(2)}`,
          ];
        }
      } else {
        const GDecimal = G / 100; // Para gradiente geométrico, G es porcentaje
        if (campoACalcular === "valorFuturo") {
          formula = "VF = A × ((1 + G)^n - 1) / (i - G)";
          const term =
            (A * ((1 + GDecimal) ** n - 1)) / (iEffective - GDecimal);
          pasos = [
            `Sustituyendo: VF = ${A} × ((1 + ${GDecimal})^${n} - 1) / (${iEffective} - ${GDecimal})`,
            `VF = ${A} × (${
              (1 + GDecimal) ** n
            } - 1) / (${iEffective} - ${GDecimal})`,
            `VF = ${A} × ${(1 + GDecimal) ** n - 1} / ${(
              iEffective - GDecimal
            ).toFixed(4)}`,
            `VF ≈ ${term.toFixed(2)}`,
          ];
        } else {
          formula = "VP = A × (1 - (1 + G)^n) / (i - G)";
          const term =
            (A * (1 - (1 + GDecimal) ** n)) / (iEffective - GDecimal);
          pasos = [
            `Sustituyendo: VP = ${A} × (1 - (1 + ${GDecimal})^${n}) / (${iEffective} - ${GDecimal})`,
            `VP = ${A} × (1 - ${
              (1 + GDecimal) ** n
            }) / (${iEffective} - ${GDecimal})`,
            `VP ≈ ${term.toFixed(2)}`,
          ];
        }
      }

      setResultado({ valor: result, formula, pasos });
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Error en el cálculo"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Cálculo de Gradiente</Text>
            <Text style={styles.subtitle}>
              Calcula gradientes aritméticos o geométricos
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Renta (A)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 1500"
                keyboardType="numeric"
                value={renta}
                onChangeText={setRenta}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tasa de Interés (i, %)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 6"
                keyboardType="numeric"
                value={tasaInteres}
                onChangeText={setTasaInteres}
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tiempo (n)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 5"
                keyboardType="numeric"
                value={tiempo}
                onChangeText={setTiempo}
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Crecimiento (G)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 200"
                keyboardType="numeric"
                value={crecimiento}
                onChangeText={setCrecimiento}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Modo</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={modo}
                  style={styles.picker}
                  onValueChange={(value) => setModo(value as any)}
                >
                  <Picker.Item
                    label="Gradiente Aritmético"
                    value="gradienteAritmetico"
                  />
                  <Picker.Item
                    label="Gradiente Geométrico"
                    value="gradienteGeometrico"
                  />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campo a Calcular</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={campoACalcular}
                  style={styles.picker}
                  onValueChange={(value) => setCampoACalcular(value as any)}
                >
                  <Picker.Item label="Valor Futuro" value="valorFuturo" />
                  <Picker.Item label="Valor Presente" value="valorPresente" />
                </Picker>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={handleCalculate}
              >
                <Text style={styles.buttonText}>Calcular</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            {resultado && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Resultado:</Text>
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      {campoACalcular === "valorFuturo"
                        ? "Valor Futuro (VF)"
                        : "Valor Presente (VP)"}
                      :
                    </Text>
                    <Text style={styles.resultValue}>
                      ${resultado.valor.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.formulaContainer}>
                  <Text style={styles.formulaTitle}>Fórmula Aplicada:</Text>
                  <Text style={styles.formula}>{resultado.formula}</Text>
                  {resultado.pasos.map((paso, index) => (
                    <Text key={index} style={styles.formulaWhere}>
                      {paso}
                    </Text>
                  ))}
                  <Text style={styles.formulaWhere}>
                    Donde: A = Renta, i = Tasa de interés (decimal), n = Tiempo,
                    G = Crecimiento
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
    color: "#9C27B0",
    fontWeight: "bold",
  },
  formulaWhere: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
});

export default GradientScreen;