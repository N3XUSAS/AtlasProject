import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
            }}
          />
          <Stack.Screen
            name="bookAdd"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Pridėti knygą",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="bookshelf"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Kategorija",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="categoryAdd"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Pridėti naują kategoriją",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="addToTop"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Pridėti į TOP sąrašą",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="bookEdit"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Koreguoti knygą",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="bookInfo"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Informacija apie knygą",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="bookshelfEdit"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Koreguoti kategoriją",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="profileEdit"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Profilio redagavimas",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="selectToRead"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Knygos pasirinkimas",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="topList"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "TOP sąrašas",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Prisijungimas",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "Registracija",
              headerTintColor: "black",
              statusBarTranslucent: true,
              headerStyle: {
                backgroundColor: "#FEFCF3",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </>
  );
}
