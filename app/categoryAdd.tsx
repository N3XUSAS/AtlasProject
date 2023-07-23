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
import { useState } from "react";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export default function CategoryAdd() {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();
  const [category, setCategory] = useState("");

  function submit() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const upd = doc(collection(firestore, "categories"));
      setDoc(upd, {
        userId: uid,
        name: category,
      });
      router.push("../library");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <TextInput
        mode="outlined"
        label="Vardas"
        onChangeText={setCategory}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <Button
        mode="contained-tonal"
        style={styles.button}
        onPress={() => {
          submit();
        }}
      >
        Pridėti
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
    marginTop: 20,
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
