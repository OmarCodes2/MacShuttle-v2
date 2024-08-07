import { useEffect, useState } from 'react';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';

const DEFAULT_DELTA = 0.005;
const MIN_LATITUDE = 43.25916296633657 - 0.015;
const MAX_LATITUDE = 43.25916296633657 + 0.015;
const MIN_LONGITUDE = -79.92258248850703 - 0.01;
const MAX_LONGITUDE = -79.92258248850703 + 0.01;

const useRegion = () => {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const getInitialRegion = async () => {
      try {
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
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

  const handleRegionChangeComplete = (newRegion) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = newRegion;

    const constrainedLatitude = Math.max(Math.min(latitude, MAX_LATITUDE), MIN_LATITUDE);
    const constrainedLongitude = Math.max(Math.min(longitude, MAX_LONGITUDE), MIN_LONGITUDE);

    setRegion({
      latitude: constrainedLatitude,
      longitude: constrainedLongitude,
      latitudeDelta,
      longitudeDelta,
    });
  };

  return { region, handleRegionChangeComplete };
};

export default useRegion;
