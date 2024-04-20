
import { Stack } from "expo-router"


export default function AuthLayout (){
    return(
        <Stack>
            <Stack.Screen name="userProfile" options={{ headerShown: false }} />
            <Stack.Screen name="savedLocations" options={{ headerShown: false }} />
            <Stack.Screen name="previousRides" options={{ headerShown: false }} />
            <Stack.Screen name="about" options={{ headerShown: false }} />
        </Stack>
    )
}