import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../utils/supabase";
import GeocoderAutocomplete, {
  GeocoderAutocompleteFeature,
} from "@geoapify/geocoder-autocomplete";

interface Suggestion {
  properties: {
    formatted: string;
    place_id: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

const PottyForm = () => {
  const [pottyName, setPottyName] = useState("");
  const [pottyAddress, setPottyAddress] = useState("");
  const [pottyRule, setPottyRule] = useState("");
  const [pottyNotes, setPottyNotes] = useState("");
  const [pottyType, setPottyType] = useState("");
  const [pottyRules, setPottyRules] = useState<{ pottyRule: string }[]>([]);
  const [pottyTypes, setPottyTypes] = useState<{ pottyType: string }[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>(
    []
  );
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      const { data: rules } = await supabase
        .from("PottyRules")
        .select("pottyRule");
      const { data: types } = await supabase
        .from("PottyTypes")
        .select("pottyType");
      setPottyRules(rules || []);
      setPottyTypes(types || []);
    };

    fetchDropdownData();
  }, []);

  const handleAddressChange = async (text: string) => {
    setPottyAddress(text);
    if (text.length > 3) {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${process.env.GEOAPIFY_AUTOCOMPLETE_API_KEY}`
      ).then((res) => res.json());
      setAddressSuggestions(response.features);
    }
  };

  const handleAddressSelect = (address: string, location: [number, number]) => {
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
