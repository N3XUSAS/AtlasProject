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
import { auth, firestore } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  updateEmail,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function bookshelfEdit() {
  const params = useLocalSearchParams();
  const { category = "" } = params;
  const router = useRouter();
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const windowWidth = Dimensions.get("window").width;

  async function fetchId() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user?.uid;
      const q = query(
        collection(firestore, "categories"),
        where("userId", "==", uid),
        where("name", "==", category)
      );
      const querySnapshot = await getDocs(q);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          setId(doc.id);
        });
      });
    }
  }

  useEffect(() => {
    setName(category.toString());
    fetchId();
  }, []);

  function submit() {
    const data = {
      name: name,
    };
    const cid = id.toString();
    console.log("cid");
    const upd = doc(firestore, "categories", cid);
    updateDoc(upd, data)
      .then((upd) => {
        console.log("Entire Document has been updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });

    router.push({ params: { category: name }, pathname: "bookshelf" });
  }

  async function check() {
    var counter = 0;
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user?.uid;
      const q = query(
        collection(firestore, "books"),
        where("userId", "==", uid),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          counter += 1;
        });
        if (counter > 0) {
          alert("Kategorija privalo būti tuščia");
        } else {
          const upd = doc(firestore, "categories", id);
          deleteDoc(upd);
          router.push("(tabs)/library");
        }
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <Text
        style={{ color: "black", fontSize: 17, marginBottom: 10, zIndex: -1 }}
      >
        kategorijos pavadinimas:
      </Text>
      <TextInput
        value={name}
        mode="outlined"
        label="Pavadinimas"
        onChangeText={setName}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>

      <View style={styles.separator}></View>
      <Button
        mode="contained-tonal"
        style={[styles.button, { zIndex: -1 }]}
        onPress={() => {
          submit();
        }}
      >
        išsaugoti
      </Button>
      <Button
        mode="contained-tonal"
        style={[styles.button3, { zIndex: -1 }]}
        onPress={() => {
          check();
        }}
      >
        Pašalinti kategorija
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
    marginVertical: 10,
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
  button2: {
    width: 50,
    height: 50,
    backgroundColor: "#F5EBE0",
    //color: "black",
    marginTop: 25,
  },
  button3: {
    width: 250,
    height: 50,
    backgroundColor: "#DBA39A",

    marginTop: 25,
  },
});
