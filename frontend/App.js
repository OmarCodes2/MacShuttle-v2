import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Map from './components/map/map';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetWrapper from './components/bottom-sheet/bottomSheetWrapper';
import BottomSheetTitle from './components/bottom-sheet/bottomSheetTitle';
import BottomSheetBlock from './components/bottom-sheet/bottomSheetBlock';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [busData, setBusData] = useState([]);
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [attempt, setAttempt] = useState(1);
  const ws = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();

    ws.current = new WebSocket(process.env.EXPO_PUBLIC_WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      const message = JSON.stringify({ type: 'subscribe', content: 'bus_updates' });
      ws.current.send(message);
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setBusData(data);
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket error: ', e.message);
    };

    ws.current.onclose = (e) => {
      console.log('WebSocket connection closed: ', e.code, e.reason);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      if (currentLocation) {
        try {
          const response = await fetch(
            `http://macshuttle-v2.onrender.com/get-bus-location?lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}`
          );
          const data = await response.json();
          console.log(`Attempt ${attempt}:`, data);
          setAttempt(prevAttempt => prevAttempt + 1);
        } catch (error) {
          console.error('Error fetching bus location:', error);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [attempt]);

  const handleShuttleSelect = (shuttle) => {
    setSelectedShuttle(shuttle);
  };

  const handleBack = () => {
    setSelectedShuttle(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map busData={busData} />
      <BottomSheetWrapper>
        {selectedShuttle ? (
          <View>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.stopText}>Student Centre Stop: {busData[1]} Minutes</Text>
            <Text style={styles.stopText}>ABB Stop: {busData[0]} Minutes</Text>
          </View>
        ) : (
          <>
            <BottomSheetTitle
              title="Nearest Stop: Student Centre"
              subtitle="Upcoming shuttles"
            />
            <BottomSheetBlock
              leftText="Shuttle Bus 1"
              rightText={`${busData[1]} min`}
              clickable={true}
              onPress={() => handleShuttleSelect('Shuttle Bus 1')}
            />
            <BottomSheetBlock
              leftText="Shuttle Bus 2"
              rightText="Out of Order"
              clickable={false}
            />
            <BottomSheetBlock
              leftText="Shuttle Bus 3"
              rightText="Out of Order"
              clickable={false}
            />
          </>
        )}
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
  backButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    color: '#fff',
  },
  stopText: {
    fontSize: 24,
    color: '#fff',
    margin: 20,
  },
});
