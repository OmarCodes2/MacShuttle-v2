import React, { useState, useEffect, useRef, useMemo } from "react"
import * as Location from "expo-location"
import Map from "./components/map/map"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import UpcomingShuttlesSheet from "./components/upcomingShuttles"
import UpcomingStopsSheet from "./components/upcomingStops"
import CloseButton from "./components/buttons/closeButton"
import MyShuttleButton from "./components/buttons/myShuttleButton"
import { busStops } from "./constants/map/location"

// --- PASTE THIS INSIDE App.js, ABOVE THE COMPONENT ---
const ReferenceMap = [
  // forward route: A -> B
  { Longitude: -79.9219256, Latitude: 43.2601414, Direction: "forward", TimeStamp: 0 }, // A
  { Longitude: -79.9209266, Latitude: 43.2601393, Direction: "forward", TimeStamp: 22019 },
  { Longitude: -79.9190291, Latitude: 43.2597076, Direction: "forward", TimeStamp: 71957 },
  { Longitude: -79.9190397, Latitude: 43.2585466, Direction: "forward", TimeStamp: 91927 },
  { Longitude: -79.9180279, Latitude: 43.2578761, Direction: "forward", TimeStamp: 111765 },
  { Longitude: -79.9159219, Latitude: 43.2590493, Direction: "forward", TimeStamp: 141781 },
  { Longitude: -79.9158942, Latitude: 43.2607345, Direction: "forward", TimeStamp: 161717 },
  { Longitude: -79.916043,  Latitude: 43.261486,  Direction: "forward", TimeStamp: 171701 },
  { Longitude: -79.9165057, Latitude: 43.262646,  Direction: "forward", TimeStamp: 201761 },
  { Longitude: -79.9163497, Latitude: 43.2634842, Direction: "forward", TimeStamp: 222013 },
  { Longitude: -79.9166429, Latitude: 43.2632088, Direction: "forward", TimeStamp: 251973 }, // B
  // reverse route: B -> A
  { Longitude: -79.9166429, Latitude: 43.2632088, Direction: "reverse", TimeStamp: 251973 }, // B
  { Longitude: -79.9168373, Latitude: 43.2623833, Direction: "reverse", TimeStamp: 291853 },
  { Longitude: -79.9158826, Latitude: 43.2614362, Direction: "reverse", TimeStamp: 322038 },
  { Longitude: -79.9159878, Latitude: 43.2602883, Direction: "reverse", TimeStamp: 331970 },
  { Longitude: -79.915909,  Latitude: 43.2589812, Direction: "reverse", TimeStamp: 351936 },
  { Longitude: -79.9173126, Latitude: 43.2580618, Direction: "reverse", TimeStamp: 372088 },
  { Longitude: -79.9183927, Latitude: 43.2583166, Direction: "reverse", TimeStamp: 381971 },
  { Longitude: -79.9190962, Latitude: 43.259267,  Direction: "reverse", TimeStamp: 402035 },
  { Longitude: -79.9193478, Latitude: 43.2600841, Direction: "reverse", TimeStamp: 422045 },
  { Longitude: -79.9210478, Latitude: 43.2600492, Direction: "reverse", TimeStamp: 445502 },
  { Longitude: -79.9219256, Latitude: 43.2601414, Direction: "reverse", TimeStamp: 457254 }, // A
];

// This transforms your route data into [0, 1] so you can interpolate easily
function getTotalDuration() {
  // The final timestamp in ReferenceMap minus the initial one
  return ReferenceMap[ReferenceMap.length - 1].TimeStamp - ReferenceMap[0].TimeStamp;
}
const totalDuration = getTotalDuration();

/**
 * Given a time t (0 <= t <= totalDuration), returns {latitude, longitude} for that time
 * by interpolating between the appropriate route points.
 */
