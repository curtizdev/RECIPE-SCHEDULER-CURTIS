import { ScrollView } from "react-native";
import { EventList } from "@/components/EventList";
import ThemeToggle from "@/components/ThemeToggle";

export default function ListScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <ThemeToggle />
      <EventList />
    </ScrollView>
  );
}
