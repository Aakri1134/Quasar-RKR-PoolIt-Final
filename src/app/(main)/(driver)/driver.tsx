import { Link, useNavigation } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Text, View } from "react-native";
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
import Sos from "@/src/components/sos";

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
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "100%"], []);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DriverMap
        latitude={state.destinationCords.latitude}
        longitude={state.destinationCords.longitude}
      />
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <ScrollView
          style={{ backgroundColor: "white", flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {!hasStartedRide && (
            <View style={{ flex: 1 }}>
              <GooglePlacesAutocomplete
                placeholder={name}
                fetchDetails={true}
                onPress={(data, detail) => {
                  fetchDestination(data, detail);
                  setName(data.description);
                }}
                query={{
                  key: "AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg",
                  language: "en",
                }}
              />
              <Button title="Start" onPress={hasStartedRidefun} />
            </View>
          )}
          {hasStartedRide && (
            <NearbyPassengers
              hasStoppedRidefun={hasStoppedRidefun}
              destinationCoords={state.destinationCords}
            />
          )}
          <Sos />
        </ScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
