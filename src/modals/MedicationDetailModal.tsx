import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Medication } from "../types/types";

interface Props {
  visible: boolean;
  onClose: () => void;
  medication: Medication;
  updateMedications: () => void;
}

const MedicationDetailModal: React.FC<Props> = ({ visible, onClose, medication, updateMedications }) => {
  const [symptoms, setSymptoms] = useState<string>(medication.symptoms || "");

  useEffect(() => {
    setSymptoms(medication.symptoms || "");
  }, [medication]);

  const handleSave = async () => {
    try {
      const medicationRef = doc(FIRESTORE_DB, "medicines", medication.id);
      await updateDoc(medicationRef, { symptoms });
      Alert.alert("Éxito", "Síntomas guardados correctamente");
      onClose();
      updateMedications();
    } catch (error) {
      console.error("Error al guardar síntomas", error);
      Alert.alert("Error", "Hubo un problema al guardar los síntomas");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>{medication.name}</Text>
          <Text style={styles.detail}>Tipo: {medication.type}</Text>
          <Text style={styles.detail}>Dosis: {medication.dose}</Text>
          <Text style={styles.detail}>Cantidad: {medication.amount}</Text>
          <Text style={styles.detail}>Hora de consumir: {medication.hour}</Text>
          <Text style={styles.detail}>
            Días de la semana:{" "}
            {Object.entries(medication.days)
              .filter(([day, value]) => value)
              .map(([day]) => day)
              .join(", ")}
          </Text>
          <Text style={styles.detail}>
            Día de inicio del tratamiento:{" "}
            {new Date(medication.start_date.seconds * 1000).toDateString()}
          </Text>
          <Text style={styles.detail}>
            Día de fin del tratamiento:{" "}
            {new Date(medication.end_date.seconds * 1000).toDateString()}
          </Text>
          <TextInput
            value={symptoms}
            onChangeText={setSymptoms}
            placeholder="Escribe tus síntomas aquí"
            style={styles.textInput}
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffff",
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#008080",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#888",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MedicationDetailModal;