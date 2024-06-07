import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import MedicationDetailModal from "../modals/MedicationDetailModal";
import { Medication } from "../types/types";

interface Props {
  medications: Medication[];
  onDelete: (id: string) => void;
  updateMedications: () => void;
}

const MedicationInfo: React.FC<Props> = ({ medications, onDelete, updateMedications }) => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const handleDelete = (medicationId: string) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => onDelete(medicationId) }
      ]
    );
  };

  const sortedMedications = medications.sort((a, b) => a.hour.localeCompare(b.hour));

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Haz clic en un medicamento para obtener más información</Text>
      {sortedMedications.map((med, index) => (
        <TouchableOpacity key={med.id} onPress={() => setSelectedMedication(med)}>
          <View style={[styles.medicationItem, index > 0 && styles.medicationItemMargin]}>
            <View style={styles.medicationDetailsContainer}>
              <Text style={styles.medicationName}>{med.name}</Text>
              <View style={styles.hourContainer}>
                <Text style={styles.hour}>{med.hour}</Text>
                <TouchableOpacity onPress={() => handleDelete(med.id)}>
                  <Image source={require("../../assets/delete_icon.png")} style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      {selectedMedication && (
        <MedicationDetailModal
          visible={!!selectedMedication}
          onClose={() => setSelectedMedication(null)}
          medication={selectedMedication}
          updateMedications={updateMedications}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  profileText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    marginBottom: 10,
    color: "#888",
  },
  medicationItem: {
    marginBottom: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  medicationItemMargin: {
    marginTop: 10,
  },
  medicationDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  medicationName: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
  medicationDetails: {
    color: "#888",
    fontSize: 15,
  },
  hourContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hour: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
});

export default MedicationInfo;