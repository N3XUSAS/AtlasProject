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
import { Button, IconButton, TextInput } from "react-native-paper";
import { auth, firestore } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const windowWidth = Dimensions.get("window").width;

  const router = useRouter();

  async function login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        router.push("(tabs)/welcome");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("neteisingas el.paštas arba slaptazodis");
      });
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          {
            fontSize: 17,
            color: "red",
          },
        ]}
      >
        {error}
      </Text>
      <TextInput
        mode="outlined"
        label="El. paštas"
        onChangeText={setEmail}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <TextInput
        label="Slaptazodis"
        style={styles.textbox}
        onChangeText={setPassword}
        mode="outlined"
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
        secureTextEntry={true}
      ></TextInput>
      <Button
        mode="contained-tonal"
        style={styles.button}
        onPress={() => {
          login();
        }}
      >
        Prisijungti
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
  optButton: {
    backgroundColor: "#F5EBE0",
    position: "relative",
    bottom: 10,
  },
});
