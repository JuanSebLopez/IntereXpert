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
import AmortizationCalculator, {
  convertRate,
} from "../utils/AmortizationCalculator";

// Opciones para los selectores de unidades de tiempo
const UNIDADES_TIEMPO = ["anual", "mensual", "semanal", "diario"];

const AmortizationScreen: React.FC = () => {
  const [capital, setCapital] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [numPagos, setNumPagos] = useState("");
  const [metodo, setMetodo] = useState<"frances" | "aleman" | "americano">(
    "frances"
  );
  const [unidadTasa, setUnidadTasa] = useState("anual");
  const [unidadTiempo, setUnidadTiempo] = useState("anual");
  const [resultado, setResultado] = useState<{
    cuota: number;
    tabla: {
      periodo: number;
      cuota: number;
      interes: number;
      capitalAmortizado: number;
      saldo: number;
    }[];
    pasos: string[];
  } | null>(null);

  const clearForm = () => {
    setCapital("");
    setTasaInteres("");
    setNumPagos("");
    setMetodo("frances");
    setUnidadTasa("anual");
    setUnidadTiempo("anual");
    setResultado(null);
  };

  const handleCalculate = () => {
    try {
      const P = parseFloat(capital);
      const i = metodo !== "aleman" ? parseFloat(tasaInteres) / 100 : 0; // Convertir a decimal
      const n = metodo !== "americano" ? parseFloat(numPagos) : 1;

      if (isNaN(P)) {
        Alert.alert(
          "Error",
          "Por favor, ingrese un valor numérico válido para el capital"
        );
        return;
      }

      if (metodo !== "aleman" && isNaN(i)) {
        Alert.alert(
          "Error",
          "Por favor, ingrese un valor numérico válido para la tasa de interés"
        );
        return;
      }

      if (
        metodo !== "americano" &&
        (isNaN(n) || n <= 0 || !Number.isInteger(n))
      ) {
        Alert.alert("Error", "El número de pagos debe ser un entero positivo");
        return;
      }

      const result = AmortizationCalculator({
        capital: P,
        tasaInteres: i,
        numPagos: n,
        metodo,
        unidadTasa,
        unidadTiempo,
      });

      // Preparar los pasos intermedios y la fórmula
      let pasos: string[] = [];
      const iEffective =
        metodo !== "aleman" ? convertRate(i, unidadTasa, unidadTiempo) : 0;

      if (metodo === "frances") {
        const cuota =
          (P * iEffective * Math.pow(1 + iEffective, n)) /
          (Math.pow(1 + iEffective, n) - 1);
        pasos = [
          `Fórmula: A = P × (i × (1 + i)^n) / ((1 + i)^n - 1)`,
          `Sustituyendo: A = ${P} × (${iEffective} × (1 + ${iEffective})^${n}) / ((1 + ${iEffective})^${n} - 1)`,
          `A = ${P} × (${iEffective} × ${Math.pow(1 + iEffective, n).toFixed(
            4
          )}) / (${Math.pow(1 + iEffective, n).toFixed(4)} - 1)`,
          `A = ${cuota.toFixed(2)}`,
        ];
      } else if (metodo === "aleman") {
        const amortizacionFija = P / n;
        pasos = [
          `Fórmula: Amortización fija = P / n`,
          `Sustituyendo: Amortización fija = ${P} / ${n}`,
          `Amortización fija = ${amortizacionFija.toFixed(2)}`,
          `Los intereses se calculan sobre el saldo pendiente en cada período`,
        ];
      } else {
        const interesPeriodico = P * iEffective;
        pasos = [
          `Fórmula: Intereses = P × i`,
          `Sustituyendo: Intereses = ${P} × ${iEffective}`,
          `Intereses por período = ${interesPeriodico.toFixed(2)}`,
          `Capital se paga al final: ${P}`,
        ];
      }

      setResultado({ ...result, pasos });
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Error en el cálculo"
      );
    }
  };

  const renderInputFields = () => {
    return (
      <>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Capital (P)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 10000"
            keyboardType="numeric"
            value={capital}
            onChangeText={setCapital}
          />
        </View>

        {metodo !== "aleman" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tasa de Interés (i, %)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 5"
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
        )}

        {metodo !== "americano" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Pagos (n)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 12"
              keyboardType="numeric"
              value={numPagos}
              onChangeText={setNumPagos}
            />
            {metodo === "frances" && (
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
            <Text style={styles.title}>Cálculo de Amortización</Text>
            <Text style={styles.subtitle}>
              Calcula sistemas de amortización
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Método de Amortización</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={metodo}
                  style={styles.picker}
                  onValueChange={(value) => setMetodo(value as any)}
                >
                  <Picker.Item label="Francés (Cuotas Fijas)" value="frances" />
                  <Picker.Item
                    label="Alemán (Cuotas Decrecientes)"
                    value="aleman"
                  />
                  <Picker.Item
                    label="Americano (Solo Intereses)"
                    value="americano"
                  />
                </Picker>
              </View>
            </View>

            {renderInputFields()}

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
                  <Text style={styles.resultText}>
                    {metodo === "americano"
                      ? "Interés Periódico:"
                      : "Cuota Promedio:"}
                  </Text>
                  <Text style={styles.resultValue}>
                    ${resultado.cuota.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.tableContainer}>
                  <Text style={styles.tableTitle}>Tabla de Amortización:</Text>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Período</Text>
                    <Text style={styles.tableHeaderText}>Cuota</Text>
                    <Text style={styles.tableHeaderText}>Interés</Text>
                    <Text style={styles.tableHeaderText}>Capital</Text>
                    <Text style={styles.tableHeaderText}>Saldo</Text>
                  </View>
                  {resultado.tabla.map((row) => (
                    <View key={row.periodo} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{row.periodo}</Text>
                      <Text style={styles.tableCell}>
                        ${row.cuota.toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        ${row.interes.toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        ${row.capitalAmortizado.toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        ${row.saldo.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.stepsContainer}>
                  <Text style={styles.stepsTitle}>Pasos del Cálculo:</Text>
                  {resultado.pasos.map((paso, index) => (
                    <Text key={index} style={styles.stepText}>
                      {paso}
                    </Text>
                  ))}
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
    flexDirection: "row",
    justifyContent: "space-between",
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
  tableContainer: {
    marginTop: 20,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E1E1F5",
    padding: 10,
    borderRadius: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  stepsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#E1E1F5",
    borderRadius: 8,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  stepText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
});

export default AmortizationScreen;
