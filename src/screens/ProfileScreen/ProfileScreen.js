import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import FeedPost from "../../components/FeedPost";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import styles from "./ProfileScreen.styles";
import { Auth, DataStore } from "aws-amplify";
import { User, Post } from "../../models";
import { S3Image } from "aws-amplify-react-native/dist/Storage";

const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";
const bg = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg";

const ProfileScreenHeader = ({ user, isMe = false }) => {
  const navigation = useNavigation();

  const signOut = async () => {
    await Auth.signOut();
    await DataStore.clear();
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: bg }} style={styles.bg} />
      {user?.image ? (
        <S3Image imgKey={user.image} style={styles.image} />
      ) : (
        <Image source={{ uri: dummy_img }} style={styles.image} />
      )}

      <Text style={styles.name}>{user.name}</Text>

      {isMe && (
        <>
          <View style={styles.buttonsContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: "royalblue" }]}
            >
              <AntDesign name="pluscircle" size={16} color="white" />
              <Text style={[styles.buttonText, { color: "white" }]}>
                Add to Story
              </Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate("Update Profile")}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="black" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
            <Pressable
              onPress={signOut}
              style={[styles.button, { flex: 0, width: 50 }]}
            >
              <MaterialIcons name="logout" size={16} color="black" />
            </Pressable>
          </View>
        </>
      )}

      <View style={styles.textLine}>
        <Entypo
          name="graduation-cap"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>Graduated university</Text>
      </View>

      <View style={styles.textLine}>
        <Ionicons name="time" size={18} color="gray" style={{ width: 25 }} />
        <Text>Joined on October 2013</Text>
      </View>

      <View style={styles.textLine}>
        <Entypo
          name="location-pin"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>From Tenerife</Text>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const userId = route?.params?.id || userData?.attributes?.sub;

      if (!userId) {
        return;
      }

      const isMe = userId === userData?.attributes?.sub;
      setIsMe(isMe);

      const dbUser = await DataStore.query(User, userId);

      if (!dbUser) {
        if (isMe) {
          navigation.navigate("Update Profile");
        } else {
          Alert.alert("Kullanıcı Bulunamadı");
        }
        return;
      }
      setUser(dbUser);

      const dbPosts = await DataStore.query(Post, (p) =>
        p.postUserId("eq", userId)
      );
      setPosts(dbPosts);
    };

    fetchData();
  }, []);

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <FeedPost post={item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <>
          <ProfileScreenHeader user={user} isMe={isMe} />
          <Text style={styles.sectionTitle}>Gönderiler</Text>
        </>
      )}
    />
  );
};

export default ProfileScreen;
