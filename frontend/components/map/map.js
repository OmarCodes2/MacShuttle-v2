import React from 'react';
import MapView from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapMarker from './marker';
import { busStops } from '../../constants/map/location';
import useRegion from './useRegion';

const Map = ({ busData }) => {
  const { region, handleRegionChangeComplete } = useRegion();

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          minZoomLevel={12}
          showsUserLocation
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {busStops.map((busStop) => (
            <MapMarker
              key={busStop.stop}
              latitude={busStop.latitude}
              longitude={busStop.longitude}
            />
          ))}
          {busData.length > 0 && (
            <MapMarker
              latitude={busData[3]} // latitude of the bus
              longitude={busData[2]} // longitude of the bus
              type='moving'
            />
          )}
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
