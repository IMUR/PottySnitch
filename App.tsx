// App.tsx
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import PottyForm from "./app/components/pottyForm";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <PottyForm />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
