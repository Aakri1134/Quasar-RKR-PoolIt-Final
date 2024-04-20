import { useEffect, useState } from "react";
import { Text } from "./Themed";
import axios from "axios";
import { Button, View } from "react-native";
import auth from "@react-native-firebase/auth";

   
export function FindingDrivers(props){


    const {cancBooking, bookingConf}= props


    const [uid, setUid]= useState("")
    useEffect(()=>{
        auth().onAuthStateChanged((user) => {
            if (user) {
              console.log('User ', user.uid);
              setUid(user.uid)
            }
        });
    },[])
    
    const confirmBooking = async ()=>{
        bookingConf()
        setFoundDriver(true)
        console.log("Ride Found Finding Drivers")
    }

    const [foundDriver, setFoundDriver]= useState(true)
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

    useEffect(()=>{
        const interval = setInterval( ()=>{
             axios.post("http://192.168.17.226:3000/ridecheck/",{
                uid: uid,
            })
            .then((r)=>{
                console.log("output",r.data)
                if(r.data){
                    confirmBooking()
                    clearInterval(interval)
                }else{
                    setFoundDriver(false)
                }
            if(!valid){
                clearInterval(interval)
            }
        })
            .catch((e)=>{console.log(e)})
            
        },5000);
   
        return()=>clearInterval(interval)
      },[valid])
    return(
        <View>
            <Button onPress={cancelBooking} title="Cancel Booking"/>
            <Text>{foundDriver}</Text>
       </View>
    )
}