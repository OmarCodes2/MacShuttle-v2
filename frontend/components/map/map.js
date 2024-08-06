import { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import MapMarker from './marker';
import { busStops } from '../../constants/map/location';

const DEFAULT_DELTA = 0.005;

const Map = () => {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const getInitialRegion = async () => {
      try {
        // request user perms for location tracking
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
        // use current location to set initial map region
        const location = await getCurrentPositionAsync({});
        if (location?.coords) {
          const { latitude, longitude } = location.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: DEFAULT_DELTA,
            longitudeDelta: DEFAULT_DELTA,
          });
        }
      } catch (e) {
        console.error('Failed to load initial region: ', e);
      }
    };

    getInitialRegion();
  }, []);

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          minZoomLevel={12}
          showsUserLocation
        >
          {busStops.map((busStop) => (
            <MapMarker
              key={busStop.stop}
              latitude={busStop.latitude}
              longitude={busStop.longitude}
            />
          ))}
        </MapView>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
