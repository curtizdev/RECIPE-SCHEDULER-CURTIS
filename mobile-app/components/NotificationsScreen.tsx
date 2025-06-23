import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Notifications from "expo-notifications";

export function NotificationsScreen() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((n) => {
      setLogs((logs) => [`Received: ${n.request.content.title}`, ...logs]);
    });
    return () => sub.remove();
  }, []);

  return (
    <View className="gap-2">
      {logs.map((log, i) => (
        <Text key={i}>{log}</Text>
      ))}
    </View>
  );
}
