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

  useEffect(() => {}, [direction]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map />
      <BottomSheetWrapper>
        <BottomSheetTitle
          title='Nearest Stop: Student Centre'
          subtitle='Upcoming shuttles'
        />
        <BottomSheetBlock
          leftText='Shuttle Bus 1'
          rightText='1 min'
          clickable={true}
        />
        <BottomSheetBlock
          leftText='Shuttle Bus 2'
          rightText='Out of Order'
          clickable={true}
        />
        <BottomSheetBlock
          leftText='Shuttle Bus 3'
          rightText='Out of Order'
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
