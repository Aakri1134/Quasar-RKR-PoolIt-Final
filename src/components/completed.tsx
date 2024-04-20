import { Text, View,Image,StyleSheet ,ScrollView,TouchableHighlight,TouchableOpacity,Dimensions,Pressable,Button} from "react-native";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import LottieView from 'lottie-react-native';
import {Link} from 'expo-router';



export default function Completed(){
   
  const [price,setprice]=useState(0);
  


return(


    <View style={{flex:1,backgroundColor:"#77B0AA"}}>
         <Link href={'/home'} style={{height:40,margin:10}}>
            <Image source={require('../../assets/images/backbtn.png')} />
         </Link>
        <View style={{backgroundColor:"#77B0AA", alignItems:"center",justifyContent:"center",width:"100%",height:150}} >
          <Text style={styles.title}>Completed</Text>
        </View>
        <View style={styles.container}>
          
             <Image source={require('../../assets/images/feedback.png') } style={styles.svg}/> 
             <Text style={{fontSize:20,color:"#77B0AA"}}>
              Thanks for using our services.
             </Text>
       
        </View>
        
    </View>
)



};
const styles = StyleSheet.create({
title:{
  fontSize:40,
  color:"white"
},
container:{
  backgroundColor:"white",
  flex:1,
  alignItems:"center",
  width:"100%",
  borderTopEndRadius:20,
  borderTopLeftRadius:20,

},
svg:{
  marginVertical:40,
   height:150,
   width:150,
}
});