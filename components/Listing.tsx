import {
    View,
    Text,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import Animated, {
    FadeInRight,
    FadeOutLeft,
    FadeOutRight,
} from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { defaultStyles } from "../constants/Styles";

interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageLink: string;
}

interface CoursesData {
    courses: Course[];
    category: string;
}

export default function Listing({ courses, category }: CoursesData) {
    if (!courses) {
        return null;
    }

    // const [data, setData] = useState(courses);
    const [loading, setLoading] = useState(false);
    const ref = useRef<FlatList>(null);

    useEffect(() => {
        console.log("RELOAD listing ", courses);
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 200);
    }, [category]);

    const renderRow: ListRenderItem<any> = ({ item, index }) => (
        <Link href={`/listing/${item._id}`} asChild>
            <TouchableOpacity>
                <Animated.View
                    style={styles.listing}
                    entering={FadeInRight}
                    exiting={FadeOutLeft}
                >
                    <Image
                        source={{ uri: item.imageLink }}
                        style={styles.image}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexWrap: "wrap",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ fontSize: 25, fontFamily: "mon-sb" }}>
                            {item.title}
                        </Text>
                    </View>
                    <Text style={{ fontFamily: "mon-sb" }}>$ {item.price}</Text>
                    <Text style={{ fontFamily: "mon-r" }}>
                        {item.description}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            // gap: 4,
                            // flex: 1,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontFamily: "mon-sb",
                                    fontStyle: "italic",
                                }}
                            >
                                By - {item.publishedBy[0].FirstName}{" "}
                                {item.publishedBy[0].LastName}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View style={defaultStyles.container}>
            <FlatList
                ref={ref}
                data={loading ? [] : courses}
                renderItem={renderRow}
                keyExtractor={(item) => item._id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listing: {
        padding: 16,
        gap: 10,
        marginVertical: 16,
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
    },
    info: {
        textAlign: "center",
        fontFamily: "mon-sb",
        fontSize: 16,
        marginTop: 4,
    },
});
