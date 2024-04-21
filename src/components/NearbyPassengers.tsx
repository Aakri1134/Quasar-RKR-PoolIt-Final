import axios from "axios";
import { Alert, Button, Dimensions, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

export default function NearbyPassengers(props) {
  const [state, setState] = useState({
    currentLocation: {
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
      latitude: props.destinationCoords.latitude,
      longitude: props.destinationCoords.longitude,
    },
  });

  const [passengerinfo, setPassengerinfo] = useState([]);

  const arr = [0, 1, 2, 3];

  async function getCurrentLocation() {
    let location = await Location.getCurrentPositionAsync({});

    console.log("got current location");
    setState({
      ...state,
      currentLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      getCurrentLocation();
      fetchPassengers();
    }, 4000);
    return () => clearInterval(interval);
  });

  async function fetchPassengers() {
    console.log("sent");
    await axios
      .post("http://192.168.56.226:3000/getpassenger/", {
        latitude: state.currentLocation.latitude,
        longitude: state.currentLocation.longitude,
        lat: state.destinationCords.latitude,
        long: state.destinationCords.longitude,
      })
      .then((r) => {
        console.log(r.data);
        console.log(JSON.stringify(r.data));
        setPassengerinfo(r.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const [driveruid, setDriveruid] = useState("");

  auth().onAuthStateChanged((user) => {
    if (user) {
      setDriveruid(user.uid);
      console.log("User email: ", user.uid);
    }
  });

  const [rideConfirm, setRideConfirm] = useState(false);

  const [confirmedpassengerinfo, setconfirmedpassengerinfo] = useState({
    passenger1info : [],
    passenger2info : [],
    passenger3info : []

  });

  const [passenger1complete, setpassenger1complete] = useState(false);

  async function completeRide(){
    console.log(driveruid);  
    await axios.post("http://192.168.56.226:3000/ridecompletion/",{
      driveruid : driveruid,
      rideruid : confirmedpassengerinfo.passenger1info[4]
    })
    .then((r)=>{
      console.log(r.data)
      setpassenger1complete(true);
    }
     

  )
    .catch((e)=>{console.log(e)})

  }

  return (
    <View style={{ flex: 1 }}>
      { <ScrollView style={{ flex: 1, backgroundColor:'rgba(242, 242, 242, 0.9)' }}>
        {passengerinfo.length == 0 || passengerinfo == undefined ? (
          <Text>Searching...</Text>
        ) : (
          passengerinfo.map((e) => (
            <View key={e[0][0].id}
            style={{backgroundColor:'white',
             borderRadius: 20, borderWidth:1,
              borderColor:'rgba(156, 156, 156, 0.9)',
              padding: 10,
              marginBottom: 20,
              }}>
              <Text style={{ color: "black" }}>{e[0][0].first_name} {e[0][0].last_name}</Text>
              <Text style={{ color: "black" }}>{e[0][0].phone}</Text>
              <Text style={{ color: "black" }}>ETA: {e[0][1].duration.text}</Text>
              <Text style={{ color: "black" }}>Approx Distance: {e[0][1].distance.text}</Text>
              <Pressable
              style={{
                alignItems:'center',
                backgroundColor: 'rgba(187, 255, 127, 0.9)'
              }}
                onPress={async () => {
                  console.log("sent2");
                  props.fetchRoute();
                  await axios
                    .post("http://192.168.56.226:3000/rideconfirmation/", {
                      driveruid: driveruid,
                      passuid: e[0][0].uid,
                      drivercurlat: state.currentLocation.latitude,
                      drivercurlong: state.currentLocation.longitude,
                      driverdestlat: state.destinationCords.latitude,
                      driverdestlong: state.destinationCords.longitude,
                    })
                    .then((r) => {
                      
                      console.log(r.data);
                      console.log(JSON.stringify(r.data));
                      if(confirmedpassengerinfo.passenger1info.length == 0){
                        console.log("sus");
                        let m1 = r.data
                        setconfirmedpassengerinfo({
                          ...confirmedpassengerinfo, passenger1info : m1
                        });
                      } else if (confirmedpassengerinfo.passenger2info.length == 0){
                        let m2 = r.data
                        setconfirmedpassengerinfo({
                          ...confirmedpassengerinfo, passenger2info : m2
                        })
                      } else if (confirmedpassengerinfo.passenger3info.length == 0){
                        let m3 = r.data
                        setconfirmedpassengerinfo({
                          ...confirmedpassengerinfo, passenger3info : m3
                        })
                      }
                      
                      setRideConfirm(true);
                      
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
              ><Text>Confirm Ride</Text></Pressable>
            </View>
          ))
        )}
        <View style={{ flex: 1 , alignItems: 'center', width: '95%',  margin: 10, marginTop: 25}}>
              <Pressable style={{backgroundColor: 'rgba(187, 255, 127, 0.9)', 
              borderWidth: 1,
              borderColor: 'rgba(210, 210, 210, 0.9)',
              width: Dimensions.get('window').width*0.45,
              alignItems:'center',
              height: Dimensions.get('window').height*0.05,
              borderRadius: 10,
              justifyContent: 'center',

              }} onPress={fetchPassengers} ><Text style={{fontSize: 20}}>Search</Text></Pressable></View>
              <View style={{ flex: 1 , alignItems: 'center', width: '95%',  margin: 10, marginTop: 25}}>
              <Pressable style={{backgroundColor: 'rgba(187, 255, 127, 0.9)', 
              borderWidth: 1,
              borderColor: 'rgba(210, 210, 210, 0.9)',
              width: Dimensions.get('window').width*0.55,
              alignItems:'center',
              height: Dimensions.get('window').height*0.05,
              borderRadius: 10,
              justifyContent: 'center',

              }} onPress={props.hasStoppedRidefun} ><Text style={{fontSize: 20}}>Stop Searching</Text></Pressable></View>
   

      </ScrollView>}
      {confirmedpassengerinfo.passenger1info.length > 0 && !passenger1complete && <ScrollView>
        <View
        style={{backgroundColor:'white',
        borderRadius: 20, borderWidth:1,
         borderColor:'rgba(156, 156, 156, 0.9)',
         padding: 10,
         }}>
        <Text>Name : {confirmedpassengerinfo.passenger1info[0].first_name} {confirmedpassengerinfo.passenger1info[1].last_name}</Text>
        <Text>Phone Number : {confirmedpassengerinfo.passenger1info[3].phone}</Text>
        </View>
        <View style={{ flex: 1 , alignItems: 'center', width: '95%',  margin: 10, marginTop: 25}}>
              <Pressable style={{backgroundColor: 'rgba(187, 255, 127, 0.9)', 
              borderWidth: 1,
              borderColor: 'rgba(210, 210, 210, 0.9)',
              width: Dimensions.get('window').width*0.45,
              alignItems:'center',
              height: Dimensions.get('window').height*0.05,
              borderRadius: 10,
              justifyContent: 'center',

              }} onPress={completeRide} ><Text style={{fontSize: 20}}>Complete Rides</Text></Pressable></View>
        
      </ScrollView>}
      {confirmedpassengerinfo.passenger2info.length > 0 && <ScrollView>
        <View
        style={{backgroundColor:'white',
        borderRadius: 20, borderWidth:1,
         borderColor:'rgba(156, 156, 156, 0.9)',
         padding: 10,
         }}>
        <Text>Name : {confirmedpassengerinfo.passenger2info[0].first_name} {confirmedpassengerinfo.passenger2info[1].last_name}</Text>
        <Text>Phone Number : {confirmedpassengerinfo.passenger2info[3].phone}</Text>
        </View>
        <View style={{ flex: 1 , alignItems: 'center', width: '95%',  margin: 10, marginTop: 25}}>
              <Pressable style={{backgroundColor: 'rgba(187, 255, 127, 0.9)', 
              borderWidth: 1,
              borderColor: 'rgba(210, 210, 210, 0.9)',
              width: Dimensions.get('window').width*0.45,
              alignItems:'center',
              height: Dimensions.get('window').height*0.05,
              borderRadius: 10,
              justifyContent: 'center',

              }} onPress={completeRide} ><Text style={{fontSize: 20}}>Complete Rides</Text></Pressable></View>
        
      </ScrollView> }
      {confirmedpassengerinfo.passenger3info.length > 0 && <ScrollView>
        <View
        style={{backgroundColor:'white',
        borderRadius: 20, borderWidth:1,
         borderColor:'rgba(156, 156, 156, 0.9)',
         padding: 10,
         }}>
        <Text>Name : {confirmedpassengerinfo.passenger3info[0].first_name} {confirmedpassengerinfo.passenger3info[1].last_name}</Text>
        <Text>Phone Number : {confirmedpassengerinfo.passenger3info[3].phone}</Text>
        </View>
        <View style={{ flex: 1 , alignItems: 'center', width: '95%',  margin: 10, marginTop: 25}}>
              <Pressable style={{backgroundColor: 'rgba(187, 255, 127, 0.9)', 
              borderWidth: 1,
              borderColor: 'rgba(210, 210, 210, 0.9)',
              width: Dimensions.get('window').width*0.45,
              alignItems:'center',
              height: Dimensions.get('window').height*0.05,
              borderRadius: 10,
              justifyContent: 'center',

              }} onPress={completeRide} ><Text style={{fontSize: 20}}>Complete Rides</Text></Pressable></View>
      </ScrollView> }
      <View style={{ flex: 1 , alignItems: 'center', width: '95%',  margin: 10, marginTop: 25}}>
              <Pressable style={{backgroundColor: 'rgba(187, 255, 127, 0.9)', 
              borderWidth: 1,
              borderColor: 'rgba(210, 210, 210, 0.9)',
              width: Dimensions.get('window').width*0.45,
              alignItems:'center',
              height: Dimensions.get('window').height*0.05,
              borderRadius: 10,
              justifyContent: 'center',

              }} onPress={props.hasStoppedRidefun} ><Text style={{fontSize: 20}}>Complete All Rides</Text></Pressable></View>
      
    </View>
  );
}
