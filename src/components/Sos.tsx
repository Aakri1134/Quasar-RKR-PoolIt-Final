import { Button, Pressable, Text, View } from "react-native";


export default function Sos(){

    function system(){
          
    }



    return (
        <View style={{flex:1}}>
            <Pressable onPress={system} style={{backgroundColor:"red"}}>
                <Text>SOS</Text>
            </Pressable>
        </View>
    )
}