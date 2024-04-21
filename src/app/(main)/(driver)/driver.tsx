import { Link, useNavigation } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Dimensions, Pressable, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { ScrollView } from "react-native-virtualized-view";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "../../../constants/MapViewStyle.json";
import DriverMap from "@/src/components/DriverMap";
import axios from "axios";
import StartRide from "@/src/components/StartRide";
import NearbyPassengers from "@/src/components/NearbyPassengers";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import auth from "@react-native-firebase/auth"
import { StyleSheet } from "react-native";

export default function DriverScreen() {
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
      latitude: 0,
      longitude: 0,
    },
  });


  const [hasStartedRide, setHasStartedRide] = useState(false);

  const [currentLocation, setCurrentLocation] = useState({});

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleMnimizePress = () => bottomSheetRef.current?.snapToIndex(0);
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const snapPoints = useMemo(() => ["25%", "40%", "75%", "100%"], []);

  const [name, setName] = useState("Current Location");

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  async function putCurrentLocation() {
    let location = await Location.getCurrentPositionAsync({});

    setState({
      ...state,
      currentLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  }

  async function getCurrentLocation() {
    let location = await Location.getCurrentPositionAsync({});

    setState({
      ...state,
      currentLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  }

  function fetchDestination(data, details) {
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    setState({
      ...state,
      destinationCords: {
        latitude: lat,
        longitude: lng,
      },
    });
  }

  function hasStartedRidefun() {
    setHasStartedRide(true);
  }
  function hasStoppedRidefun() {
    setHasStartedRide(false);
    
  }

  const [fetchroute,setfetchroute] = useState(false);

  function fetchRoute(){
      setfetchroute(true);
  }


  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DriverMap
        latitude={state.destinationCords.latitude}
        longitude={state.destinationCords.longitude}
        fetchroute = {fetchroute}
        

      />
      <BottomSheet 
      ref={bottomSheetRef} 
      index={1} 
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor:'rgba(242, 242, 242, 0.9)'}}>
        <ScrollView
          style={{ backgroundColor: "rgba(242, 242, 242, 0.9)", flex: 1, padding:Dimensions.get('window').width*0.05 }}
          keyboardShouldPersistTaps="handled"
        >
          {!hasStartedRide && (
            <View>
            <View style={{ flex: 1 , alignItems: 'center', width: '95%', margin: 10, marginBottom: 25}}>
              <Text style={{alignItems: 'center', fontWeight:'500', fontSize:20, }}>Enter Destination</Text></View>
              <GooglePlacesAutocomplete
                placeholder={name}
                fetchDetails={true}
                onPress={(data, detail) => {
                  fetchDestination(data, detail);
                  bottomSheetRef.current?.snapToIndex(1);
                  setName(data.description);
                }}
                query={{
                  key: "AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg",
                  language: "en",
                }}
              />
              <View style={{ flex: 1 , alignItems: 'center', width: '95%',  margin: 10, marginTop: 25}}>
              <Pressable style={{backgroundColor: 'rgba(187, 255, 127, 0.9)', 
              borderWidth: 1,
              borderColor: 'rgba(210, 210, 210, 0.9)',
              width: Dimensions.get('window').width*0.45,
              alignItems:'center',
              height: Dimensions.get('window').height*0.05,
              borderRadius: 10,
              justifyContent: 'center',

              }} onPress={hasStartedRidefun} ><Text style={{fontSize: 20}}>Start</Text></Pressable>
            </View>
            </View>
          )}
          {hasStartedRide && (
            <NearbyPassengers
              hasStoppedRidefun={hasStoppedRidefun}
              destinationCoords={state.destinationCords}
              fetchRoute = {fetchRoute}
            />
          )}
        </ScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
const styles= StyleSheet.create({

})