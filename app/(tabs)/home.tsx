import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import SearchHeader from "../../components/SearchHeader";
import Listing from "../../components/Listing";
import axios from "axios";

const Home = () => {
    const [categories, setCategories] = useState("All Categories");
    const [data, setData] = useState([]);

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

    const onCategoryChanged = (cateogry: string) => {
        console.log("CHNAGED CATEGORY", cateogry);
        setCategories(cateogry);
    };

    return (
        <View style={{ flex: 1, marginTop: 130 }}>
            <Stack.Screen
                options={{
                    header: () => (
                        <SearchHeader onCategoryChanged={onCategoryChanged} />
                    ),
                }}
            />
            <Listing courses={data} category={categories} />
        </View>
    );
};

export default Home;
