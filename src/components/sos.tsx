import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { Linking } from 'react-native';

const SOSApp = () => {
  const [emergencyNumber, setEmergencyNumber] = useState('7484827755');
  const [sosMessage, setSOSMessage] = useState('Help! I am in an emergency.');

  const handleSOSPress = () => {
    const url = `tel:${emergencyNumber}`; // Format for phone call
    Linking.openURL(url); // Attempt to call emergency number
    alert(sosMessage); // Display SOS message
  };
//   const calling(()=>{
//     setEmergencyNumber("")
//   });

  return (
    <View>
      
      <TextInput
        value={sosMessage}
        onChangeText={setSOSMessage}
        multiline={true}
        numberOfLines={4}
        style={{ padding: 10, borderWidth: 1 }}
        placeholder='Your Message to Client'
      />
      <Button title="SOS" onPress={handleSOSPress} />
    </View>
  );
};

export default SOSApp;