import { Button, Text, View, Dimensions, Modal, Alert } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import { FindingDrivers } from "./../../components/FindingDrivers";
import * as Location from "expo-location";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MapPassenger } from "@/src/components/MapPassenger";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { StyleSheet } from "react-native";
import { MapPassengerDynamic } from "@/src/components/MapPassengerDynamic";

export default function HomeScreen() {
  //true if Ride is booked & but driver may or may not be found
  const [validForBooking, setValidity] = useState(false);

  //true if Ride is booked & driver is found
  const [rideBooked, setBookingStatus] = useState(false);

  const [state, setState] = useState({
    pickupCords: {
      name: "Current Location",
      latitude: 0,
      longitude: 0,
    },
    droplocationCors: {
      name: "Enter Drop Off Location",
      latitude: 0,
      longitude: 0,
    },
  });

  const { pickupCords, droplocationCors } = state;

  const [currentLocation, setCurrentLocation] = useState({});

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleMnimizePress = () => bottomSheetRef.current?.snapToIndex(0);
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "100%"], []);

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  function fetchPickUp(data, details) {
    console.log("run");
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    console.log(lat, lng);
    if (state.droplocationCors.latitude != 0) {
      bottomSheetRef.current?.snapToIndex(0);
    }
    let nm3 = data.description;
    setState({
      ...state,
      pickupCords: {
        name: nm3,
        latitude: lat,
        longitude: lng,
      },
    });
  }

  const [pickupStatus, setPickupStatus]= useState(false)

  async function putCurrentLocation() {
    location = await Location.getCurrentPositionAsync({});

    // setCurrentLocation(location);

    // console.log("current location", currentLocation.coords);
    let nm1 = "Current Location";
    setState({
      ...state,
      pickupCords: {
        name: nm1,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
    });
  }
  let location;
  const assignCurrentLocation = useCallback(async () => {
    location = await Location.getCurrentPositionAsync({});
    console.log("burrr", location);

    setCurrentLocation(location);
    console.log("currr", currentLocation);

    let nm2 = state.pickupCords.name;

    // setState({
    //   ...state,
    //   pickupCords: {
    //     name: nm2,
    //     latitude: currentLocation.coords.latitude,
    //     longitude: currentLocation.coords.longitude,
    //   },
    // });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      assignCurrentLocation();
    }, 1000);
  }, [assignCurrentLocation]);

  function fetchDrop(data, details) {
    console.log("data", data);
    console.log("details", details);
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    console.log(lat, lng);
    bottomSheetRef.current?.snapToIndex(0);
    let nm4 = data.description;
    console.log(nm4);
    setState({
      ...state,
      droplocationCors: {
        name: nm4,
        latitude: lat,
        longitude: lng,
      },
    });
  }

  // console.log("pickupcords", pickupCords);
  // console.log("dropcords", droplocationCors);
  // console.log("cu", currentLocation);

  //--------------------------------------------------------For Finding Drivers--------------------------------------------------------------
  const [uid, setUid] = useState("");
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User ", user.uid);
        setUid(user.uid);
      }
    });
  }, []);

  const confirmBooking = async () => {
    if (state.droplocationCors.name == "Enter Drop Off Location") {
      Alert.alert("Error", "Enter Destination", [
        {
          text: "Ok ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    } else {
      setValidity(true);
      Alert.alert("Nice", "Ride Booked", [
        {
          text: "Ok",
          onPress: () => console.log(""),
          style: "cancel",
        },
      ]);
      console.log(
        "latitude",
        state.pickupCords.latitude == 0
          ? Object.keys(currentLocation).length > 0
            ? currentLocation.coords.latitude
            : 0
          : state.pickupCords.latitude
      );
      console.log(
        "longitude",
        state.pickupCords.longitude == 0
          ? Object.keys(currentLocation).length > 0
            ? currentLocation.coords.longitude
            : 0
          : state.pickupCords.longitude
      );
      console.log("destlat", state.droplocationCors.longitude);
      console.log("destlong", state.droplocationCors.longitude);
      await axios
        .post("http://192.168.56.226:3000/getdriver/", {
          latitude:
            state.pickupCords.latitude == 0
              ? Object.keys(currentLocation).length > 0
                ? currentLocation.coords.latitude
                : 0
              : state.pickupCords.latitude,
          longitude:
            state.pickupCords.longitude == 0
              ? Object.keys(currentLocation).length > 0
                ? currentLocation.coords.longitude
                : 0
              : state.pickupCords.longitude,
          lat: state.droplocationCors.latitude,
          long: state.droplocationCors.longitude,
          uid: uid,
        })
        .then((r: { data: any }) => {
          console.log(r.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const cancBooking = async () => {
    console.log("Ride Cancelled Home");
    setValidity(false);
  };

  //-------------------------------------------------------------after ride confirmed---------------------------------------------------------------------------------

  const [driverInfo, setDriverInfo]= useState({
    name:"",
    phoneNumber:0,
    picklat: 0,
    picklong: 0,
    droplat:0,
    droplong:0,
  });

  const bookingConf = async () => {
    console.log("Ride Confirmed home");

    await axios.post("http://192.168.56.226:3000/fetchdriver/", {
          uid: uid,
        }).then((r)=>{
          console.log("lllla",r.data);
          let m1=r.data[1].first_name+ " " +r.data[1].last_name
          let m2=Number(r.data[1].phone)
          let m3=Number( r.data[0].pass_curlat)
          let m4=Number(r.data[0].pass_curlong)
          let m5=Number(r.data[0].pass_destlat)
          let m6=Number(r.data[0].pass_destlong)

          console.log(m1," ",m2," ",m3," ",m4," ",m5," ",m6);
          assign(m1,m2,m3,m4,m5,m6)
          
          console.log("pp", driverInfo)

          setBookingStatus(true)
          console.log('gg')
        })
  };

function assign(m1,m2,m3,m4,m5,m6){
  console.log(m1," ",m2," ",m3," ",m4," ",m5," ",m6);
  setDriverInfo({
    name:m1 ,
    phoneNumber: m2,
    picklat:m3,
    picklong:m4 ,
    droplat:m5,
    droplong:m6,
  })
  console.log("pppp", driverInfo)
}

function pickupstatus(){
  setPickupStatus(true)
}
const [dropStatus, setDropStatus]= useState(false)
function dropstatus(){
  setDropStatus(true);
  setBookingStatus(false)
  setValidity(false)
}

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!rideBooked && (<MapPassenger
        dropLat={state.droplocationCors.latitude}
        dropLong={state.droplocationCors.longitude}
        pickLat={
          state.pickupCords.latitude == 0
            ? Object.keys(currentLocation).length > 0
              ? currentLocation.coords.latitude
              : 0
            : state.pickupCords.latitude
        }
        pickLong={
          state.pickupCords.longitude == 0
            ? Object.keys(currentLocation).length > 0
              ? currentLocation.coords.longitude
              : 0
            : state.pickupCords.longitude
        }
      />)}

      {!validForBooking && !rideBooked && (
        <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints} 
        handleIndicatorStyle={{backgroundColor: 'rgba(160, 160, 160, 1)'}}
        backgroundStyle={{backgroundColor: 'rgba(209, 209, 209, 1)'}}>
          <ScrollView
            style={{ backgroundColor: "rgba(209, 209, 209, 1)" }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
            <View>
            <Text style={styles.lableInputField}>Enter Pickup Location</Text>
            <GooglePlacesAutocomplete
              placeholder={state.pickupCords.name}
              fetchDetails={true}
              onPress={fetchPickUp}
              query={{
                key: "AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg",
                language: "en",
              }}
            />
            <Button title="use current location" onPress={putCurrentLocation} />
            </View>
            <Text style={styles.lableInputField}>Enter Drop Location</Text>
            <GooglePlacesAutocomplete
              placeholder={state.droplocationCors.name}
              fetchDetails={true}
              onPress={fetchDrop}
              query={{
                key: "AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg",
                language: "en",
              }}
            />
            
            <Button onPress={confirmBooking} title="Confirm Booking" />
            </View>
          </ScrollView>
        </BottomSheet>
      )}
      {rideBooked && (<MapPassengerDynamic
        picklat={driverInfo.picklat}
        picklong={driverInfo.picklong}
        droplat={driverInfo.droplat}
        droplong={driverInfo.droplong}
        pickupStatus={pickupStatus}
       />)}
      {validForBooking && !rideBooked && (
        <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints} style={{}}>
          <ScrollView>
            <Text>Finding Drivers</Text>

            <FindingDrivers
              cancBooking={cancBooking}
              bookingConf={bookingConf}
            />
          </ScrollView>
        </BottomSheet>
      )}
      {validForBooking && rideBooked && (
        <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
          <ScrollView>
            <Text>Driver Name= {driverInfo.name}</Text>
            <Text>Driver Phone Number= {driverInfo.phoneNumber}</Text>
            {!pickupStatus && <Button onPress={pickupstatus} title="Confirm Pickup"/>}
            {pickupStatus && <Button onPress={dropstatus} title="Confirm Drop off"/>}
          </ScrollView>
        </BottomSheet>
      )}
      {/* <Button title="close" onPress={handleClosePress}/>
        <Button title="open" onPress={handleOpenPress}/> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {

  },
  lableInputField: {
    color: "blue",
  },
});
