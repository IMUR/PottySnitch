// app/components/pottyForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../utils/supabase";
import GeocoderAutocomplete from "@geoapify/geocoder-autocomplete";

const PottyForm = () => {
  const [pottyName, setPottyName] = useState("");
  const [pottyAddress, setPottyAddress] = useState("");
  const [pottyRule, setPottyRule] = useState("");
  const [pottyNotes, setPottyNotes] = useState("");
  const [pottyType, setPottyType] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleAddressChange = async (text) => {
    setPottyAddress(text);
    if (text.length > 3) {
      const response = await GeocoderAutocomplete({
        apiKey: process.env.GEOAPIFY_AUTOCOMPLETE_API_KEY,
        text: text,
        limit: 5,
      });
      setAddressSuggestions(response.features);
    }
  };

  const handleAddressSelect = (address, location) => {
    setPottyAddress(address);
    setSelectedLocation(location);
    setAddressSuggestions([]);
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("PottyList").insert([
      {
        pottyName,
        pottyAddress,
        pottyRule,
        pottyNotes,
        pottyType,
        location: selectedLocation,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted:", data);
      // Clear form
      setPottyName("");
      setPottyAddress("");
      setPottyRule("");
      setPottyNotes("");
      setPottyType("");
      setSelectedLocation(null);
    }
  };

  return (
    <View>
      <Text>Potty Name</Text>
      <TextInput value={pottyName} onChangeText={setPottyName} />

      <Text>Potty Address</Text>
      <TextInput value={pottyAddress} onChangeText={handleAddressChange} />
      <FlatList
        data={addressSuggestions}
        keyExtractor={(item) => item.properties.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              handleAddressSelect(
                item.properties.formatted,
                item.geometry.coordinates
              )
            }
          >
            <Text>{item.properties.formatted}</Text>
          </TouchableOpacity>
        )}
      />

      <Text>Potty Rule</Text>
      <Picker
        selectedValue={pottyRule}
        onValueChange={(itemValue) => setPottyRule(itemValue)}
      >
        {pottyRules.map((rule, index) => (
          <Picker.Item
            key={index}
            label={rule.pottyRule}
            value={rule.pottyRule}
          />
        ))}
      </Picker>

      <Text>Potty Notes</Text>
      <TextInput value={pottyNotes} onChangeText={setPottyNotes} />

      <Text>Potty Type</Text>
      <Picker
        selectedValue={pottyType}
        onValueChange={(itemValue) => setPottyType(itemValue)}
      >
        {pottyTypes.map((type, index) => (
          <Picker.Item
            key={index}
            label={type.pottyType}
            value={type.pottyType}
          />
        ))}
      </Picker>

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default PottyForm;
