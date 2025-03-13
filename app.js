import React, { useState, useEffect } from "react";
import {View,Text,TextInput,Button,StyleSheet,Image,ScrollView,TouchableOpacity,Dimensions,Platform,FlatList,Alert,} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";

const { width, height } = Dimensions.get("window");
if (Platform.OS === "web") {
  alert("This app is designed for mobile devices only.");
  throw new Error("Web platform is not supported");
}

// Sign In Screen for users
const SignInScreen = ({ navigation }) => {
  return (
    <View style={styles.signInContainer}>
      <Text style={styles.title}>Welcome to the App</Text>
      <Button title="Sign In" onPress={() => navigation.navigate("UserProfile")} />
    </View>
  );
};

// User Profile Screen for users
const UserProfileScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    id: 1, 
    uid: `${Date.now()}`,
    name: "",
    email: "",
    mobile: "",
    password: "",
    gender: "",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
  });

  // Function to select image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to the gallery.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const saveProfile = () => {
    console.log("Profile saved:", formData);
    Alert.alert("Success", "Profile saved successfully!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: formData.avatar }} style={styles.avatar} />
        <Text style={styles.editText}>Edit Avatar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>User Profile</Text>
       <Text style={styles.profileText}>ID: {formData.id}</Text>
      <Text style={styles.profileText}>UID: {formData.uid}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        keyboardType="phone-pad"
        value={formData.mobile}
        onChangeText={(text) => setFormData({ ...formData, mobile: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      // Gender Picker 
      <RNPickerSelect
        onValueChange={(value) => setFormData({ ...formData, gender: value })}
        items={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ]}
        style={{
          inputAndroid: styles.input,
          inputIOS: styles.input,
        }}
        placeholder={{ label: "Select Gender", value: "" }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("UserList")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => Alert.alert("Coming Soon!", "Forgot Password functionality coming soon!")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// User List Screen suggestion
const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: "Puja Sinha", // Your name
    avatar: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg", // Your profile image
  });

  useEffect(() => {
    fetch("https://random-data-api.com/api/users/random_user?size=80")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigation.navigate("SignIn"); // Navigate to SignIn screen
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Top Bar with Profile & Logout */}
      <View style={styles.topBar}>
        {/* Profile Image */}
        <TouchableOpacity style={styles.profileContainer}>
          <Image source={{ uri: userProfile.avatar }} style={styles.profileImage} />
          <Text style={styles.profileName}>{userProfile.name}</Text>
        </TouchableOpacity>

        // Logout Button 
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>User Suggestions</Text>

      <View style={{ height: 500 }}> 
        {/* Ensures FlatList scrolls separately inside ScrollView */}
        {users.length > 0 ? (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userCard}
                onPress={() => navigation.navigate("UserDetails", { user: item })}
              >
                <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <Text style={styles.userGender}>Gender: {item.gender}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>Loading users...</Text>
        )}
      </View>
    </ScrollView>
  );
};
//showing user detail
const UserDetailsScreen = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={styles.detailsContainer}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
      <Text style={styles.info}>Gender: {user.gender}</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
      <Text style={styles.info}>Phone: {user.phone_number || "N/A"}</Text>
      <Text style={styles.info}>
        Address: {user.address.street_address}, {user.address.city}, {user.address.state}
      </Text>
    </View>
  );
};
// Navigating to different pages
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="UserList" component={UserListScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} options={{ title: "User Details" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styling for page
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  
  signInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  editText: {
    textAlign: "center",
    color: "blue",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
  },
  userGender: {
    fontSize: 14,
    color: "#555",
  },
  forgotPassword: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},

saveButton: {
  flex: 1,
  backgroundColor: "#007bff",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  marginRight: 10,
},

loginButton: {
  flex: 1,
  backgroundColor: "#28a745",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  marginLeft: 10,
},

buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
scrollContainer: {
  flexGrow: 1,
  padding: 20,
  backgroundColor: "#f5f5f5",
},
topBar: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
  backgroundColor: "#ffffff",
  borderBottomWidth: 1,
  borderBottomColor: "#ccc",
},

profileContainer: {
  flexDirection: "row",
  alignItems: "center",
},

profileImage: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
},

profileName: {
  fontSize: 16,
  fontWeight: "bold",
},

logoutButton: {
  backgroundColor: "#dc3545",
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 5,
},

logoutText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
},
detailsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
name: {
    fontSize: 22,
    fontWeight: "bold",
  },
info: {
    fontSize: 16,
    marginTop: 5,
  },
});

