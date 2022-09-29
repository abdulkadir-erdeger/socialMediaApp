import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import styles from "./CreatePostScreen.styles";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { DataStore, Auth, Storage } from "aws-amplify";
import { Post, User } from "../../models";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

/*const user = {
  id: "u1",
  image:
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg",
  name: "Vadim Savin",
};*/

const CreatePostScreen = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, userData.attributes.sub);

      if (dbUser) {
        setUser(dbUser);
      } else {
        navigation.navigate("Update Profile");
      }
    };

    fetchUser();
  }, []);

  const onPost = async () => {
    const userData = await Auth.currentAuthenticatedUser();

    const newPost = {
      description,
      numberOfLikes: 0,
      numberOfShares: 0,
      postUserId: user.id,
      _version: 1,
    };

    if (image) {
      newPost.image = await uploadFile(image);
    }

    await DataStore.save(new Post(newPost));
    setDescription("");
    setImage(null);
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const key = `${uuidv4()}.png`;
      await Storage.put(key, blob, {
        contentType: "image/png", // contentType is optional
      });
      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { marginBottom: insets.bottom }]}
      keyboardVerticalOffset={150}
    >
      <View style={styles.header}>
        <Image source={{ uri: user?.image }} style={styles.profileImage} />
        <Text style={styles.name}>{user?.name}</Text>
        <Entypo
          onPress={pickImage}
          name="images"
          size={24}
          color="limegreen"
          style={styles.icon}
        />
      </View>
      <TextInput
        placeholder="Ne düşünüyorsun?"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.buttonContainer}>
        <Button onPress={onPost} title="Gönder" disabled={!description} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreatePostScreen;
