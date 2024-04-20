
import { Button, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";



export default function StartRide(props){

    
    
    return(
        <View style={{flex:1}}>
            <GooglePlacesAutocomplete
          placeholder="Enter Your Destination"
          fetchDetails={true}
          onPress={props.fetchDestination}
          query={{
            key: "AIzaSyA4IGQAa3lWLh2jy1gRqEjybQ5aAqVDKcg",
            language: "en",
          }}
        />
        <Button title="Start" onPress={props.hasStartedRidefun}/>
        </View>
    )
}