import {
    View,
    Text,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
} from "react-native";
import Animated, {
    FadeInRight,
    FadeOutLeft,
    FadeOutRight,
} from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { defaultStyles } from "../../constants/Styles";
import axios from "axios";

const Library = () => {
    const [data, setData] = useState([]);
    // console.log("DATA", data);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://uplyrn-backend.onrender.com/user/purchasedCourses",
                    {
                        headers: {
                            email: "bs2912112@gmail.com",
                        },
                    }
                );
                // console.log("Library", response.data.purchasedCourses);
                setData(response.data.purchasedCourses);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const renderRow: ListRenderItem<any> = ({ item, index }) => (
        <Link href={`/listing/${item._id}`} asChild>
            <TouchableOpacity>
                <View style={[styles.listing]}>
                    <View>
                        <Image
                            source={{ uri: item.imageLink }}
                            style={styles.image}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: "mon-sb",
                                marginRight: 70,
                            }}
                        >
                            {item.title}
                        </Text>
                        <Text
                            style={{
                                fontFamily: "mon-sb",
                                marginTop: 14,
                            }}
                        >
                            $ {item.price}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView style={[defaultStyles.container]}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Your Library</Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={renderRow}
                    keyExtractor={(item) => item._id}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listing: {
        flexDirection: "row",
        padding: 16,
        gap: 10,
        marginVertical: 16,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 24,
        marginTop: 40,
    },
    header: {
        fontFamily: "mon-b",
        fontSize: 24,
    },
});

export default Library;
