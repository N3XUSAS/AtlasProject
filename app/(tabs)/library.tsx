import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  List,
  Provider,
  Surface,
  TextInput,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

export default function TabTwoScreen() {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();
  type ItemProps = { title: string };
  const [elements, setElements] = useState([""]);
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
        setElements([""]);
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
    if (element != "") {
      if (elements[0] == "") {
        const newItem = [element];
        setElements(newItem);
      } else {
        elements.push(element);
      }
    }
  }, [element]);

  const Item = ({ title }: ItemProps) => (
    <TouchableOpacity
      style={[styles.nowReading, { marginTop: 5 }]}
      onPress={() => {
        router.push({ params: { category: title }, pathname: "../bookshelf" });
      }}
    >
      <Ionicons
        name="library"
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
      <Ionicons
        name="chevron-forward-sharp"
        size={40}
        color="#000000"
        style={{}}
      ></Ionicons>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <Text
        style={[
          {
            //marginRight: windowWidth - 200,
            fontSize: 30,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        Biblioteka
      </Text>
      <View
        style={styles.separatorLine}
        lightColor="#DBA39A"
        darkColor="#DBA39A"
      ></View>
      <TouchableOpacity
        style={[
          styles.nowReading,
          { marginTop: 5, backgroundColor: "#F0DBDB" },
        ]}
        onPress={() => {
          router.push("../bookAdd");
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
          Pridėti knygą
        </Text>
        <Ionicons name="add" size={40} color="#000000" style={{}}></Ionicons>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.nowReading,
          { marginTop: 5, backgroundColor: "#F0DBDB" },
        ]}
        onPress={() => {
          router.push("../categoryAdd");
        }}
      >
        <Ionicons
          name="library"
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
          Pridėti kategoriją
        </Text>
        <Ionicons name="add" size={40} color="#000000" style={{}}></Ionicons>
      </TouchableOpacity>
      <View style={styles.separator}></View>
      <FlatList
        data={elements}
        renderItem={({ item }) => <Item title={item} />}
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

    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginTop: 20,
    width: "80%",
  },
  separatorLine: {
    marginVertical: 10,
    width: "100%",
    height: 2,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  addButton: {
    backgroundColor: "#F5EBE0",
    position: "absolute",
    borderColor: "#DBA39A",
    borderWidth: 2,
    bottom: 15,
    right: 15,
  },
  top: {
    marginTop: 30,
  },
});
