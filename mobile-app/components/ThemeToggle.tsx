import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, useColorScheme } from "react-native";

export default function ThemeToggle() {
  // Detect system theme (light or dark)
  const systemColorScheme = useColorScheme();

  // State to hold current theme mode: "light" or "dark"
  const [theme, setTheme] = useState<"light" | "dark">(
    systemColorScheme || "light"
  );

  // Update theme if system changes (optional)
  useEffect(() => {
    setTheme(systemColorScheme || "light");
  }, [systemColorScheme]);

  // Toggle theme manually
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Styles change based on current theme
  const isDark = theme === "dark";

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>
        Current theme: {theme}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? "#fff" : "#000"}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  lightBg: {
    backgroundColor: "#f2f2f2",
  },
  darkBg: {
    backgroundColor: "#333",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  lightText: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
});
