import { 
  StyleSheet,
 
  SafeAreaView,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
  Button,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
  
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import React, { useState } from "react";
import { Text, View } from '@/src/components/Themed';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import axios from 'axios';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabOneScreen() {

  const [firstname, setFirstName] = useState<string | undefined>();
  const [lastname, setLastName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [show,setshow] = useState(false);
  const [shows,setshows] = useState(false);
  const [visible,setvisible] = useState(false);


  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const createProfile = async (response: FirebaseAuthTypes.UserCredential) => {
    // Create Profile Query Here
    db().ref(`/users/${response.user.uid}`).set({firstname});
    await axios.post("http://192.168.56.226:3000/signup",{
            uid : response.user.uid,
            firstname : firstname,
            lastname : lastname,
            email : email,
            phone: phone,
          })
          .then((r)=>{console.log(r.data)})
          .catch((e)=>{console.log(e)})
      console.log(response.user.uid);
  };

  const registerAndGoToMainFlow = async () => {
    // Register User Query Here
    if(email && password){
      try {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password
        )

        if(response.user){
          await createProfile(response);

          nav.replace("(tabs)");
          setshow(true);
          setTimeout(()=>{
           setshow(false);
          },3000);
        }

      } catch(e){
        Alert.alert("oops");
        console.log(e);
      }
    }

  };

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Register</Text>
          </View>
          <View style={styles.mainContent}>
            <TextInput
              style={styles.loginTextField}
              placeholder="Firstname"
              value={firstname}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Lastname"
              value={lastname}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              inputMode="email"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Phone Number"
              keyboardType='numeric'
              value={phone}
              onChangeText={setPhone}
              autoCapitalize="none"
            />
            <View style={styles.Password}>
            <TextInput
              style={{width:"50%"}}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry ={visible}
            />
            <TouchableOpacity onPress={()=>{setshow(!show) ,setvisible(!visible)}}>
                  <MaterialCommunityIcons name={show===false? 'eye':'eye-off'} size={25} color={'#3C5B6F'} style={styles.eyesvg}/>
                 </TouchableOpacity>
            </View>
            
          </View>
          <View style={styles.buttoncontainer}>
          <Pressable onPress={registerAndGoToMainFlow} style={styles.signInButton}><Text style={styles.signInText}>Sign Up</Text></Pressable>
          <ActivityIndicator size={"large"} color={"blue"} animating={shows}>
          </ActivityIndicator>
          <Link href={'/signIn'}><Text style={styles.Remainder}>Already have an account? SignIn</Text></Link>
          </View>
         
        </View>
      </SafeAreaView>
    </Pressable>
    
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: "white",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
  },
  container: {
    alignItems:"center",
    marginHorizontal:50,
    backgroundColor: "rgba(256,256,256,0)",
    marginTop:"40%",
    height: Dimensions.get('window').height *0.71,
  },
  titleContainer: {
    
    height:Dimensions.get('window').height *0.08,
    width:Dimensions.get('window').width *0.85,
    alignItems:"center",
    justifyContent: "center",
    backgroundColor:"white",
    borderWidth:3,
    borderColor:"#77B0AA",
    borderRadius:50,
  },
  titleText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "200",
    color:"black",
  },
  loginTextField: {
    borderWidth: 2,
    borderRadius:20,
    borderColor:"rgba(240, 240, 230, 1)",
    paddingLeft:15,
    height: 50,
    fontSize: 16,
    width:"95%",
    marginVertical: 20,
    fontWeight: "300",
    color:"black",
    backgroundColor: "white",
  },
  Password:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    height: 50,
    width:"95%",
    borderWidth: 2,
    borderRadius:20,
    borderColor:"rgba(240, 240, 230, 1)",
    paddingLeft:15,
    marginVertical: 20,
    backgroundColor: "white",

  },
  eyesvg:{
    right:15,
    
    
  },
  mainContent: {
    height:Dimensions.get('window').height *0.4,
    width:Dimensions.get('window').width *0.91,
    padding:10,
    alignItems:"center",
    justifyContent:"space-around",
    backgroundColor: "white",
    borderWidth:2,
    borderRadius:30,
    borderColor:"rgba(240, 240, 230, 1)",
    marginVertical:20,
   
  },
  buttoncontainer:{
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"white",
  },
  signInButton:{
    
    alignItems:"center",
    justifyContent:"center",
    height:Dimensions.get('window').height *0.06,
    width:240,
    backgroundColor:"#77B0AA",
    margin:6,
    borderRadius:30,
  },
  signInText:{
    color:"white",
    fontSize:20,
  },
  Remainder:{
    color:"black",
    fontSize:16,
  }
});