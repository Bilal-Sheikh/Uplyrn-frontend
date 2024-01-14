import {
    View,
    Text,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Link, useNavigation } from "expo-router";
import Animated, {
    FadeInRight,
    FadeOutLeft,
    FadeOutRight,
} from "react-native-reanimated";
import { defaultStyles } from "../../constants/Styles";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const navigation = useNavigation();

    const checkWishlistStatus = async () => {
        try {
            const wishlistData = await SecureStore.getItemAsync("wishlist");
            const wishlistArray = wishlistData ? JSON.parse(wishlistData) : [];
            console.log("Wishlisted Courses:", wishlistArray);
            setWishlist(wishlistArray);
        } catch (error) {
            console.error("Error checking wishlist status:", error);
        }
    };
    useEffect(() => {
        checkWishlistStatus();
    }, []);

    useLayoutEffect(() => {
        const unsubscribe = navigation.addListener("state", (e) => {
            // Check if the pressed tab is the "wishlist" tab
            if (e.target === "wishlist") {
                checkWishlistStatus();
            }
        });

        return unsubscribe;
    }, [navigation]);

    const renderRow: ListRenderItem<any> = ({ item, index }) => (
        <Link href={`/listing/${item._id}`} asChild>
            <Text>{item}</Text>
        </Link>
    );

    return (
        <View style={defaultStyles.container}>
            <FlatList
                keyExtractor={(item) => item}
                data={wishlist}
                renderItem={renderRow}
            />
        </View>
    );
};

export default Wishlist;
