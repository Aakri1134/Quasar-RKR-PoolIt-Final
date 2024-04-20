import { useEffect, useState } from "react";
import { Text } from "./Themed";
import axios from "axios";
import { Button, View } from "react-native";
import auth from "@react-native-firebase/auth";

export function FindingDrivers(props) {
  const { cancBooking, bookingConf } = props;

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
    bookingConf();
    setFoundDriver(true);
    console.log("Ride Found Finding Drivers");
  };

  const [foundDriver, setFoundDriver] = useState(true);
  const [valid, setValidity] = useState(true);

  const cancelBooking = async () => {
    cancBooking();
    setValidity(false);
    console.log("Ride Cancelled Finding Drivers");
    await axios
      .post("http://192.168.56.226:3000/cancelride/", {
        uid: uid,
      })
      .then((r) => {
        console.log(r.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  async function ping(){
    axios
        .post("http://192.168.56.226:3000/ridecheck/", {
          uid: uid,
        })
        .then((r) => {
          console.log("output", r.data);
          if (r.data) {
            confirmBooking();
            
          } else {
            setFoundDriver(false);
          }
          if (!valid) {
            
          }
        })
        .catch((e) => {
          console.log(e);
        });
  }

  

  useEffect(() => {
    const interval = setInterval(() => { 
      ping();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View>
        <Button onPress={ping} title="system" />
      <Button onPress={cancelBooking} title="Cancel Booking" /> 
      <Text>{foundDriver}</Text>
    </View>
  );
}
