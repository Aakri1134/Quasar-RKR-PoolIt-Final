import auth from "@react-native-firebase/auth"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { View ,Text} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "../constants/MapViewStyle.json";
import MapViewDirections from "react-native-maps-directions";

export function MapPassengerDynamic(props){
    const {picklat, picklong, droplat, droplong, pickupStatus}= props;
    console.log("Dynamic    ",picklat," ", picklong," ", droplat," ", droplong)

    const [uid, setUid] = useState("");
    useEffect(() => {
      auth()
      .onAuthStateChanged((user) => {
        if (user) {
          console.log("User ", user.uid);
          setUid(user.uid);
        }
      });
    }, []);

    const [driverLocation, setDriverLocation]= useState({
        latitude: 0,
        longitude: 0,
    })


    useEffect(() => {
        const interval = setInterval(async () => {
            await axios
            .post("http://192.168.56.226:3000/getupdatedlocation/", {
              uid: uid,
            }).then((r)=>{
                console.log(r.data);
                let m=Number(r.data.lat)
                let n=Number(r.data.long)
                
                setDriverLocation({
                    latitude: m,
                    longitude: n,
                })
            })
            console.log(1);
        }, 2000);
        return () => clearInterval(interval);
      });
    
    const mapRef = useRef();
    console.log(driverLocation)
    return(
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: "75%", flex:1, }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapViewStyle}
          region={{
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
            //   latitude: ,
                latitude: droplat,
                // longitude: state.droplocationCors.longitude,
                longitude: droplong,
            }}
          />
          <Marker
            coordinate={{
            //   latitude: ,
            latitude: picklat,

            //   longitude: state.pickupCords.longitude,
            longitude: picklong,
            }}
          />
          <Marker
          coordinate={{
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude
          }}/>
          {pickupStatus && <MapViewDirections
            origin={driverLocation}
            destination={{
                latitude: droplat,
                longitude: droplong
            }}
            apikey="AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg"
            strokeWidth={5}
            strokeColor="blue"
            optimizeWaypoints={true}
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: 30,
                  bottom: 250,
                  left: 30,
                  top: 100,
                },
              });
            }}
          />}
          {!pickupStatus && <MapViewDirections
            origin={driverLocation}
            destination={{
                latitude: picklat,
                longitude: picklong
            }}
            apikey="AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg"
            strokeWidth={5}
            strokeColor="blue"
            optimizeWaypoints={true}
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: 30,
                  bottom: 250,
                  left: 30,
                  top: 100,
                },
              });
            }}
          />}
        </MapView>
        
    )
}

