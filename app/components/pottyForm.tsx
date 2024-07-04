// app/components/PottyForm.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { supabase } from "../../utils/supabase";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

type PottyRule = {
  pottyRule: string;
};

type PottyType = {
  pottyType: string;
};

const PottyForm = () => {
  const [pottyName, setPottyName] = useState("");
  const [pottyAddress, setPottyAddress] = useState("");
  const [pottyRule, setPottyRule] = useState("");
  const [pottyNotes, setPottyNotes] = useState("");
  const [pottyType, setPottyType] = useState("");
  const [pottyRules, setPottyRules] = useState<PottyRule[]>([]);
  const [pottyTypes, setPottyTypes] = useState<PottyType[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: rulesData } = await supabase
        .from("PottyRules")
        .select("pottyRule");
      const { data: typesData } = await supabase
        .from("PottyTypes")
        .select("pottyType");
      setPottyRules(rulesData || []);
      setPottyTypes(typesData || []);
    };

    fetchData();

    const requestLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
      setMapRegion({
        ...mapRegion,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    };

    requestLocation();
  }, []);

  const handleSubmit = async () => {
    if (!location) {
      alert("Location not available");
      return;
    }

    const { data, error } = await supabase.from("PottyList").insert([
      {
        pottyName,
        pottyAddress,
        pottyRule,
        pottyNotes,
        pottyType,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      },
    ]);

    if (error) {
      alert("Error submitting data");
      console.error(error);
    } else {
      alert("Data submitted successfully");
      setPottyName("");
      setPottyAddress("");
      setPottyRule("");
      setPottyNotes("");
      setPottyType("");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Potty Name</Text>
      <TextInput
        style={styles.input}
        value={pottyName}
        onChangeText={setPottyName}
      />

      <Text style={styles.label}>Potty Address</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter Address"
        onPress={(data, details = null) => {
          setPottyAddress(data.description);
          if (details) {
            setLocation({
              coords: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
              timestamp: Date.now(),
            });
            setMapRegion({
              ...mapRegion,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
          }
        }}
        query={{
          key: "YOUR_GOOGLE_PLACES_API_KEY",
          language: "en",
        }}
        styles={{
          textInput: styles.input,
        }}
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

      {location && (
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={pottyName}
            description={pottyNotes}
          />
        </MapView>
      )}
    </ScrollView>
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
  map: {
    width: "100%",
    height: 200,
    marginTop: 20,
  },
});

export default PottyForm;
