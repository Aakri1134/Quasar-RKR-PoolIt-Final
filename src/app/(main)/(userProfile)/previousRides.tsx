import { Text, View } from "react-native";
// import auth from "@react-native-firebase/auth";
import { useState,useEffect } from "react";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";



export default function previousRides(){

    const [ rides , setrides] = useState([]);

    useEffect(()=>{
        axios.get("http://192.168.56.226:3000/previousrides").then((response)=>setrides(response.data)).catch((err)=>console.log)
    })

    // const fetchApi = async()=>{  
    // }   







}