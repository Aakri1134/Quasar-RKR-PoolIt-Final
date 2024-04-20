import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "../constants/MapViewStyle.json";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import { Button, View } from "react-native";

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
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  }

  //-----------------------------------------------for current location--------------------------------------------------
  const [presentLocation, setPresentLocation] = useState({});
  let location;
  const assignCurrentLocation = useCallback(async () => {
    location = await Location.getCurrentPositionAsync({});
    console.log("durrr", location);

    setPresentLocation(location);
    console.log("purrr", presentLocation);

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


  useEffect(() => {
    const interval = setInterval(async () => {
      getCurrentLocation();
      console.log(1);
    }, 4000);
    return () => clearInterval(interval);
  });

  async function fetchPassengers() {
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
  console.log("cu", state.currentLocation);
  console.log("pr", presentLocation);
  return (
    <View style={{ flex: 1 }}>
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
        <Marker
          coordinate={{
            latitude: state.currentLocation.latitude,
            longitude: state.currentLocation.longitude,
          }}
        />
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
