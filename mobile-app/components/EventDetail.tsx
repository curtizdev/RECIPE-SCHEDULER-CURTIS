import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getEvent, updateEvent, deleteEvent } from "@/lib/api";

type Event = {
  id: string;
  title: string;
  eventTime: string;
  // add other event properties if needed
};

export function EventDetail() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof id === "string") getEvent(id).then(setEvent);
  }, [id]);

  if (!event) return null;

  return (
    <View style={styles.container}>
      <TextInput
        value={event.title}
        onChangeText={(t) => setEvent({ ...event, title: t })}
        style={styles.input}
      />
      <Button title="Save" onPress={() => updateEvent(event)} />
      <Button
        title="Delete"
        onPress={() => {
          deleteEvent(event.id);
          router.push("/");
        }}
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16, // gap equivalent; works on RN 0.71+ or you can use marginBottom on children
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
});
