import {
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Button, IconButton, TextInput } from "react-native-paper";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export default function selectToRead() {
  const windowWidth = Dimensions.get("window").width;

  const [elements, setElements] = useState<any[]>([]);
  const [element, setElement] = useState<any>();

  const router = useRouter();
  //   type ItemProps = { title: string };
  //   type ItemProps2 = { ids: any };

  async function fetchCategories() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user?.uid;
      const q = query(
        collection(firestore, "books"),
        where("userId", "==", uid),
        where("status", "==", "Neskaityta")
      );
      var items: string[] = [];
      const querySnapshot = await getDocs(q);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setElements([]);
        snapshot.forEach((doc) => {
          setElement([{ ...doc.data(), id: doc.id }]);
        });
        console.log(elements);
      });
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (element != null) {
      if (elements[0] == "") {
        const newItem = [element];
        setElements(newItem);
      } else {
        elements.push(...element);
      }
    }
  }, [element]);

  function updateBook(id: string) {
    const data = {
      status: "Skaitoma",
    };
    const upd = doc(firestore, "books", id);
    updateDoc(upd, data)
      .then((upd) => {
        console.log("Entire Document has been updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });

    router.push("(tabs)/welcome");
  }

  function getRandom() {
    const rnd = Math.floor(Math.random() * elements.length);
    if (elements.length > 0) updateBook(elements[rnd].id);
  }

  const Item = ({ title, ids }: any) => (
    <TouchableOpacity
      style={[styles.nowReading, { marginTop: 5 }]}
      onPress={() => {
        updateBook(ids);
      }}
    >
      <Ionicons
        name="book-sharp"
        size={40}
        color="#000000"
        style={{ marginLeft: 10 }}
      ></Ionicons>
      <Text
        style={[
          {
            fontSize: 25,
            fontWeight: "bold",
            marginLeft: 20,
            width: windowWidth - 120,
            color: "black",
          },
        ]}
      >
        {title}
      </Text>
      <Ionicons name="add" size={40} color="#000000" style={{}}></Ionicons>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.nowReading,
          { marginTop: 10, backgroundColor: "#F0DBDB", marginBottom: 10 },
        ]}
        onPress={() => {
          getRandom();
        }}
      >
        <Ionicons
          name="book-sharp"
          size={40}
          color="#000000"
          style={{ marginLeft: 10 }}
        ></Ionicons>
        <Text
          style={[
            {
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: 20,
              width: windowWidth - 120,
              color: "black",
            },
          ]}
        >
          Pasirinkti atsitiktinę knygą
        </Text>
        <Ionicons name="add" size={40} color="#000000" style={{}}></Ionicons>
      </TouchableOpacity>
      <FlatList
        data={elements}
        renderItem={({ item }) => <Item title={item.title} ids={item.id} />}
      ></FlatList>
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
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
