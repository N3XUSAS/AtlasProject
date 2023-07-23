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
import { GoogleBookSearch } from "react-native-google-books";
import React, { useEffect, useState } from "react";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import DropDownPicker from "react-native-dropdown-picker";

export default function BooksAdd() {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState(-1);
  const [authors, setAuthors] = useState([""]);

  const [openSecond, setOpenSecond] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [statusData, setStatusData] = useState([
    { value: "Skaitoma", label: "Skaitoma" },
    { value: "Neskaityta", label: "Neskaityta" },
    { value: "Perskaityta", label: "Perskaityta" },
    { value: "Nebaigta", label: "Nebaigta" },
  ]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [data, setData] = useState([{ value: "-", label: "-" }]);
  const [element, setElement] = useState("");

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
        setData([]);
        snapshot.forEach((doc) => {
          const userData = doc.data();
          setElement(userData.name);
        });
      });
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (element != null) {
      data.push({ value: element, label: element });
    }
  }, [element]);

  function submit() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const upd = doc(collection(firestore, "books"));
      setDoc(upd, {
        userId: uid,
        title: title,
        author: authors,
        pages: pages,
        bookId: id,
        category: value,
        status: statusValue,
        rating: -1,
      });
      router.push("../library");
    }
  }

  function add(id: string, name: string, authors: [string], pages: Int32) {
    setAuthors(authors);
    setId(id);
    setTitle(name);
    if (pages != undefined) setPages(pages);
    console.log(authors, id, name, pages);
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <GoogleBookSearch
        placeholder="Ieškoti"
        // key removed for security reasons
        apikey={""}
        printType="books"
        langRestrict="lt"
        onResultPress={(book: any) =>
          add(book.id, book.title, book.authors, book.raw.volumeInfo.pageCount)
        }
      />
      <View style={styles.separator}></View>
      <View style={{ zIndex: 2 }}>
        <DropDownPicker
          zIndex={1000}
          zIndexInverse={3000}
          open={open}
          value={value}
          items={data}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setData}
          placeholder="Pasirinkite kategorija"
          onOpen={() => setOpenSecond(false)}
        />
      </View>
      <View style={styles.separator}></View>
      <View style={{ zIndex: 1 }}>
        <DropDownPicker
          zIndex={1000}
          zIndexInverse={3000}
          open={openSecond}
          value={statusValue}
          items={statusData}
          setOpen={setOpenSecond}
          setValue={setStatusValue}
          setItems={setStatusData}
          placeholder="Pasirinkite kategorija"
          onOpen={() => setOpen(false)}
        />
      </View>
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
});
