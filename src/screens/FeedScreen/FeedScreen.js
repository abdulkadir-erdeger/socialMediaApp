import { FlatList, Pressable, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import FeedPost from "../../components/FeedPost";
import { Entypo } from "@expo/vector-icons";
import styles from "./FeedScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { DataStore, Predicates, SortDirection } from "aws-amplify";
import { Post } from "../../models";

const img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const subscription = DataStore.observeQuery(Post, Predicates.ALL, {
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
    }).subscribe(({ items }) => setPosts(items));

    return () => subscription.unsubscribe();
  }, []);

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
          <Text style={styles.name}>Ne düşünüyorsun?</Text>
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
