import React, { useState, useEffect, useRef, useMemo } from "react"
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import * as Location from "expo-location"
import { Ionicons } from "@expo/vector-icons"
import Map from "./components/map/map"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import BottomSheetWrapper from "./components/bottom-sheet/bottomSheetWrapper"
import BottomSheetTitle from "./components/bottom-sheet/bottomSheetTitle"
import BottomSheetBlock from "./components/bottom-sheet/bottomSheetBlock"
import UpcomingShuttlesSheet from "./components/upcomingShuttles"
import UpcomingStopsSheet from "./components/upcomingStops"

export default function App() {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [busData, setBusData] = useState([])
  const [selectedShuttle, setSelectedShuttle] = useState(null)
  const ws = useRef(null)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }
    })()

    ws.current = new WebSocket(process.env.EXPO_PUBLIC_WEBSOCKET_URL)

    ws.current.onopen = () => {
      console.log("WebSocket connection opened")
      const message = JSON.stringify({
        type: "subscribe",
        content: "bus_updates",
      })
      ws.current.send(message)
    }

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setBusData(data)
    }

    ws.current.onerror = (e) => {
      console.error("WebSocket error: ", e.message)
    }

    ws.current.onclose = (e) => {
      console.log("WebSocket connection closed: ", e.code, e.reason)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  const handleOpenShuttle = (shuttle) => {
    setSelectedShuttle(shuttle)
    console.log(selectedShuttle)
  }

  const handleCloseShuttle = () => {
    setSelectedShuttle(null)
  }

  const renderBottomSheet = useMemo(() => {
    return !selectedShuttle ? (
      <UpcomingShuttlesSheet
        handleOpenShuttle={handleOpenShuttle}
        nearestStop={"MUSC"}
        busDataList={[
          ["Shuttle 1", 3],
          ["Shuttle 2", 18],
          ["Shuttle 3", 21],
        ]}
      />
    ) : (
      <UpcomingStopsSheet
        handleClose={handleCloseShuttle}
        handleBoard={() => {}}
        selectedShuttle={selectedShuttle}
        boardedShuttle={null}
        stopsData={[
          ["Stop 1", 4],
          ["Stop 2", 16],
          ["Stop 3", 17],
        ]}
      />
    )
  }, [selectedShuttle])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map busData={busData} />
      {renderBottomSheet}
    </GestureHandlerRootView>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   text: {
//     fontSize: 24,
//     color: "#000",
//     margin: 20,
//   },
//   error: {
//     fontSize: 18,
//     color: "red",
//     margin: 10,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 25,
//     margin: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   startStopButton: {
//     marginTop: 30,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   backButton: {
//     backgroundColor: "transparent",
//     padding: 10,
//     borderRadius: 25,
//     marginBottom: 10,
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   icon: {
//     color: "#fff",
//   },
//   stopText: {
//     fontSize: 24,
//     color: "#fff",
//     margin: 20,
//   },
// })
