// importing important stuff
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// main code
export default function ListItem({ item }) {
  return (
    // creating a list item that gets displayed in the flat list
    <View style={styles.item}>
      <Text style={styles.stationtext}>{item.name}</Text>
      <Text style={styles.countrytext}>{item.country}</Text>
    </View>
  );
}
// CSS for this page
const styles = StyleSheet.create({
  item: {
    backgroundColor: "rgba(34, 34, 34, 100)",
    padding: 20,
    margin: 10,
  },
  stationtext: {
    color: "white",
    margin: 5,
    fontSize: 15,
    fontWeight: "bold",
  },
  countrytext: {
    color: "white",
    margin: 5,
    fontSize: 15,
  },
});
