import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
  Button,
  Dimensions,
  ActivityIndicator

} from "react-native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";
import { Link } from "expo-router";
import axios from "axios";

export default function Login () {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [show,setshow] = useState(false);

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const goToMainFlow = async () => {
    
    if(email && password) {
        try {

            const response = await auth().signInWithEmailAndPassword(
                email,
                password
            )

            if(response.user){
                setshow(true);
                setTimeout(()=>{
                    ``
                nav.replace("(tabs)");

                 setshow(false);
                },3000);
            }



        }catch(e){
            Alert.alert("oops");
            console.log(e);
        }
    }
  };

  return (
    <Pressable style={styles.bigContainer} onPress={Keyboard.dismiss}>
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sign In</Text>
      </View>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View>
            <TextInput
              style={styles.loginTextField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              inputMode="email"
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <Pressable onPress={goToMainFlow} style={styles.signInButton}><Text style={styles.signInText}>Sign in</Text></Pressable>
          <ActivityIndicator size={"large"} color={"#77B0AA"} animating={show} >
            </ActivityIndicator>
          <Link href={'/signUp'} >
            <Text style={styles.linkText}>No Account? SignUp Here</Text>
          </Link>
        </View>
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  contentView: {
    backgroundColor:'white',
    width:Dimensions.get('window').width *0.95,
    height:Dimensions.get('window').height *0.38,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(240, 240, 230, 1)',
    
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
  },
  titleContainer: {

    alignItems:"center",
    justifyContent:"center",
    height:Dimensions.get('window').height *0.08,
    width:Dimensions.get('window').width *0.9,
    borderWidth:3,
    borderColor:"#77B0AA",
    borderRadius:40,
    marginVertical:20,
  },
  titleText: {
    fontSize: 30,
    color: 'rgba(77, 77, 77, 1)',
  },
 
  loginTextField: {
    backgroundColor: 'rgba(238, 238, 238, 1)',
    height: '25%',
    width: Dimensions.get('window').width*0.88,
     marginVertical:10,
    paddingLeft: 15,
    borderRadius: 20,
  },
  signInButton: {
    backgroundColor: '#77B0AA',
    height: Dimensions.get('window').height *0.06,
    width: Dimensions.get('window').width*0.68 ,
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom:0,
  },
  signInText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color:"white",
  },
  linkText: {
    color: 'black',
    fontSize:15,
  }
});
