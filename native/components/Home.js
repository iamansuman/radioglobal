// importing important stuffs
import React, { useRef, useState, useEffect, Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Audio } from "expo-av";
import ListItem from "./ListItem";
import { Ionicons } from "@expo/vector-icons";

// main code

export default function Home({ navigation }) {
  const [startup, setStartup] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!startup) {
      animatedHeader();
    }
  });
  const animatedHeader = () => {
    setStartup(true);
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };
  // State which contains the object for the station currently being played
  const [currentPlaying, setCurrentPlaying] = useState({
    name: "",
  });
  // state to store the list of stations
  const [stations, setStations] = useState();
  // fetching the stations list from database
  fetch("https://radioglobal.ga/crs-pf/stations.json")
    .then((res) => res.json())
    .then((result) => {
      setStations(result);
    });
  // creating a sound player
  const soundObject = useRef(new Audio.Sound());
  // state to check if the player is paused
  const [pauseState, setPauseState] = useState(true);
  // function to find index of a station in the stations list
  const findIndexOf = (item) => {
    var index = 0;
    var result = 99;
    stations.forEach((element) => {
      if (element.url == item.url) {
        result = index;
      }
      index++;
    });
    return result;
  };
  // function to open drawer navigator
  const openMenu = () => {
    navigation.openDrawer();
  };

  // function to play/pause audio
  const playAudio = async (item) => {
    if (pauseState) {
      await soundObject.current.unloadAsync();
    } else {
      await soundObject.current.pauseAsync();
      await soundObject.current.unloadAsync();
    }
    setCurrentPlaying(item);

    try {
      await soundObject.current.loadAsync({
        uri: item.url,
      });
      await soundObject.current.playAsync();
      setPauseState(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // Home page
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* icon to open drawer navigator */}
        <Ionicons
          name="ios-menu"
          size={28}
          onPress={openMenu}
          style={styles.icon}
        />
        {/* -------------------- */}
        {/* title of the header */}
        <Animated.View
          style={[
            styles.headerTitle,
            {
              opacity: headerOpacity,
            },
          ]}
        >
          <Image
            source={require("../assets/BWicon.png")}
            style={styles.headerImage}
          />
          <Text style={styles.headerText}>RadioGlobal</Text>
        </Animated.View>
        {/* ------------------------ */}
      </View>
      {/* --------------------- */}
      {/* displaying the available stations  */}
      <FlatList
        style={styles.list}
        data={stations}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              playAudio(item);
            }}
          >
            <ListItem item={item} />
          </TouchableOpacity>
        )}
      />
      {/* audio controls */}
      <View style={styles.player}>
        <View style={styles.titleBox}>
          <Text style={styles.text}>{currentPlaying.name}</Text>
        </View>

        <View style={styles.controls}>
          {/* Previous Button */}
          <TouchableOpacity
            onPress={async () => {
              playAudio(
                findIndexOf(currentPlaying) > 0
                  ? stations[findIndexOf(currentPlaying) - 1]
                  : stations[stations.length - 1]
              );
            }}
          >
            <Ionicons
              name={"play-skip-back-circle-outline"}
              color="white"
              size={65}
            />
          </TouchableOpacity>
          {/* play/pause button */}
          <TouchableOpacity
            onPress={async () => {
              if (pauseState) {
                playAudio(currentPlaying);
              } else {
                await soundObject.current.pauseAsync();
                setPauseState(true);
              }
            }}
          >
            <Ionicons
              name={pauseState ? "play-circle-outline" : "pause-circle-outline"}
              color="white"
              size={65}
            />
          </TouchableOpacity>
          {/* next button */}
          <TouchableOpacity
            onPress={async () => {
              playAudio(
                findIndexOf(currentPlaying) < stations.length - 1
                  ? stations[findIndexOf(currentPlaying) + 1]
                  : stations[0]
              );
            }}
          >
            <Ionicons
              name="play-skip-forward-circle-outline"
              color="white"
              size={65}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
// CSS for this page
const styles = StyleSheet.create({
  list: {
    backgroundColor: "#111",
  },
  container: {
    backgroundColor: "#111",
    flex: 1,
  },
  player: {
    height: 150,
    backgroundColor: "rgba(34, 34, 34, 100)",
    borderWidth: 2,
    borderColor: "rgba(50,50,50,255)",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  titleBox: {
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 25,
  },
  image: {
    width: 60,
    height: 60,
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
});
