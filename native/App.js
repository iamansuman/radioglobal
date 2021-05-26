// Importing important stuffs
import React from "react";
import About from "./components/About";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Home";

// main code
export default function App() {
  // creating a drawer navigator
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      {/* Home route */}
      <Drawer.Navigator
        initialRouteName="Home"
        drawerStyle={{
          backgroundColor: "#111",
        }}
        drawerContentOptions={{
          activeTintColor: "#000000" /* font color for active screen label */,
          activeBackgroundColor: "#FFFFFF" /* bg color for active screen */,
          inactiveTintColor:
            "#fff" /* Font color for inactive screens' labels */,
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        {/* About route */}
        <Drawer.Screen name="About" component={About} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
