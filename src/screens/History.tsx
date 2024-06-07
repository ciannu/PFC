import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRoute } from "@react-navigation/native";
import { retrieveMedicationsForDay } from "../utils/medications";
import MedicationInfo from "../components/MedicationInfo";
import MedicationDetailModal from "../modals/MedicationDetailModal";
import { Medication } from "../types/types";

const History = () => {
  const route = useRoute();
  const { profileName }: { profileName?: string } = route.params || {};
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const handleDayPress = async (day: { dateString: string }) => {
    try {
      setSelectedDate(day.dateString);
      const meds = await retrieveMedicationsForDay(new Date(day.dateString), profileName || "");
      setMedications(meds);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las medicinas para este día. Inténtalo de nuevo más tarde.");
      console.error("Error al cargar medicinas:", error);
    }
  };

  const updateMedications = async () => {
    try {
      const meds = await retrieveMedicationsForDay(new Date(selectedDate), profileName || "");
      setMedications(meds);
    } catch (error) {
      console.error("Error al actualizar los medicamentos:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{ [selectedDate]: { selected: true } }}
        theme={{ calendarBackground: "#c0d9d9" }}
        style={styles.calendar}
      />
      <View style={styles.medicationContainer}>
        <MedicationInfo medications={medications} onDelete={(id: string) => { }} updateMedications={updateMedications} />
      </View>
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
    flex: 1,
    backgroundColor: "#e0ffff",
  },
  medicationContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  calendar: {
    marginTop: 20,
  },
});

export default History;