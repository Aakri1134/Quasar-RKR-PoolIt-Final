import { useEffect, useState } from "react";
import { Text } from "./Themed";
import axios from "axios";
import { Button, View } from "react-native";
import auth from "@react-native-firebase/auth";

   
export function FindingDrivers(props){

    const [uid, setUid]= useState("")
    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
              console.log('User ', user.uid);
              setUid(user.uid)
            }
        });
    },[])
    

    const [valid, setValidity]= useState(true)
    const cancelBooking =async ()=>{
        cancBooking()
        setValidity(false)
        console.log("Ride Cancelled Finding Drivers")
        await axios.post("http://192.168.17.226:3000/cancelride/",{
            uid: uid,
        })
                .then((r)=>{console.log(r.data)})
                .catch((e)=>{console.log(e)})
      }

const {cancBooking, bookingConf}= props
    useEffect(()=>{
        const interval = setInterval(async ()=>{
            await axios.get("http://192.168.17.226:3000/ridecheck/",{
                uid: uid,
            })
            .then((r)=>{
                console.log(r.data)
                if(r.data.Status=="true"){
                    bookingConf()
                    clearInterval(interval);
                }
                
            })
            .catch((e)=>{console.log(e)})
            console.log(1)
            
            if(!valid){
                clearInterval(interval);
            }

            
        },6000);

        return()=>clearInterval(interval)
      },[valid])
    return(
        <View>
            <Button onPress={cancelBooking} title="Cancel Booking"/>
            <Text>Hi There</Text>
       </View>
    )
}