function getPositionAtTime(t) {
  // If time loops beyond totalDuration, wrap it around
  const loopedTime = t % totalDuration;

  // Find indices of ReferenceMap that bracket loopedTime
  let i = 0;
  for (; i < ReferenceMap.length - 1; i++) {
    if (
      ReferenceMap[i].TimeStamp <= loopedTime &&
      ReferenceMap[i + 1].TimeStamp >= loopedTime
    ) {
      break;
    }
  }

  const start = ReferenceMap[i];
  const end = ReferenceMap[i + 1] || start;

  // If these two points happen to have the same TimeStamp, just return it
  if (end.TimeStamp === start.TimeStamp) {
    return { latitude: start.Latitude, longitude: start.Longitude };
  }

  // Linear interpolation factor
  const ratio =
    (loopedTime - start.TimeStamp) / (end.TimeStamp - start.TimeStamp);

  const lat = start.Latitude + ratio * (end.Latitude - start.Latitude);
  const lng = start.Longitude + ratio * (end.Longitude - start.Longitude);

  return { latitude: lat, longitude: lng };
}

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Keep existing busData for your real-time WebSocket updates
  const [busData, setBusData] = useState([]);

  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [boardedShuttle, setBoardedShuttle] = useState(null);
  const ws = useRef(null);

  // ---------------------------
  // New Dummy Buses Hook
  // ---------------------------
  const [dummyTime, setDummyTime] = useState(0);
  const [dummyBusPositions, setDummyBusPositions] = useState([
    { latitude: ReferenceMap[0].Latitude, longitude: ReferenceMap[0].Longitude },
    { latitude: ReferenceMap[0].Latitude, longitude: ReferenceMap[0].Longitude },
  ]);

  // This effect increments dummyTime every half second (or whatever interval you want).
  useEffect(() => {
    const interval = setInterval(() => {
      setDummyTime((prev) => prev + 1000); // increment by 1000 ms
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // This effect calculates each bus’s position from the new dummyTime.
  useEffect(() => {
    // For demonstration, both buses can simply use the same time offset
    // OR you can stagger them by adding an offset to one of them.
    const bus1Time = dummyTime;           // no offset
    const bus2Time = dummyTime + 100000;  // offset by 100 seconds for variety

    const pos1 = getPositionAtTime(bus1Time);
    const pos2 = getPositionAtTime(bus2Time);

    setDummyBusPositions([pos1, pos2]);
  }, [dummyTime]);
  // ---------------------------



  const getNearestStop = () => {
    return busStops[0].stop; // temporary
  };

  const handleSelectStop = (stop) => {
    setSelectedStop(selectedStop === stop ? null : stop);
  };

  const handleBoardShuttle = (shuttle) => {
    setBoardedShuttle(boardedShuttle === shuttle ? null : shuttle);
  };

  const handleOpenShuttle = (shuttle) => {
    setSelectedShuttle(shuttle);
  };

  const handleCloseShuttle = () => {
    setSelectedShuttle(null);
  };

  const renderBoardedShuttle = useMemo(() => {
    return (
      !selectedShuttle &&
      boardedShuttle && (
        <MyShuttleButton onPress={() => handleOpenShuttle(boardedShuttle)} />
      )
    );
  }, [selectedShuttle, boardedShuttle]);

  const renderBottomSheet = useMemo(() => {
    return !selectedShuttle ? (
      <UpcomingShuttlesSheet
        handleOpenShuttle={handleOpenShuttle}
        stop={selectedStop || getNearestStop()}
        busDataList={[
          ["Shuttle 1", 3],
          ["Shuttle 2", 18],
          ["Shuttle 3", 21], // temporary
        ]}
      />
    ) : (
      <>
        <CloseButton onPress={handleCloseShuttle} />
        <UpcomingStopsSheet
          handleBoard={handleBoardShuttle}
          selectedShuttle={selectedShuttle}
          boardedShuttle={boardedShuttle}
          stopsData={[
            ["Stop 1", 4],
            ["Stop 2", 16],
            ["Stop 3", 17], // temporary
          ]}
        />
      </>
    );
  }, [selectedStop, selectedShuttle, boardedShuttle]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/**
       * Pass your normal "busData" + new "dummyBusPositions" down to <Map />
       */}
      <Map
        busData={busData}
        dummyBusPositions={dummyBusPositions}
        handleSelectStop={handleSelectStop}
      />
      {renderBoardedShuttle}
      {renderBottomSheet}
    </GestureHandlerRootView>
  );
}
