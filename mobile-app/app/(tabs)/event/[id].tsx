import { View } from "react-native";
import { EventDetail } from "@/components/EventDetail";

export default function EventDetailScreen() {
  return (
    <View className="flex-1 p-4 bg-background">
      <EventDetail />
    </View>
  );
}
