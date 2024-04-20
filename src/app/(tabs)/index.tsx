import { 
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
  Button,

} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import React, { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Redirect,Link } from 'expo-router';

export default function TabOneScreen() {

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  function onAuthStateChanged(user : FirebaseAuthTypes.User | null){
    if(user) {
      console.log("already logged in");
      nav.replace("(main)");
    }
    else{
      nav.replace("(auth)");
    }
  }

  useEffect(()=>{
    const sub = auth().onAuthStateChanged(onAuthStateChanged);
    return sub;
  },[]);





  function signOut(){
    auth()
    .signOut()
    .then(()=>{
      console.log("user signed out");
      nav.replace("(auth)");
    })
  }
  

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
          <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Loading...</Text>
          <Button title = "sign out" onPress={signOut}  />
          </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginHorizontal: 50,
    backgroundColor: "white",
    paddingTop: 20,
  },
  titleContainer: {
    flex: 1.2,
    justifyContent: "center",
    backgroundColor : "white"
  },
  titleText: {
    fontSize: 45,
    textAlign: "center",
    fontWeight: "200",
    color : "black"
  },
  loginTextField: {
    borderBottomWidth: 1,
    height: 60,
    fontSize: 30,
    marginVertical: 10,
    fontWeight: "300",
    backgroundColor: "white"
  },
  mainContent: {
    flex: 6,
    backgroundColor: "white"
  },
});
