import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import styles from "./UpdateProfileScreen.styles";
import { API, Auth, graphqlOperation, DataStore, Storage } from "aws-amplify";
import { User } from "../../models";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { S3Image } from "aws-amplify-react-native";

const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

const createUser = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      createdAt
      updatedAt
      name
      image
      _version
      _lastChangedAt
      _deleted
    }
  }
`;

const UpdateProfileScreen = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, userData.attributes.sub);
      setUser(dbUser);
      setName(dbUser?.name);
    };

    fetchUser();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onSave = async () => {
    if (user) {
      await onUpdate();
    } else {
      await onCreate();
    }
    navigation.navigate("Feed");
  };

  const onUpdate = async () => {
    let imageKey;
    if (image) {
      imageKey = await uploadFile(image);
    }
    await DataStore.save(
      User.copyOf(user, (updated) => {
        updated.name = name;
        if (imageKey) {
          updated.image = imageKey;
        }
      })
    );
  };

  const onCreate = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const newUser = {
      id: userData.attributes.sub,
      name,
      _version: 1,
    };

    if (image) {
      newUser.image = await uploadFile(image);
    }

    await API.graphql(graphqlOperation(createUser, { input: newUser }));
  };

  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const key = `${uuidv4()}.png`;
      await Storage.put(key, blob, {
        contentType: "image/png",
      });
      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  let renderImage = <Image source={{ uri: dummy_img }} style={styles.image} />;
  if (image) {
    renderImage = <Image source={{ uri: image }} style={styles.image} />;
  } else if (user?.image) {
    renderImage = <S3Image imgKey={user.image} style={styles.image} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { marginBottom: insets.bottom }]}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={150}
    >
      <Pressable onPress={pickImage} style={styles.imagePickerContainer}>
        {renderImage}
        <Text>Change photo</Text>
      </Pressable>

      <TextInput
        placeholder="Full name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <View style={styles.buttonContainer}>
        <Button onPress={onSave} title="Save" disabled={!name} />
      </View>
    </KeyboardAvoidingView>
  );
};
export default UpdateProfileScreen;
