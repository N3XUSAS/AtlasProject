import {
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const windowWidth = Dimensions.get("window").width;
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [count, setCount] = useState(0);

  const router = useRouter();

  function fetchPost() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const docRef = doc(firestore, "users", uid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setName(userData.name);
          setSurname(userData.surname);
          setCount(userData.books_read);
        }
      });
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

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
        Profilis
      </Text>
      <View
        style={styles.separatorLine}
        lightColor="#DBA39A"
        darkColor="#DBA39A"
      ></View>

      <Image
        style={styles.tinyLogo}
        source={{
          uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }}
      />
      <Text
        style={[
          {
            marginTop: 20,
            fontSize: 30,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        {name + " " + surname}
      </Text>
      <Text
        style={[
          {
            marginTop: 20,
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        Knygų perskaityta: {count}
      </Text>
      <TouchableOpacity
        style={styles.nowReading}
        onPress={() => {
          router.push("../profileEdit");
        }}
      >
        <Ionicons
          name="person"
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
          Profilio redagevimas
        </Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={40}
          color="#000000"
          style={{}}
        ></Ionicons>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.nowReading}
        onPress={() => {
          router.push("../topList");
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
          TOP knygos
        </Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={40}
          color="#000000"
          style={{}}
        ></Ionicons>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nowReading, { backgroundColor: "#F0DBDB" }]}
        onPress={() => {
          router.push("/");
        }}
      >
        <Ionicons
          name="exit"
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
          Atsijungti
        </Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={40}
          color="#000000"
          style={{}}
        ></Ionicons>
      </TouchableOpacity>
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
});
