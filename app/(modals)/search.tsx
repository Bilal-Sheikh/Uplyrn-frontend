import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { defaultStyles } from "../../constants/Styles";
import Colors from "../../constants/Colors";
// import { places } from '@/assets/data/places';
import { Link, useRouter } from "expo-router";
import axios from "axios";

const popularCoursesList = [
    { title: "Course 1", img: require("../../assets/images/icon.png") },
    { title: "Course 2", img: require("../../assets/images/icon.png") },
    { title: "Course 3", img: require("../../assets/images/icon.png") },
];

export default function Search() {
    const router = useRouter();
    const [data, setData] = useState<any>([]);
    const [selectedCourse, setSelectedCourse] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://uplyrn-backend.onrender.com/user/courses"
                );
                // console.log("RESPONSE", response.data.courses);
                setData(response.data.courses);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        return data.filter((course: any) => {
            // console.log("INNER::::::::::", course.title);
            return course.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery]);
    // console.log("FILTERED:::::::::::::::", filteredItems);
    // filteredItems[filteredItems.length - 1].title

    return (
        <BlurView intensity={70} style={styles.container} tint="light">
            <View style={styles.card}>
                <Text style={styles.cardHeader}>What's on your mind?</Text>

                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.cardBody}
                >
                    <View style={styles.searchSection}>
                        <Ionicons
                            style={styles.searchIcon}
                            name="ios-search"
                            size={20}
                            color="#000"
                        />
                        <TextInput
                            style={styles.inputField}
                            placeholder="Search available courses"
                            placeholderTextColor={Colors.gray}
                            onChange={(e) => setSearchQuery(e.nativeEvent.text)}
                        />
                    </View>

                    {searchQuery ? (
                        <View>
                            <Text
                                style={{
                                    fontFamily: "mon-b",
                                    fontSize: 20,
                                    borderBottomWidth: 1,
                                    marginBottom: 10,
                                }}
                            >
                                Courses:
                            </Text>
                            <FlatList
                                keyExtractor={(item) => item._id}
                                data={filteredItems}
                                renderItem={({ item }) => (
                                    <Link href={`/listing/${item._id}`} asChild>
                                        <TouchableOpacity
                                            style={{
                                                borderBottomWidth: 0.5,
                                                marginBottom: 20,
                                                padding: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: Colors.primary,
                                                    fontFamily: "mon-sb",
                                                    fontSize: 15,
                                                }}
                                            >
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>
                                    </Link>
                                )}
                            />
                        </View>
                    ) : (
                        <View style={{ marginTop: 20 }}>
                            <Text
                                style={{
                                    fontFamily: "mon-b",
                                    fontSize: 25,
                                }}
                            >
                                Popular Courses
                            </Text>
                            <ScrollView
                                style={{ paddingTop: 15 }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.coursesContainer}
                            >
                                {popularCoursesList.map((item, index) => (
                                    <TouchableOpacity
                                        onPress={() => setSelectedCourse(index)}
                                        key={index}
                                    >
                                        <Text
                                            style={
                                                selectedCourse == index
                                                    ? styles.placeSelectedText
                                                    : styles.placeText
                                            }
                                        >
                                            {item.title}
                                        </Text>
                                        <Image
                                            source={item.img}
                                            style={
                                                selectedCourse == index
                                                    ? styles.placeSelected
                                                    : styles.place
                                            }
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </Animated.View>
            </View>

            <View style={defaultStyles.footer}>
                <TouchableOpacity
                    style={[defaultStyles.btn]}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="search-outline"
                        size={24}
                        style={[defaultStyles.btnIcon, { left: 105 }]}
                        color={"#fff"}
                    />
                    <Text style={defaultStyles.btnText}>Search</Text>
                </TouchableOpacity>
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
    },
    searchContainer: {
        flex: 1,
        padding: 26,
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        margin: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        gap: 20,
    },
    cardHeader: {
        fontFamily: "mon-b",
        fontSize: 24,
        padding: 20,
    },
    cardBody: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cardPreview: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },

    searchSection: {
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ABABAB",
        borderRadius: 8,
        marginBottom: 16,
    },
    searchIcon: {
        padding: 10,
    },
    inputField: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    coursesContainer: {
        flexDirection: "row",
        gap: 20,
    },
    place: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    placeSelected: {
        borderColor: Colors.gray,
        borderWidth: 2,
        borderRadius: 10,
        width: 100,
        height: 100,
    },
    placeText: {
        fontFamily: "mon-r",
        fontSize: 14,
        color: Colors.gray,
        paddingBottom: 6,
    },
    placeSelectedText: {
        fontFamily: "mon-sb",
        fontSize: 14,
        color: Colors.dark,
        paddingBottom: 6,
    },
    previewText: {
        fontFamily: "mon-sb",
        fontSize: 14,
        color: Colors.gray,
    },
    previewdData: {
        fontFamily: "mon-sb",
        fontSize: 14,
        color: Colors.dark,
    },

    guestItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    itemBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.gray,
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
