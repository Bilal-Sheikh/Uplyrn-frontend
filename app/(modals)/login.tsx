import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrower";
import SignIn from "../../components/SignIn";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "../../constants/Styles";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
    useWarmUpBrowser();
    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const handleAuth = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();
            // console.log("createdSessionId::::::::::", createdSessionId);

            if (createdSessionId) {
                setActive!({ session: createdSessionId });
                router.push("/(tabs)/home");
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <View style={styles.container}>
            <SignIn />
            <View style={styles.separatorView}>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <Text style={styles.separator}>or</Text>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View />
            </View>

            <View style={{ gap: 20 }}>
                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => handleAuth()}
                >
                    <Ionicons
                        name="md-logo-google"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Google
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 26,
        backgroundColor: "#fff",
    },
    separatorView: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginVertical: 30,
    },
    separator: {
        fontFamily: "mon-sb",
        color: Colors.gray,
    },
    btnOutline: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Colors.gray,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    btnOutlineText: {
        color: "#000",
        fontSize: 16,
        fontFamily: "mon-sb",
    },
});

export default Login;
