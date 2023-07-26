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
import React, { useEffect } from "react";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function profileEdit() {
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  var uid = "";
  var mail = "";
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  const [nameErr, setNameErr] = React.useState("");
  const [surnameErr, setSurnameErr] = React.useState("");
  const [emailerr, setEmailErr] = React.useState("");

  var nameValid = false;
  var surnameValid = false;
  var emailValid = false;

  async function fetchInfo() {
    await getUid().then(() => {
      const docRef = doc(firestore, "users", uid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setName(userData.name);
          setSurname(userData.surname);
          setEmail(mail);
        }
      });
    });
  }

  async function handleSubmit() {
    await getUid().then(() => {
      const data = {
        name: name,
        surname: surname,
      };
      const upd = doc(firestore, "users", uid);
      updateDoc(upd, data)
        .then((upd) => {
          console.log("Entire Document has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
        });

      const auth = getAuth();
      if (auth.currentUser) {
        updateEmail(auth.currentUser, email);
      }
    });
    router.push("(tabs)/profile");
  }

  async function validation() {
    if (name.length == 0) {
      nameValid = false;
      setNameErr("Reikalingas vardas");
    } else {
      nameValid = true;
      setNameErr("");
    }

    if (surname.length == 0) {
      surnameValid = false;
      setSurnameErr("Reikalinga pavardė");
    } else {
      surnameValid = true;
      setSurnameErr("");
    }

    var regexp = new RegExp("^.+@.+..+"),
      test = regexp.test(email);
    if (email.length == 0) {
      emailValid = false;
      setEmailErr("Reikalingas el.paštas");
    } else if (test == false) {
      emailValid = false;
      setEmailErr("Neteisingas el.paštas");
    } else {
      await fetchSignInMethodsForEmail(auth, email).then((answer) => {
        if (answer.length == 0) {
          emailValid = true;
          setEmailErr("");
        } else {
          emailValid = false;
          setEmailErr("El. paštas jau užimtas");
        }
      });
    }

    if (nameValid == true && surnameValid == true && emailValid == true) {
      handleSubmit();
    }
  }

  async function getUid() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      uid = user.uid;
      if (user.email) mail = user.email;
    }
  }

  useEffect(() => {
    getUid();
    fetchInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <TextInput
        mode="outlined"
        label="Vardas"
        value={name}
        onChangeText={setName}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <TextInput
        mode="outlined"
        label="Pavardė"
        value={surname}
        onChangeText={setSurname}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <TextInput
        mode="outlined"
        label="El. paštas"
        value={email}
        onChangeText={setEmail}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <Button
        mode="contained-tonal"
        style={styles.button}
        onPress={() => {
          validation();
        }}
      >
        išsaugoti
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
