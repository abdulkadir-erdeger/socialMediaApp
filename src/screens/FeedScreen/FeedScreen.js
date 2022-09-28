import { FlatList, Pressable, Text, Image } from "react-native";
import React from "react";
import FeedPost from "../../components/FeedPost";
import posts from "../../../assets/data/posts.json";
import { Entypo } from "@expo/vector-icons";
import styles from "./FeedScreen.styles";
import { useNavigation } from "@react-navigation/native";

const img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

const FeedScreen = () => {
  const navigation = useNavigation();
  const createPost = () => {
    navigation.navigate("Create Post");
  };
  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <FeedPost post={item} />}
      ListHeaderComponent={() => (
        <Pressable onPress={createPost} style={styles.header}>
          <Image source={{ uri: img }} style={styles.profileImage} />
          <Text style={styles.name}>What's on your mind?</Text>
          <Entypo
            name="images"
            size={24}
            color="limegreen"
            style={styles.icon}
          />
        </Pressable>
      )}
    />
  );
};

export default FeedScreen;
