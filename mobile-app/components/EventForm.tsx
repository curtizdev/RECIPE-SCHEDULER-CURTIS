import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createEvent, updateEvent } from "@/lib/api";

export default function EventForm({
  visible,
  onClose,
  initialData = {},
  mode = "create",
}: {
  visible: boolean;
  onClose: () => void;
  initialData?: { id?: string; title?: string; eventTime?: string | Date };
  mode?: "create" | "edit";
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [eventTime, setEventTime] = useState(
    initialData.eventTime ? new Date(initialData.eventTime) : new Date()
  );

  useEffect(() => {
    if (visible) {
      setTitle(initialData.title || "");
      setEventTime(
        initialData.eventTime ? new Date(initialData.eventTime) : new Date()
      );
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    try {
      if (mode === "edit" && initialData.id) {
        await updateEvent({
          id: initialData.id,
          title,
          eventTime: eventTime.toISOString(),
        });
      } else {
        await createEvent({
          title,
          eventTime: eventTime.toISOString(),
        });
        console.log("Event created successfully");
      }
      onClose();
    } catch (error: any) {
      console.error("Save event error:", error);
      Alert.alert("Error", `Failed to save event: ${error.message || error}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {mode === "edit" ? "Edit Event" : "New Event"}
        </Text>
        <TextInput
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <DateTimePicker
          value={eventTime}
          mode="datetime"
          display="default"
          onChange={(e, date) => date && setEventTime(date)}
          style={styles.datePicker}
        />
        <View style={styles.buttonsRow}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={onClose} color="gray" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
  },
  datePicker: {
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
