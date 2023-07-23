import {
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { Link, useRouter } from "expo-router";

export default function WelcomeScreen() {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <Text
        style={[
          {
            fontSize: 30,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        ATLAS
      </Text>
      <View
        style={styles.separatorLine}
        lightColor="#DBA39A"
        darkColor="#DBA39A"
      ></View>
      <Button
        mode="contained-tonal"
        style={styles.button}
        onPress={() => {
          router.push("login");
        }}
      >
        Prisijungti
      </Button>
      <Button
        mode="contained-tonal"
        style={styles.button}
        onPress={() => {
          router.push("register");
        }}
      >
        Registruotis
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FEFCF3",
  },
  nowReading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5EBE0",
    borderColor: "#DBA39A",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    alignSelf: "stretch",
    marginTop: 5,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    width: "80%",
  },
  separatorLine: {
    marginVertical: 10,
    width: "100%",
    height: 2,
  },
  tinyLogo: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: "#DBA39A",
    borderRadius: 100,
  },
  top: {
    marginTop: 30,
  },
  textbox: {
    width: 250,
    height: 50,
    backgroundColor: "#FEFCF3",
    marginTop: 20,
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#F5EBE0",

    marginTop: 25,
  },
});
