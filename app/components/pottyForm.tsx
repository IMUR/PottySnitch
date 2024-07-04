// app/components/PottyForm.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { supabase } from "../utils/supabase";

const PottyForm = () => {
  const [pottyName, setPottyName] = useState("");
  const [pottyAddress, setPottyAddress] = useState("");
  const [pottyRule, setPottyRule] = useState("");
  const [pottyNotes, setPottyNotes] = useState("");
  const [pottyType, setPottyType] = useState("");
  const [pottyRules, setPottyRules] = useState([]);
  const [pottyTypes, setPottyTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: rulesData } = await supabase
        .from("PottyRules")
        .select("pottyRule");
      const { data: typesData } = await supabase
        .from("PottyTypes")
        .select("pottyType");
      setPottyRules(rulesData);
      setPottyTypes(typesData);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    // Geocode address and get location (latitude, longitude)
    const location = await geocodeAddress(pottyAddress);
    if (!location) {
      alert("Invalid address");
      return;
    }

    const { data, error } = await supabase.from("PottyList").insert([
      {
        pottyName,
        pottyAddress,
        pottyRule,
        pottyNotes,
        pottyType,
        location,
      },
    ]);

    if (error) {
      alert("Error submitting data");
      console.error(error);
    } else {
      alert("Data submitted successfully");
      // Clear form
      setPottyName("");
      setPottyAddress("");
      setPottyRule("");
      setPottyNotes("");
      setPottyType("");
    }
  };

  const geocodeAddress = async (address) => {
    // Use a geocoding API to get the location coordinates for the given address
    // This function should return an object with latitude and longitude
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Potty Name</Text>
      <TextInput
        style={styles.input}
        value={pottyName}
        onChangeText={setPottyName}
      />

      <Text style={styles.label}>Potty Address</Text>
      <TextInput
        style={styles.input}
        value={pottyAddress}
        onChangeText={setPottyAddress}
      />

      <Text style={styles.label}>Potty Rule</Text>
      <TextInput
        style={styles.input}
        value={pottyRule}
        onChangeText={setPottyRule}
      />

      <Text style={styles.label}>Potty Notes</Text>
      <TextInput
        style={styles.input}
        value={pottyNotes}
        onChangeText={setPottyNotes}
      />

      <Text style={styles.label}>Potty Type</Text>
      <TextInput
        style={styles.input}
        value={pottyType}
        onChangeText={setPottyType}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

export default PottyForm;
