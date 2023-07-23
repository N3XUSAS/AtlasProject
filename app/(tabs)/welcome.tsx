import {
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

export default function Welcome() {
  const [elements, setElements] = useState<any[]>([]);
  const [element, setElement] = useState<any>();
  const [name, setName] = useState("");
  const windowWidth = Dimensions.get("window").width;

  const router = useRouter();

  async function fetchBooks() {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    auth.onAuthStateChanged((user3) => {
      if (user3) {
        fetch(user3);
        fetchName(user3);
      }
    });
  }

  async function fetch(user: any) {
    if (user) {
      const uid = user?.uid;
      const q = query(
        collection(firestore, "books"),
        where("userId", "==", uid),
        where("status", "==", "Skaitoma")
      );
      const querySnapshot = await getDocs(q);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setElements([]);
        console.log("Test2");
        snapshot.forEach((doc) => {
          setElement([{ ...doc.data(), id: doc.id }]);
        });
        console.log("Test3");
      });
    }
  }

  useEffect(() => {
    fetchBooks();
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

  async function fetchName(user: any) {
    if (user) {
      const uid = user.uid;
      const docRef = doc(firestore, "users", uid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setName(userData.name);
        }
      });
    }
  }

  const Item = ({ title, ids }: any) => (
    <TouchableOpacity
      style={[styles.nowReading, { marginTop: 5 }]}
      onPress={() => {
        console.log(ids);
        router.push({ params: { id: ids }, pathname: "bookInfo" });
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
            fontSize: 30,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        Sveiki {name}!
      </Text>
      <View
        style={styles.separatorLine}
        lightColor="#DBA39A"
        darkColor="#DBA39A"
      ></View>
      <TouchableOpacity
        style={[
          styles.nowReading,
          { marginTop: 10, backgroundColor: "#F0DBDB", marginBottom: 10 },
        ]}
        onPress={() => {
          router.push("selectToRead");
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
          Išsirinkti naują knygą skaitymui
        </Text>
        <Ionicons name="add" size={40} color="#000000" style={{}}></Ionicons>
      </TouchableOpacity>
      <Text
        style={[
          {
            marginRight: 170,
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        Dabar skaitoma:
      </Text>
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
    marginTop: 15,
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
    width: 50,
    height: 50,
  },
  top: {
    marginTop: 30,
  },
});
