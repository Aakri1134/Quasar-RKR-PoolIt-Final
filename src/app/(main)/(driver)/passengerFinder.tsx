import { Link } from "expo-router";
import { Button, Text, View } from "react-native";
import axios from "axios";


export default function PassengerFinder(){



    return(
        <View style={{flex:1}}>
            <Text style={{color:"white"}}>Passenger Finder</Text>

            <Link href={"/driver"} asChild>
            <Button title="go back" />
            </Link>
        </View>
    )
}