import { Text, View,Image,StyleSheet ,ScrollView,TouchableHighlight,TouchableOpacity,Dimensions,Pressable,Button} from "react-native";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import {Link} from 'expo-router';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function UserProfile(){

    const nav = useNavigation<NativeStackNavigationProp<any>>();

    function signOut() {
        auth()
          .signOut()
          .then(() => {
            console.log("user signed out");
            nav.replace("(auth)");
          });
      }

    const [userInfo,setUserInfo] = useState({
        email : "",
    });
    
    auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('User email: ', user.email);
        }
    });


    return(
        <View style={styles.Bigcontainer}>
            <View style={styles.container}>
                
                    <View style={styles.Box}>      
                    </View>

                    <View style={styles.imgcontainer}>
                       
                        <Image source={require('../../../../assets/images/pic.png')} style={styles.profilepic}></Image>
                     

                    </View>
                    <Text style={styles.Contents}>Mr. Unknown</Text>   
                
               
            </View >

            <View style={[styles.ContentBox]}>
              <View>
               <Link href={'/about'} style={styles.linksbox}> <View  style={[styles.linkcontainer]}><Text style={styles.link}>About</Text></View></Link>
                <Link href={'/savedLocations'} style={styles.linksbox}><View  style={[styles.linkcontainer]}><Text style={styles.link}>Saved locations</Text></View></Link>
                <Link href={'/previousRides'} style={styles.linksbox}><View  style={[styles.linkcontainer]}><Text style={styles.link}>Previous Rides</Text></View></Link>
                <Pressable onPress={signOut} style={styles.signoutContainer}><Text style={styles.signout}>Sign Out</Text></Pressable>
              </View>
                
         
            </View>

        </View>
                    
    )
}
const styles = StyleSheet.create({
    Bigcontainer:{
        flex:1,
        flexDirection:"column",
        alignItems:"center",
        backgroundColor:"white",
        
    },
    container:{
        
        alignItems:"center",
        justifyContent:"center",
    },
    Box:{
        backgroundColor:"#77B0AA",
        height:150,
        width:Dimensions.get('window').width *0.99,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,

    },
    imgcontainer:{
         justifyContent:"center",
         alignItems:"center",
         marginTop:-80,
    },
    
    profilepic:{
      height:150,
      width:150,
      borderWidth:4,
      borderColor:"white",
      borderRadius:99,
    },

     ContentBox:{
        height:Dimensions.get('window').height *0.4,
        width:Dimensions.get('window').width *0.91,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: "white",
        borderWidth:1,
        marginVertical:20,
        borderRadius:30,
        borderColor:"rgba(240, 240, 230, 1)", 
       
    
     

    },
   
    Contents:{
        color:"black",
        fontSize:25,
        marginVertical:10,
       
    },
    linkcontainer:{
       justifyContent:"center", 
       alignItems:'center',
       height:50,
       backgroundColor:"#77B0AA",
       width:Dimensions.get('window').width *0.85,
       borderRadius:20,
    },
    linksbox:{
        marginVertical:15,
    },

    link:{
       fontSize:20,
       color:"white",
    },
    signoutContainer:{
        justifyContent:"center", 
        alignItems:'center',
        height:50,
        borderWidth:2,
        borderColor:"black",
        width:Dimensions.get('window').width *0.85,
        borderRadius:20,
        marginVertical:14,
       
    },
    signout:{
      fontSize:20,
    }
});