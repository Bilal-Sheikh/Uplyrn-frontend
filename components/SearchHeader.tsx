import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React, { useRef, useState } from "react";
import Colors from "../constants/Colors";
import { Link } from "expo-router";
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";

const categories = [
    {
        category: "All Categories",
        icon: "sort-variant",
    },
    {
        category: "Personal Development",
        icon: "bookshelf",
    },
    {
        category: "Business",
        icon: "google-my-business",
    },
    {
        category: "Lifestyle",
        icon: "lifebuoy",
    },
    {
        category: "Marketing",
        icon: "shopping",
    },
    {
        category: "Technology",
        icon: "cellphone",
    },
    {
        category: "Photography & Video",
        icon: "camera",
    },
];

interface Props {
    onCategoryChanged: (category: string) => void;
}

export default function ({ onCategoryChanged }: Props) {
    const scrollRef = useRef<ScrollView>(null);
    const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const selectCategory = (index: number) => {
        setActiveIndex(index);
        onCategoryChanged(categories[index].category);
    };

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <View style={styles.container}>
                <View style={styles.actionRow}>
                    <Link href={"/(modals)/search"} asChild>
                        <TouchableOpacity style={styles.searchBtn}>
                            <Ionicons name="search" size={24} />
                            <View>
                                <Text style={{ fontFamily: "mon-sb" }}>
                                    Search courses...
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                </View>

                <ScrollView
                    horizontal
                    ref={scrollRef}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: "center",
                        gap: 20,
                        paddingHorizontal: 16,
                    }}
                >
                    {categories.map((item, index) => (
                        <TouchableOpacity
                            ref={(el) => (itemsRef.current[index] = el)}
                            key={index}
                            style={
                                activeIndex === index
                                    ? styles.categoriesBtnActive
                                    : styles.categoriesBtn
                            }
                            onPress={() => selectCategory(index)}
                        >
                            <MaterialCommunityIcons
                                name={item.icon as any}
                                size={24}
                                color={
                                    activeIndex === index ? "#000" : Colors.gray
                                }
                            />
                            <Text
                                style={
                                    activeIndex === index
                                        ? styles.categoryTextActive
                                        : styles.categoryText
                                }
                            >
                                {item.category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        backgroundColor: "#fff",
        paddingTop: 10,
        height: 130,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        },
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 16,
    },

    searchBtn: {
        backgroundColor: "#fff",
        flexDirection: "row",
        gap: 10,
        padding: 14,
        alignItems: "center",
        width: 280,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#c2c2c2",
        borderRadius: 30,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#A2A0A2",
        borderRadius: 24,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: "mon-sb",
        color: Colors.gray,
    },
    categoryTextActive: {
        fontSize: 14,
        fontFamily: "mon-sb",
        color: "#000",
    },
    categoriesBtn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 8,
    },
    categoriesBtnActive: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "#000",
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
});
