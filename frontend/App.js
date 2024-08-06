import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Map from './components/map/map';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetWrapper from './components/bottom-sheet/bottomSheetWrapper';
import BottomSheetTitle from './components/bottom-sheet/bottomSheetTitle';
import BottomSheetBlock from './components/bottom-sheet/bottomSheetBlock';
import MyShuttleButton from './components/buttons/myShuttleButton';
import BoardShuttleButton from './components/buttons/boardShuttleButton';
import { useFonts } from 'expo-font';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [startTime, setStartTime] = useState(null);
  const [runID, setRunID] = useState(null);
  const intervalRef = useRef(null);
  const directionRef = useRef(direction);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTracking = async () => {
    const retrieveID = `${process.env.EXPO_PUBLIC_API_URL}/startTracking`;
    try {
      const response = await axios.post(retrieveID);
      console.log('Retrieved RunID:', response.data.run_id);
      setRunID(response.data.run_id);
    } catch (error) {
      console.error('Error retrieving run ID:', error);
      return;
    }
    await Tracking();
  };

  const Tracking = () => {
    setTracking(true);
    const initialTime = Date.now();
    setStartTime(initialTime);
    intervalRef.current = setInterval(async () => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const { latitude, longitude } = currentLocation.coords;
      const timestamp = Date.now() - initialTime;

      const endpointUrl = `${process.env.EXPO_PUBLIC_API_URL}/liveTracking`;
      console.log(endpointUrl);
      console.log('latitude is', latitude);

      try {
        console.log(directionRef.current);
        await axios.post(endpointUrl, {
          latitude,
          longitude,
          timestamp,
          direction: directionRef.current,
        });
      } catch (error) {
        console.error('Error sending location data:', error);
      }
    }, 500);
  };

  const stopTracking = () => {
    setTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleDirection = () => {
    setDirection((prevDirection) => {
      const newDirection = prevDirection === 'forward' ? 'reverse' : 'forward';
      directionRef.current = newDirection;
      return newDirection;
    });
  };

  useEffect(() => {}, [direction]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map />
      <BottomSheetWrapper>
        <BottomSheetTitle
          title='Example Nearest Stop'
          subtitle='Upcoming shuttles'
        />
        <BottomSheetBlock
          leftText='Example Shuttle'
          rightText='1 min'
          clickable={true}
        />
        <BottomSheetBlock
          leftText='Example Shuttle'
          rightText='7 min'
          clickable={true}
        />
      </BottomSheetWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#000',
    margin: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
    margin: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 25,
    margin: 10,
    width: '80%',
    alignItems: 'center',
  },
  startStopButton: {
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
