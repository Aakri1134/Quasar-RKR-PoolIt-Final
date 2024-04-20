import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "../constants/MapViewStyle.json";
import MapViewDirections from "react-native-maps-directions";

export function MapPassenger(props){

    const {dropLat, dropLong, pickLat, pickLong}= props;
    const [state, setState] = useState({
    pickupCords: {
      latitude:pickLat,
      longitude:pickLong
    },
    droplocationCors: {
      latitude:dropLat,
      longitude:dropLong
    },
  });
  if(state.pickupCords.latitude!=pickLat && state.pickupCords.longitude!=pickLong){
    setState({
        ...state,pickupCords:{
            latitude: pickLat,
            longitude : pickLong
        }
    })
  }
  if(state.droplocationCors.latitude!=dropLat && state.droplocationCors.longitude!=dropLong){
    setState({
        ...state,droplocationCors:{
            latitude: dropLat,
            longitude : dropLong
        }
    })
  }

  const { pickupCords, droplocationCors } = state;

  const [currentLocation,setCurrentLocation] = useState({});

    const mapRef = useRef();
    console.log("pickup Map", pickLat,"    ", pickLong)
    console.log("Drop Map", dropLat,"    ", dropLong)
    return(
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: "75%", flex:1, }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapViewStyle}
          region={{
            latitude: pickLat,
            longitude: pickLong,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
            //   latitude: ,
                latitude: dropLat,
                // longitude: state.droplocationCors.longitude,
                longitude: dropLong,
            }}
          />
          <Marker
            coordinate={{
            //   latitude: ,
            latitude: pickLat,

            //   longitude: state.pickupCords.longitude,
            longitude: pickLong,
            }}
          />
          {dropLat!=0 && <MapViewDirections
            origin={pickupCords}
            destination={droplocationCors}
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