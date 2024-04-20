
import { Stack } from "expo-router"
import { Button } from "react-native"


export default function AuthLayout (){
    return(
        <Stack>
            <Stack.Screen name="driver" options={{ headerShown: false }} />
            <Stack.Screen name="passengerFinder" options={{headerShown:false}}/>
            
        </Stack>
        
    )
}