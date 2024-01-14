import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from "react-native-reanimated";
import { defaultStyles } from "../../constants/Styles";
import axios from "axios";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const Page = () => {
    const { id } = useLocalSearchParams();

    // const [wishlisted, setWishlisted] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
    console.log("Wishlisted:::::::::::", isInWishlist);

    const [data, setData] = useState<any>([]);
    const ref = useAnimatedRef<Animated.ScrollView>();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://uplyrn-backend.onrender.com/user/courses/${id}`
                );
                // console.log("RESPONSE", response.data);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        checkWishlistStatus();
    }, []);
    const checkWishlistStatus = async () => {
        try {
            const wishlistData = await SecureStore.getItemAsync("wishlist");
            const wishlistArray = wishlistData ? JSON.parse(wishlistData) : [];
            const isInWishlist = wishlistArray.includes(id);
            console.log("Wishlist status:", isInWishlist);
            setIsInWishlist(isInWishlist);
        } catch (error) {
            console.error("Error checking wishlist status:", error);
        }
    };
    const toggleWishlist = async () => {
        try {
            const wishlistData = await SecureStore.getItemAsync("wishlist");
            const wishlistArray = wishlistData ? JSON.parse(wishlistData) : [];

            if (isInWishlist) {
                const updatedWishlist = wishlistArray.filter(
                    (item: any) => item !== id
                );
                await SecureStore.setItemAsync(
                    "wishlist",
                    JSON.stringify(updatedWishlist)
                );
            } else {
                const updatedWishlist = [...wishlistArray, id];
                await SecureStore.setItemAsync(
                    "wishlist",
                    JSON.stringify(updatedWishlist)
                );
            }

            checkWishlistStatus();
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    };

    const shareListing = async () => {
        try {
            await Share.share({
                title: data.name,
                url: "https://bilal-sheikh-portfolio.vercel.app/",
                message:
                    "Check out this amazing website! | https://bilal-sheikh-portfolio.vercel.app/",
            });
        } catch (err) {
            console.log(err);
        }
    };

    // const getFromWishlist = async (id: string) => {
    //     try {
    //         const isWishlisted = await SecureStore.getItemAsync(id);
    //         console.log("WISHLISTED VALUE", isWishlisted);

    //         if (isWishlisted === "true") {
    //             setWishlisted(true);
    //         } else {
    //             setWishlisted(false);
    //             console.log("NOT WISHLISTED");
    //         }
    //     } catch (error) {
    //         console.error("Error getting wishlist:", error);
    //     }
    // };
    // const saveToWishlist = async (key: string, value: string) => {
    //     try {
    //         if (wishlisted) {
    //             await SecureStore.deleteItemAsync(key);
    //             console.log("REMOVED FROM WISHLIST", key);
    //             setWishlisted(false);
    //         } else {
    //             await SecureStore.setItemAsync(key, value);
    //             console.log("ADDED TO WISHLIST", key);
    //             setWishlisted(true);
    //         }
    //     } catch (error) {
    //         console.error("Error updating wishlist:", error);
    //     }
    // };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity
                        style={styles.roundButton}
                        onPress={shareListing}
                    >
                        <Ionicons
                            name="share-outline"
                            size={22}
                            color={"#000"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.roundButton}
                        onPress={toggleWishlist}
                    >
                        <Ionicons
                            name={isInWishlist ? "heart" : "heart-outline"}
                            size={22}
                            color={isInWishlist ? "red" : "#000"}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.roundButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={"#000"} />
                </TouchableOpacity>
            ),
        });
    }, [isInWishlist]);

    const scrollOffset = useScrollViewOffset(ref);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [2, 1, 1]
                    ),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                ref={ref}
                scrollEventThrottle={16}
            >
                <Animated.Image
                    source={{ uri: data.imageLink }}
                    style={[styles.image, imageAnimatedStyle]}
                    resizeMode="cover"
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{data.title}</Text>
                    <View
                        style={{ flexDirection: "row", gap: 4, marginTop: 20 }}
                    >
                        <Ionicons name="star" size={16} />
                        <Text style={styles.ratings}>4.0 · 4.7 reviews</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.hostView}>
                        <Image
                            source={{ uri: data.imageLink }}
                            style={styles.host}
                        />

                        <View>
                            <Text style={{ fontWeight: "500", fontSize: 16 }}>
                                Published by{" "}
                                {data.publishedBy && data.publishedBy[0]
                                    ? `${data.publishedBy[0].FirstName} ${data.publishedBy[0].LastName}`
                                    : "Unknown"}
                            </Text>
                            <Text>Host since 2022</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.description}>
                        {data.description}
                        {data.description}
                        {data.description}
                        {data.description}
                        {data.description}
                        {data.description}
                        {data.description}
                    </Text>
                </View>
            </Animated.ScrollView>

            <Animated.View
                style={defaultStyles.footer}
                entering={SlideInDown.delay(500)}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity style={styles.footerText}>
                        <Text style={styles.footerPrice}>Price: </Text>
                        <Text style={styles.footerPrice}>$ {data.price}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            defaultStyles.btn,
                            {
                                paddingRight: 20,
                                paddingLeft: 20,
                                marginTop: 10,
                            },
                        ]}
                    >
                        <Text style={defaultStyles.btnText}>Purchase</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    image: {
        height: IMG_HEIGHT,
        width: width,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: "#fff",
    },
    name: {
        fontSize: 26,
        fontWeight: "bold",
        fontFamily: "mon-sb",
    },
    location: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: "mon-sb",
    },
    rooms: {
        fontSize: 16,
        color: Colors.gray,
        marginVertical: 4,
        fontFamily: "mon-r",
    },
    ratings: {
        fontSize: 16,
        fontFamily: "mon-sb",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.gray,
        marginVertical: 16,
    },
    host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.gray,
    },
    hostView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    footerText: {
        height: "100%",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    footerPrice: {
        fontSize: 18,
        fontFamily: "mon-sb",
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        color: Colors.primary,
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    header: {
        backgroundColor: "#fff",
        height: 100,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.gray,
    },

    description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: "mon-r",
    },
});

export default Page;
