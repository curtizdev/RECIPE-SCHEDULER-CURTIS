import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  Pressable,
  View,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getEvents, deleteEvent } from "@/lib/api";
import EventForm from "@/components/EventForm";

type Event = {
  id: string;
  title: string;
  eventTime: string;
};

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create"); // Add mode state
  const router = useRouter();

  const loadEvents = async () => {
    const fetched = await getEvents();
    setEvents(fetched);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteEvent(id);
          await loadEvents(); // Refresh list after delete
        },
      },
    ]);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormMode("edit"); // Set mode to edit
    setModalVisible(true);
  };

  // NEW: Handle create new event
  const handleCreate = () => {
    setEditingEvent(null); // Clear editing event
    setFormMode("create"); // Set mode to create
    setModalVisible(true); // Show modal
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Create Button */}
      <View style={{ padding: 16 }}>
        <Button title="Create New Event" onPress={handleCreate} />
      </View>

      <FlatList
        data={events.sort(
          (a, b) =>
            new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/event/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Text style={styles.eventTitle}>
                {item.title} - {new Date(item.eventTime).toLocaleString()}
              </Text>
            </Pressable>
            <View style={styles.buttonsRow}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />

      {/* Modal Form */}
      <EventForm
        visible={modalVisible}
        initialData={editingEvent ?? {}}
        mode={formMode} // pass mode dynamically
        onClose={() => {
          setModalVisible(false);
          setEditingEvent(null);
          loadEvents(); // Refresh list after edit/create
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "flex-start",
    gap: 8,
  },
});
