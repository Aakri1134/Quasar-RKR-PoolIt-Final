import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "../constants/MapViewStyle.json";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import { Button, View } from "react-native";
import auth from "@react-native-firebase/auth"

export default function DriverMap(props) {
  const [state, setState] = useState({
    currentLocation: {
      name:"Current Location",
      latitude: 0,
      longitude: 0,
    },
    passenger1Cords: {
      pickupCords: {
        latitude: 0,
        longitude: 0,
      },
      destinationCords: {
        latitude: 0,
        longitude: 0,
      },
    },
    passenger2Cords: {
      pickupCords: {
        latitude: 0,
        longitude: 0,
      },
      destinationCords: {
        latitude: 0,
        longitude: 0,
      },
    },
    passenger3Cords: {
      pickupCords: {
        latitude: 0,
        longitude: 0,
      },
      destinationCords: {
        latitude: 0,
        longitude: 0,
      },
    },
    destinationCords: {
      latitude: 0,
      longitude: 0,
    },
  });

  const mapRef = useRef();

  async function getCurrentLocation() {
    let location = await Location.getCurrentPositionAsync({});

    setState({
      ...state,
      currentLocation: {
        name : "system",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  }

  const [uid, setUid] = useState("");

  auth().onAuthStateChanged((user)=>{
      if(user){
        setUid(user.uid);
      }
  })


  async function sendCurrentLocation(){
    await axios.post("http://192.168.56.226:3000/updatedriverlocation",{
      uid : uid,
      lat : state.currentLocation.latitude,
      long : state.currentLocation.longitude
    })
    .then((e)=>{console.log(e.data)})
    .catch((e)=>{console.log(e)})
  }

  //-----------------------------------------------for current location--------------------------------------------------
  const [presentLocation, setPresentLocation] = useState({});
  let location;
  const assignCurrentLocation = useCallback(async () => {
    location = await Location.getCurrentPositionAsync({});
    

    setPresentLocation(location);
    

    let nm2 = state.currentLocation.name;

    setState({
      ...state,
      currentLocation: {
        name: nm2,
        latitude: presentLocation.coords.latitude,
        longitude: presentLocation.coords.longitude,
      },
    });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      assignCurrentLocation();
    }, 1000);
  }, [assignCurrentLocation]);

  const [fetchPassengersrepeat, setfetchPassengersrepeat] = useState(false);


  useEffect(() => {
    const interval = setInterval(async () => {
      getCurrentLocation();
      sendCurrentLocation();
      if(fetchPassengersrepeat){
        fetchPassengers();
        if(props.fetchroute){
          console.log("system bhaita diya hai");
       }
      }
    }, 4000);
    return () => clearInterval(interval);
  });

  async function fetchPassengers() {
    console.log("pp");
    await axios
      .post("http://192.168.56.226:3000/getpassenger/", {
        latitude: state.currentLocation.latitude,
        longitude: state.currentLocation.longitude,
        lat: props.latitude,
        long: props.longitude,
      })
      .then((r) => {
        console.log(JSON.stringify(r.data), r.data);
      })
      .catch((e) => {
        console.log(e);
      });   
  }

  async function getRouteInfo(){
    await axios.post("http://192.168.56.226:3000/getallpassenger",{
      uid : "OB3u3CFHbEds8eMb4iRoyCthnrh1"
    })
    .then((r)=>{
      console.log(r.data)

      if(r.data.length == 1){

        let m1 = Number(r.data[0].pass_curlat)
        let m2 = Number(r.data[0].pass_curlong)
        let m3 = Number(r.data[0].pass_destlat)
        let m4 = Number(r.data[0].pass_destlong)

        setState({
          ...state,
          passenger1Cords : {
            pickupCords : {
              latitude : m1,
              longitude : m2
            },
            destinationCords : {
              latitude : m3,
              longitude : m4
            }
          }
        })
      }
      if(r.data.length == 2){

        let m1 = Number(r.data[0].pass_curlat)
        let m2 = Number(r.data[0].pass_curlong)
        let m3 = Number(r.data[0].pass_destlat)
        let m4 = Number(r.data[0].pass_destlong)
        let m5 = Number(r.data[1].pass_curlat)
        let m6 = Number(r.data[1].pass_curlong)
        let m7 = Number(r.data[1].pass_destlat)
        let m8 = Number(r.data[1].pass_destlong)
         

        setState({
          ...state,
          passenger1Cords : {
            pickupCords : {
              latitude : m1,
              longitude : m2
            },
            destinationCords : {
              latitude : m3,
              longitude : m4
            }
          },
          passenger2Cords : {
            pickupCords : {
              latitude : m5,
              longitude : m6
            },
            destinationCords : {
              latitude : m7,
              longitude : m8
            }
          }

        })
      }
      if(r.data.length == 3){

        let m1 = Number(r.data[0].pass_curlat)
        let m2 = Number(r.data[0].pass_curlong)
        let m3 = Number(r.data[0].pass_destlat)
        let m4 = Number(r.data[0].pass_destlong)
        let m5 = Number(r.data[1].pass_curlat)
        let m6 = Number(r.data[1].pass_curlong)
        let m7 = Number(r.data[1].pass_destlat)
        let m8 = Number(r.data[1].pass_destlong)
        let m9 = Number(r.data[2].pass_curlat)
        let m10 = Number(r.data[2].pass_curlong)
        let m11 = Number(r.data[2].pass_destlat)
        let m12 = Number(r.data[2].pass_destlong)


        setState({
          ...state,
          passenger1Cords : {
            pickupCords : {
              latitude : m1,
              longitude : m2
            },
            destinationCords : {
              latitude : m3,
              longitude : m4
            }
          },
          passenger2Cords : {
            pickupCords : {
              latitude : m5,
              longitude : m6
            },
            destinationCords : {
              latitude : m7,
              longitude : m8
            }
          },
          passenger3Cords : {
            pickupCords : {
              latitude : m9,
              longitude : m10
            },
            destinationCords : {
              latitude : m11,
              longitude : m12
            }
          }
        })
      }
    })
    .catch((e)=>{console.log(e)})
  }

  return (
    <View style={{ flex: 1, marginTop:40 }}>
      <Button title="get info" onPress={getRouteInfo} color={'rgba(187, 255, 127, 0.9)' } />
      <MapView
        style={{ width: "100%", height: "100%", flex: 1 }}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: state.currentLocation.latitude == 0
          ? Object.keys(presentLocation).length > 0
            ? presentLocation.coords.latitude
            : 0
          : state.currentLocation.latitude,
          longitude: state.currentLocation.longitude == 0
          ? Object.keys(presentLocation).length > 0
            ? presentLocation.coords.longitude
            : 0
          : state.currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        customMapStyle={MapViewStyle}
      >
        {/*  */}
        <Marker
          coordinate={{
            latitude: state.currentLocation.latitude,
            longitude: state.currentLocation.longitude,
          }}
        />
        {state.passenger1Cords.pickupCords.latitude != 0 ?<Marker
          coordinate={{
            latitude : state.passenger1Cords.pickupCords.latitude,
            longitude : state.passenger1Cords.pickupCords.longitude
          }}
        
        /> : null}
        {/* passenger 1 coords */}
        {state.passenger1Cords.pickupCords.latitude != 0 ? <Marker
          coordinate={{
            latitude : state.passenger1Cords.destinationCords.latitude,
            longitude : state.passenger1Cords.destinationCords.longitude
          }}
        
        /> : null}
        {state.passenger1Cords.pickupCords.latitude !=0 ?<Marker
          coordinate={{
            latitude : state.passenger2Cords.pickupCords.latitude,
            longitude : state.passenger2Cords.pickupCords.longitude
          }}
        
        /> : null}
        {/* passenger 2 coords */}
        {state.passenger1Cords.pickupCords.latitude != 0 ? <Marker
          coordinate={{
            latitude : state.passenger2Cords.destinationCords.latitude,
            longitude : state.passenger2Cords.destinationCords.longitude
          }}
        
        /> : null}
        {state.passenger1Cords.pickupCords.latitude != 0 ?<Marker
          coordinate={{
            latitude : state.passenger3Cords.pickupCords.latitude,
            longitude : state.passenger3Cords.pickupCords.longitude
          }}
        
        /> : null}
        {/* passenger 3 coords */}
       {state.passenger1Cords.pickupCords.latitude !=0 ? <Marker
          coordinate={{
            latitude : state.passenger3Cords.destinationCords.latitude,
            longitude : state.passenger3Cords.destinationCords.longitude
          }}
        
        /> : null}
         <Marker
          coordinate={{
            latitude: props.latitude,
            longitude: props.longitude,
          }}
        />
        
        <MapViewDirections
          origin={state.currentLocation}
          destination={{
            latitude: props.latitude,
            longitude: props.longitude,
          }}
          apikey="AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg"
          strokeWidth={5}
          strokeColor="blue"
          optimizeWaypoints={true}
          
          onReady={(result) => {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 30,
                bottom: 300,
                left: 30,
                top: 300,
              },
            });
          }}
        />
        
      </MapView>
      
    </View>
  );
}
