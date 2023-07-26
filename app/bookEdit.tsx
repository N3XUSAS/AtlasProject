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
  doc,
  getCountFromServer,
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

export default function bookEdit() {
  const [rating, setRating] = useState("");
  const params = useLocalSearchParams();
  const { id = "" } = params;

  const [openSecond, setOpenSecond] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [statusData, setStatusData] = useState([
    { value: "Skaitoma", label: "Skaitoma" },
    { value: "Neskaityta", label: "Neskaityta" },
    { value: "Perskaityta", label: "Perskaityta" },
    { value: "Nebaigta", label: "Nebaigta" },
  ]);

  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [categoryData, setCategoryData] = useState([
    { value: "-", label: "-" },
  ]);
  const [element, setElement] = useState("");

  var valueValid = false;
  var value2Valid = false;

  const [valueErrMsg, setValueErrMsg] = useState("");
  const [value2ErrMsg, setValue2ErrMsg] = useState("");

  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  async function fetchInfo() {
    await fetchCategories().then(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const nid = id.toString();
        const docRef = doc(firestore, "books", nid);
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();

            setCategoryValue(userData.category);
            console.log(categoryValue);
            setStatusValue(userData.status);
            if (userData.rating == -1) {
              setRating("Neįvertinta");
            } else {
              setRating(userData.rating);
            }
          }
        });
      }
    });
    console.log(categoryValue);
  }

  useEffect(() => {
    fetchCategories();
    fetchInfo();
  }, []);

  async function fetchCategories() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user?.uid;
      const q = query(
        collection(firestore, "categories"),
        where("userId", "==", uid)
      );
      var items: string[] = [];
      const querySnapshot = await getDocs(q);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCategoryData([]);
        snapshot.forEach((doc) => {
          const userData = doc.data();
          setElement(userData.name);
        });
      });
    }
  }

  async function countBooks() {
    var count = 0;
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user?.uid;
      const q = query(
        collection(firestore, "books"),
        where("userId", "==", uid),
        where("status", "==", "Perskaityta")
      );
      const rez = await getCountFromServer(q);
      count = rez.data().count;
      const data = {
        books_read: count,
      };
      const upd = doc(firestore, "users", uid);
      updateDoc(upd, data);
    }
  }

  function validation() {
    if (statusValue.length == 0) {
      valueValid = false;
      setValueErrMsg("Nepasirinkta jokia kategorija");
    } else {
      valueValid = true;
      setValueErrMsg("");
    }
    if (statusValue.length == 0) {
      value2Valid = false;
      setValue2ErrMsg("Nepasirinktas joks statusas");
    } else {
      value2Valid = true;
      setValue2ErrMsg("");
    }
    if (valueValid == true && value2Valid == true) {
      submit();
    }
  }

  function submit() {
    const data = {
      rating: rating,
      category: categoryValue,
      status: statusValue,
    };
    const bid = id.toString();
    const upd = doc(firestore, "books", bid);
    updateDoc(upd, data)
      .then((upd) => {
        console.log("Entire Document has been updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    countBooks();
    router.back();
  }

  useEffect(() => {
    if (element != null) {
      categoryData.push({ value: element, label: element });
    }
  }, [element]);

  // async function getUid() {
  //   const auth = getAuth();
  //   const user = auth.currentUser;
  //   if (user) {
  //     uid = user.uid;
  //     if (user.email) mail = user.email;
  //   }
  // }

  useEffect(() => {
    //getUid();
    //fetchInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <Text
        style={[
          {
            fontSize: 17,
            color: "red",
          },
        ]}
      >
        {valueErrMsg}
      </Text>
      <Text
        style={{ color: "black", fontSize: 17, marginBottom: 10, zIndex: -1 }}
      >
        Knygos kategorija:
      </Text>
      <View style={{ zIndex: 2, backgroundColor: "#FEFCF3" }}>
        <DropDownPicker
          zIndex={3000}
          zIndexInverse={1000}
          open={open}
          value={categoryValue}
          items={categoryData}
          setOpen={setOpen}
          setValue={setCategoryValue}
          setItems={setCategoryData}
          dropDownDirection="BOTTOM"
          placeholder="Pasirinkite kategorija"
          onOpen={() => setOpenSecond(false)}
          style={{ backgroundColor: "#F5EBE0" }}
          containerStyle={{
            width: "80%",
          }}
          dropDownContainerStyle={{
            backgroundColor: "#F5EBE0",
          }}
        />
      </View>
      <View style={styles.separator}></View>
      <Text
        style={[
          {
            fontSize: 17,
            color: "red",
          },
        ]}
      >
        {value2ErrMsg}
      </Text>
      <Text
        style={{ color: "black", fontSize: 17, marginBottom: 10, zIndex: -1 }}
      >
        Knygos statusas:
      </Text>
      <View style={{ zIndex: 1, backgroundColor: "#FEFCF3" }}>
        <DropDownPicker
          zIndex={1000}
          zIndexInverse={3000}
          open={openSecond}
          value={statusValue}
          items={statusData}
          setOpen={setOpenSecond}
          setValue={setStatusValue}
          setItems={setStatusData}
          dropDownDirection="BOTTOM"
          placeholder="Pasirinkite kategorija"
          onOpen={() => setOpen(false)}
          style={styles.dropDown}
          containerStyle={{
            width: "80%",
          }}
          dropDownContainerStyle={{
            backgroundColor: "#F5EBE0",
          }}
        />
      </View>
      <View style={styles.separator}></View>
      <Text style={{ color: "black", fontSize: 17, zIndex: -1 }}>
        Knygos reitingas, dabartinis yra {rating}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#FEFCF3",
          zIndex: -1,
        }}
      >
        <Button
          mode="contained-tonal"
          style={[styles.button2, { marginLeft: 3, marginRight: 3 }]}
          onPress={() => {
            setRating("5");
          }}
        >
          5
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button2, { marginLeft: 3, marginRight: 3 }]}
          onPress={() => {
            setRating("4");
          }}
        >
          4
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button2, { marginLeft: 3, marginRight: 3 }]}
          onPress={() => {
            setRating("3");
          }}
        >
          3
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button2, { marginLeft: 3, marginRight: 3 }]}
          onPress={() => {
            setRating("2");
          }}
        >
          2
        </Button>
        <Button
          mode="contained-tonal"
          style={[styles.button2, { marginLeft: 3, marginRight: 3 }]}
          onPress={() => {
            setRating("1");
          }}
        >
          1
        </Button>
      </View>
      <Button
        mode="contained-tonal"
        style={[styles.button, { zIndex: -1 }]}
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
  button2: {
    width: 50,
    height: 50,
    backgroundColor: "#F5EBE0",
    //color: "black",
    marginTop: 25,
  },
  dropDown: {
    backgroundColor: "#F5EBE0",
  },
});
