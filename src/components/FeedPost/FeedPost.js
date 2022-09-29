import { View, Text, Image, Pressable } from "react-native";
import { useState, useEffect } from "react";
import {
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import LikeImage from "../../../assets/images/like.png";
import styles from "./FeedPost.styles";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { User } from "../../models";
import { S3Image } from "aws-amplify-react-native";

const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

const FeedPost = ({ post }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!post.postUserId) {
      return;
    }
    DataStore.query(User, post.postUserId).then(setUser);
  }, [post.postUserId]);

  return (
    <View style={styles.post}>
      {/* Header */}
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate("Profile", { id: post.postUserId })}
      >
        {user?.image ? (
          <S3Image imgKey={user.image} style={styles.profileImage} />
        ) : (
          <Image source={{ uri: dummy_img }} style={styles.profileImage} />
        )}
        <View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.subtitle}>{post.createdAt}</Text>
        </View>
        <Entypo
          name="dots-three-horizontal"
          size={24}
          color="gray"
          style={styles.icon}
        />
      </Pressable>
      {/* Body */}
      {post.description && (
        <Text style={styles.description}>{post.description}</Text>
      )}
      {post.image && (
        <S3Image imgKey={post.image} style={styles.image} resizeMode="cover" />
      )}
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.statsRow}>
          <Image source={LikeImage} style={styles.likeIcon} />
          <Text style={styles.likedBy}>
            Elon Musk ve {post.numberOfLikes} diğerleri
          </Text>
          <Text style={styles.shares}>{post.numberOfShares} paylaşım</Text>
        </View>
        {/*Button Row */}
        <View style={styles.buttonsRow}>
          <View style={styles.iconButton}>
            <AntDesign name="like2" size={18} color="gray" />
            <Text style={styles.iconButtonText}>Beğen</Text>
          </View>

          <View style={styles.iconButton}>
            <FontAwesome5 name="comment-alt" size={16} color="gray" />
            <Text style={styles.iconButtonText}>Yorum</Text>
          </View>

          <View style={styles.iconButton}>
            <MaterialCommunityIcons
              name="share-outline"
              size={18}
              color="gray"
            />
            <Text style={styles.iconButtonText}>Paylaş</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FeedPost;
