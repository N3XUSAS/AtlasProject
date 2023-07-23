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
import { Button, HelperText, TextInput } from "react-native-paper";
import { auth, firestore } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import React from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPasword] = React.useState("");
  const [passwordValidation, setPaswordValidation] = React.useState("");

  const [nameErr, setNameErr] = React.useState("");
  const [surnameErr, setSurnameErr] = React.useState("");
  const [emailerr, setEmailErr] = React.useState("");
  const [passwordErr, setPasswordErr] = React.useState("");

  var nameValid = false;
  var surnameValid = false;
  var emailValid = false;
  var passwordvalid = false;

  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  async function handle2() {
    await createUserWithEmailAndPassword(auth, email, password).then(
      async (a) => {
        const user = auth.currentUser;
        if (user) {
          const uid = user?.uid;
          console.log(uid);
          const upd = doc(firestore, "users", uid);
          setDoc(upd, { name: name, surname: surname, books_read: 0 });
          console.log("firestore sucsess");
          router.push("(tabs)/welcome");
        }
      }
    );
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

    if (password.length == 0) {
      passwordvalid = false;
      setPasswordErr("Reikalingas slaptazodis");
    } else if (password.length < 8) {
      passwordvalid = false;
      setPasswordErr("Slaptažodis turi turėti bent 8 simbolius");
    } else if (password != passwordValidation) {
      passwordvalid = false;
      setPasswordErr("Slaptažodžiai nesutampa");
    } else {
      passwordvalid = true;
      setPasswordErr("");
    }

    if (
      nameValid == true &&
      surnameValid == true &&
      emailValid == true &&
      passwordvalid == true
    ) {
      handle2();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <TextInput
        mode="outlined"
        label="Vardas"
        onChangeText={setName}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <Text
        style={[
          {
            fontSize: 17,
            color: "red",
          },
        ]}
      >
        {nameErr}
      </Text>
      <TextInput
        mode="outlined"
        label="Pavardė"
        onChangeText={setSurname}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <Text
        style={[
          {
            fontSize: 17,
            color: "red",
          },
        ]}
      >
        {surnameErr}
      </Text>
      <TextInput
        mode="outlined"
        label="El. paštas"
        onChangeText={setEmail}
        style={styles.textbox}
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
      ></TextInput>
      <Text
        style={[
          {
            fontSize: 17,
            color: "red",
          },
        ]}
      >
        {emailerr}
      </Text>
      <TextInput
        label="Slaptazodis"
        style={styles.textbox}
        onChangeText={setPasword}
        mode="outlined"
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
        secureTextEntry={true}
      ></TextInput>
      <Text
        style={[
          {
            fontSize: 17,
            color: "red",
          },
        ]}
      >
        {passwordErr}
      </Text>
      <TextInput
        label="Pakartokite slaptažodį"
        style={styles.textbox}
        onChangeText={setPaswordValidation}
        mode="outlined"
        activeOutlineColor="#DBA39A"
        outlineColor="#DBA39A"
        secureTextEntry={true}
      ></TextInput>
      <Button
        mode="contained-tonal"
        style={styles.button}
        onPress={() => {
          validation();
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
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#F5EBE0",

    marginTop: 25,
  },
});
