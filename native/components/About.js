// Importing important stuffs
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// main code
export default function About({ navigation }) {
  // function to open drawer navigator
  const openMenu = () => {
    navigation.openDrawer();
  };

  return (
    // About page
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* icon to open drawer */}
        <Ionicons
          name="ios-menu"
          size={28}
          onPress={openMenu}
          style={styles.icon}
        />
        {/* ------------ */}
        {/* Header title */}
        <View style={styles.headerTitle}>
          <Image
            source={require("../assets/INVBWicon.png")}
            style={styles.headerImage}
          />
          <Text style={styles.headerText}>RadioGlobal</Text>
        </View>
        {/* ------------ */}
      </View>
      {/* --------header end-------- */}
      {/*  information about the devs */}
      <Text style={styles.captiontext}>Developers of RadioGlobal</Text>
      <Text style={styles.text}>Ansuman Dhar - Web</Text>
      <Text style={styles.text}>Satwik "GLAPPY" Verma - Android and iOS</Text>
      <Text style={styles.captiontext}>
        For our socials/portfolios , tap on one of those
      </Text>
      {/* ------------info end------------- */}
      {/* links to dev's socials */}
      <View style={styles.hyperlinks}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://ansuman-dhar.github.io");
          }}
        >
          <Image
            style={styles.image}
            source={require("../assets/ansuman.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://projectsofglappy.tk");
          }}
        >
          <Image
            style={styles.image}
            source={require("../assets/GLAPPY.png")}
          />
        </TouchableOpacity>
        {/* --------------links end----------------- */}
      </View>
      <Text style={styles.captiontext}>
        Checkout the web version of RadioGlobal
      </Text>
      {/* Link to RadioGlobal website */}
      <View style={styles.webver}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://radioglobal.ga");
          }}
        >
          <Image
            style={styles.image}
            source={require("../assets/INVBWicon.png")}
          />
        </TouchableOpacity>
        {/* -------------------------- */}
      </View>
      <Text style={styles.version}>v1.2.0</Text>
    </View>
  );
}
// CSS for this page
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    height: "100%",
    alignContent: "center",
  },
  captiontext: {
    color: "white",
    paddingTop: 30,
    paddingLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    paddingTop: 30,
    paddingLeft: 20,
    fontSize: 16,
  },
  hyperlinks: {
    paddingTop: 70,
    flexDirection: "row",
    paddingHorizontal: 60,
    justifyContent: "space-between",
  },
  webver: {
    paddingTop: 20,
    flexDirection: "row",
    paddingHorizontal: 60,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  header: {
    width: "100%",
    height: 50,
    paddingTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    letterSpacing: 1,
  },
  icon: {
    position: "absolute",
    left: 0,
    color: "white",
    paddingLeft: 10,
    paddingTop: 25,
  },
  headerImage: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  headerTitle: {
    flexDirection: "row",
  },
  version: {
    color: "rgba(150,150,150,150)",
    alignSelf: "flex-end",
    marginTop: 30,
    paddingRight: 10,
  },
});
