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
  const [authors, setAuthors] = useState("");

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

  var valueValid = false;
  var value2Valid = false;

  const [valueErrMsg, setValueErrMsg] = useState("");
  const [value2ErrMsg, setValue2ErrMsg] = useState("");

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

  function validation() {
    if (value.length == 0) {
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
    //setAuthors(authors);
    if (authors.length > 1) {
      var line: string = "";
      authors.forEach((element) => {
        line = line + element + ", ";
      });
      line = line.substring(0, line.length - 2);
      setAuthors(line);
    } else {
      var line: string = "";
      line = authors[0];
      setAuthors(line);
    }
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
        printType="books"
        langRestrict="lt"
        onResultPress={(book: any) =>
          add(book.id, book.title, book.authors, book.raw.volumeInfo.pageCount)
        }
      />
      <View style={styles.separator}></View>
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
          placeholder="Pasirinkite kategorija"
          onOpen={() => setOpen(false)}
          style={{ backgroundColor: "#F5EBE0" }}
          containerStyle={{
            width: "80%",
          }}
          dropDownContainerStyle={{
            backgroundColor: "#F5EBE0",
          }}
        />
      </View>
      <Button
        mode="contained-tonal"
        style={styles.button}
        onPress={() => {
          validation();
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
  search: {
    backgroundColor: "#F5EBE0",
  },
});
