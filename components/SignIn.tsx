import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { defaultStyles } from "../constants/Styles";

export default function SignIn() {
    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            console.log(err);
        }
    };
    return (
        <View>
            <View>
                <TextInput
                    value={emailAddress}
                    autoCapitalize="none"
                    onChangeText={(emailAddress) =>
                        setEmailAddress(emailAddress)
                    }
                    placeholder="Email"
                    style={[defaultStyles.inputField, { marginBottom: 10 }]}
                />
            </View>

            <View>
                <TextInput
                    value={password}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    style={[defaultStyles.inputField, { marginBottom: 10 }]}
                />
            </View>

            <TouchableOpacity onPress={onSignInPress} style={defaultStyles.btn}>
                <Text style={defaultStyles.btnText}>Sign in</Text>
            </TouchableOpacity>
        </View>
    );
}
