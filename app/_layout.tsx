import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const tokenCache = {
    async getToken(key: string) {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return await SecureStore.setItemAsync(key, value);
        } catch (error) {
            return;
        }
    },
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "mon-r": require("../assets/fonts/Montserrat-Regular.ttf"),
        "mon-sb": require("../assets/fonts/Montserrat-SemiBold.ttf"),
        "mon-b": require("../assets/fonts/Montserrat-Bold.ttf"),
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY!}
            tokenCache={tokenCache}
        >
            <StatusBar style="dark" />
            <RootLayoutNav />
        </ClerkProvider>
    );
}

function RootLayoutNav() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/(modals)/login");
        }
    }, [isLoaded]);

    return (
        <Stack>
            <Stack.Screen
                name="(modals)/login"
                options={{
                    headerTitleAlign: "center",
                    presentation: "modal",
                    title: "Login or Signup",
                    headerTitleStyle: { fontFamily: "mon-sb" },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <FontAwesome
                                name="chevron-left"
                                size={15}
                                color="black"
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="listing/[id]"
                options={{
                    headerTitle: "Course Details",
                    headerTransparent: false,
                }}
            />
            <Stack.Screen
                name="(modals)/search"
                options={{
                    presentation: "transparentModal",
                    animation: "fade",
                    headerTransparent: true,
                    headerTitle: "Search",
                }}
            />
        </Stack>
    );
}
