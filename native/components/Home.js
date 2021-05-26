// importing important stuffs
import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Audio } from "expo-av";
import ListItem from "./ListItem";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  writeAsStringAsync,
  readAsStringAsync,
  getInfoAsync,
  documentDirectory,
  EncodingType,
} from "expo-file-system";
// main code

export default function Home({ navigation }) {
  // can't really explain this state
  const [startupCounter, setStartupCounter] = useState(0);
  // state that helps run a function on app startup
  const [startup, setStartup] = useState(true);
  // state to set the mode
  const [onlyFavs, setOnlyFavs] = useState(false);
  // state to store all the liked stations
  const [favs, setFavs] = useState([]);
  // state to check if the current playing is liked or not
  const [isLiked, setIsLiked] = useState(false);
  // state to store liked stations in a writable format
  const [favStationlist, setfavStationlist] = useState([]);
  // state to check if station data is fetched
  const [fetchedData, setFetchedData] = useState(false);
  // State which contains the object for the station currently being played
  const [currentPlaying, setCurrentPlaying] = useState();
  // state to store the list of stations
  const [stations, setStations] = useState();
  // Animated value for control box animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // Animated value for stationlist animation
  const listFadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const listFadeIn = () => {
    // Will change listFadeAnim value to 1 in 5 seconds
    Animated.timing(listFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const writeFavs = async () => {
    // writes data about the liked station in HDD
    await writeAsStringAsync(
      documentDirectory + "/fav.json/",
      favStationlist.toString(),
      {
        encoding: EncodingType.UTF8,
      }
    );
  };
  const readFavsJson = async () => {
    // reads data about liked stations from HDD
    let favsJsonInfo = await readAsStringAsync(
      documentDirectory + "/fav.json/",
      {
        encoding: EncodingType.UTF8,
      }
    );
    favsJsonInfo = favsJsonInfo.split(",");
    var tempListFavItems = [];
    favsJsonInfo.forEach((element) => {
      stations.forEach((ele) => {
        if (element == ele.name) {
          tempListFavItems.push(ele);
        }
      });
    });
    setfavStationlist(favsJsonInfo);
    setFavs(tempListFavItems);
  };

  if (!fetchedData) {
    // fetches station data from the website
    fetch("https://radioglobal.ga/crs-pf/stations.json")
      .then((res) => res.json())
      .then((result) => {
        setStations(result);
      });
    setFetchedData(true);
  }
  // function to add currentPlaying station to favs
  const addItemToFavs = (item) => {
    let temp = favStationlist;
    temp.push(item.name);
    setfavStationlist(temp);
    writeFavs();
    let tempFavs = favs;
    tempFavs.push(item);
    setFavs(tempFavs);
  };
  // function to remove currentPlaying station from favs
  const removeItemFromFavs = (item) => {
    let temp = favStationlist;
    let index = temp.indexOf(item.name);
    if (index > -1) {
      temp.splice(index, 1);
    }
    setfavStationlist(temp);
    writeFavs();
    let tempFavs = favs;
    index = tempFavs.indexOf(item);
    if (index > -1) {
      tempFavs.splice(index, 1);
    }
    setFavs(tempFavs);
  };
  // creating a sound player
  const soundObject = useRef(new Audio.Sound());
  // state to check if the player is paused
  const [pauseState, setPauseState] = useState(true);
  // function to find index of a station in the stations list
  const findIndexOf = (item, array) => {
    var index = 0;
    var result = 99;
    array.forEach((element) => {
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
  // function to check if currently played station is liked or not
  const checkIfliked = (item) => {
    var result = false;
    favs.forEach((element) => {
      if (item.name == element.name) {
        result = true;
      }
    });
    setIsLiked(result);
  };

  // function to play/pause audio
  const playAudio = async (item) => {
    setCurrentPlaying(item);

    try {
      if (pauseState) {
        await soundObject.current.unloadAsync();
      } else {
        await soundObject.current.pauseAsync();
        await soundObject.current.unloadAsync();
      }
    } catch (e) {
      console.log(e);
    }

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
  // This func runs on app startup
  const startupFunc = async () => {
    let result = await getInfoAsync(documentDirectory + "/fav.json/");
    if (result.exists) {
      await readFavsJson();
      setStartup(false);
    } else {
      await writeAsStringAsync(documentDirectory + "/fav.json/", "", {
        encoding: EncodingType.UTF8,
      });

      startupFunc();
    }
  };
  // runs a function when current palying station is changed
  useEffect(() => {
    fadeIn();
    try {
      checkIfliked(currentPlaying);
    } catch (error) {
      console.log(error);
    }
  }, [currentPlaying]);
  // runs a function weh nstation data is fetched
  useEffect(() => {
    if (startup && startupCounter >= 1) {
      startupFunc();
    } else {
      setStartupCounter(startupCounter + 1);
    }
  }, [stations]);
  // runs a function when mode is changed
  useEffect(() => {
    listFadeIn();
  }, [onlyFavs]);
  return (
    // Home page
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* icon to open drawer navigator */}
        <Feather name="menu" size={28} onPress={openMenu} style={styles.icon} />
        {/* -------------------- */}
        {/* title of the header */}
        <View style={styles.headerTitle}>
          <Image
            source={require("../assets/BWicon.png")}
            style={styles.headerImage}
          />
          <Text style={styles.headerText}>RadioGlobal</Text>
        </View>
        {/* ------------------------ */}
      </View>
      {/* --------------------- */}
      {/* Mode changer */}
      <Animated.View
        style={[
          styles.mode,
          {
            opacity: listFadeAnim,
          },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Animated.timing(listFadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => {
              setOnlyFavs(!onlyFavs);
            });
          }}
        >
          <Text style={styles.modeText}>
            {onlyFavs ? "Only favourites" : "All stations"}
          </Text>
        </TouchableWithoutFeedback>
        {/* ------------------------------ */}
      </Animated.View>
      {/* displaying the available stations  */}
      <Animated.FlatList
        style={[
          styles.list,
          {
            opacity: listFadeAnim,
          },
        ]}
        data={onlyFavs ? favs : stations}
        keyExtractor={(item, index) => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }).start(async () => {
                await playAudio(item);
              });
            }}
          >
            <ListItem item={item} />
          </TouchableOpacity>
        )}
      />
      {/* audio controls */}
      <Animated.View
        style={[
          styles.player,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.titleBox}>
          <View style={styles.stationTitle}>
            <Text style={styles.text}>
              {currentPlaying != null
                ? currentPlaying.name
                : "tap on a station to get started"}
            </Text>
            <Text style={styles.country}>
              {currentPlaying != null ? currentPlaying.country : ""}
            </Text>
          </View>
          {currentPlaying != null ? (
            <TouchableOpacity
              onPress={() => {
                if (isLiked) {
                  setIsLiked(false);
                  removeItemFromFavs(currentPlaying);
                } else {
                  setIsLiked(true);
                  addItemToFavs(currentPlaying);
                }
              }}
            >
              <Ionicons
                name={isLiked ? "heart-sharp" : "heart-outline"}
                size={30}
                color="white"
                style={styles.likeButton}
              />
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
        </View>

        <View style={styles.controls}>
          {/* Previous Button */}
          <TouchableOpacity
            onPress={async () => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }).start(async () => {
                await playAudio(
                  !onlyFavs
                    ? findIndexOf(currentPlaying, stations) > 0
                      ? stations[findIndexOf(currentPlaying, stations) - 1]
                      : stations[stations.length - 1]
                    : findIndexOf(currentPlaying, favs) > 1
                    ? favs[findIndexOf(currentPlaying, favs) - 1]
                    : favs[favs.length - 1]
                );
              });
            }}
          >
            <Feather name={"skip-back"} color="white" size={60} />
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
            <Feather
              name={pauseState ? "play-circle" : "pause-circle"}
              color="white"
              size={65}
            />
          </TouchableOpacity>
          {/* next button */}
          <TouchableOpacity
            onPress={async () => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }).start(async () => {
                await playAudio(
                  !onlyFavs
                    ? findIndexOf(currentPlaying, stations) <
                      stations.length - 1
                      ? stations[findIndexOf(currentPlaying, stations) + 1]
                      : stations[0]
                    : findIndexOf(currentPlaying, favs) < favs.length - 1
                    ? favs[findIndexOf(currentPlaying, favs) + 1]
                    : favs[0]
                );
              });
            }}
          >
            <Feather name="skip-forward" color="white" size={60} />
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
  },
  country: {
    color: "white",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 15,
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
  mode: {
    paddingLeft: 20,
    marginBottom: 5,
    flexDirection: "column",
    justifyContent: "center",
  },
  modeText: {
    fontSize: 20,
    color: "white",
    letterSpacing: 1,
  },
});
