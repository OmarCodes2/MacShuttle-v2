import { Marker } from 'react-native-maps';
import MarkerDefaultIcon from '../../assets/map/marker-default.svg';
import MarkerSelectedIcon from '../../assets/map/marker-selected.svg';
import MarkerMovingIcon from '../../assets/map/marker-moving.svg';
import { useMemo } from 'react';
import { markerType } from '@/constants/map/types';

const MapMarker = ({ latitude, longitude, type }) => {
  const markerIcon = useMemo(() => {
    switch (type) {
      case 'moving':
        return <MarkerMovingIcon width={35} height={35} />;
      case 'selected':
        return <MarkerSelectedIcon width={35} height={35} />;
      case 'default':
      default:
        return <MarkerDefaultIcon width={35} height={35} />;
    }
  }, [type]);

  return <Marker coordinate={{ latitude, longitude }}>{markerIcon}</Marker>;
};

export default MapMarker;
