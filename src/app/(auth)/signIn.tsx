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
  ActivityIndicator,
  TouchableOpacity

} from "react-native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";
import { Link } from "expo-router";
import axios from "axios";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login () {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [show,setshow] = useState(false);
  const [shows,setshows] = useState(false);

  const [visible,setvisible] = useState(false);

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const goToMainFlow = async () => {
    
    if(email && password) {
        try {

            const response = await auth().signInWithEmailAndPassword(
                email,
                password
            )

            if(response.user){
                setshows(true);
                setTimeout(()=>{
                    
                nav.replace("(tabs)");

                 setshows(false);
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

          <View  style={styles.loginTextField}>
            <TextInput
              style={styles.inputbox}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              inputMode="email"
            />
            </View>
            <View style={styles.loginTextField}>
                <TextInput style={styles.inputbox}
                   placeholder="Password"
                   value={password}
                   onChangeText={setPassword}
                   secureTextEntry={visible}
                 />
                 <TouchableOpacity onPress={()=>{setshow(!show) ,setvisible(!visible)}}>
                  <MaterialCommunityIcons name={show===false? 'eye':'eye-off'} size={25} color={'#3C5B6F'} style={styles.eyesvg}/>
                 </TouchableOpacity>
            </View >
            
            </View>
          <Pressable onPress={goToMainFlow} style={styles.signInButton}><Text style={styles.signInText}>Sign in</Text></Pressable>
          <ActivityIndicator size={"large"} color={"#3C5B6F"} animating={shows} >
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
    flexDirection:"row",
    justifyContent:"space-between",
    backgroundColor: 'rgba(238, 238, 238, 1)',
    height:55,
    width: Dimensions.get('window').width*0.88,
    marginVertical:10,
    padding: 15,
    borderRadius: 20,
  },
  inputbox:{
    width:"80%",
    height:24,
  },
  eyesvg:{
    position:"absolute",
    right:20,
   
  },
  signInButton: {
    backgroundColor: '#77B0AA',
    height: Dimensions.get('window').height *0.06,
    width: Dimensions.get('window').width*0.68 ,
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical:10,
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
