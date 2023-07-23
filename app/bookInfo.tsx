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
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Button } from "react-native-paper";

export default function bookInfo() {
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState("");
  const [authors, setAuthors] = useState([""]);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const params = useLocalSearchParams();
  const { id = "" } = params;

  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  async function fetchInfo() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const nid = id.toString();
      const docRef = doc(firestore, "books", nid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setTitle(userData.title);
          if (userData.pages > 0) setPages(userData.pages);
          else setPages("Nenurodyta");
          setAuthors(userData.author);
          setStatus(userData.status);
          if (userData.rating == -1) {
            setRating("Neįvertinta");
          } else {
            setRating(userData.rating);
          }
        }
      });
    }
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#FEFCF3",
          alignSelf: "center",
        }}
      >
        <Text
          style={[
            {
              fontSize: 30,
              fontWeight: "bold",
              color: "black",
              marginBottom: 10,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <Text
        style={[
          {
            paddingStart: windowWidth / 6,
            fontSize: 22,
            fontWeight: "bold",
            color: "black",
            marginBottom: 10,
          },
        ]}
      >
        Autorius: {authors}
      </Text>
      <Text
        style={[
          {
            paddingStart: windowWidth / 6,
            marginBottom: 10,
            fontSize: 22,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        Puslapių skaičius: {pages}
      </Text>
      <Text
        style={[
          {
            paddingStart: windowWidth / 6,
            fontSize: 22,
            fontWeight: "bold",
            color: "black",
            marginBottom: 10,
          },
        ]}
      >
        Statusas: {status}
      </Text>
      <Text
        style={[
          {
            paddingStart: windowWidth / 6,
            fontSize: 22,
            fontWeight: "bold",
            color: "black",
          },
        ]}
      >
        Įvertinimas: {rating}
      </Text>
      <Button
        mode="contained-tonal"
        style={[styles.button, { marginStart: windowWidth / 6 }]}
        onPress={() => {
          router.push({
            params: { id: id },
            pathname: "bookEdit",
          });
        }}
      >
        Redagavimas
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
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
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#F5EBE0",
    marginTop: 25,
  },
});
