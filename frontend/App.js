import React, { useState, useEffect, useRef, useMemo } from "react"
import * as Location from "expo-location"
import Map from "./components/map/map"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import UpcomingShuttlesSheet from "./components/upcomingShuttles"
import UpcomingStopsSheet from "./components/upcomingStops"
import CloseButton from "./components/buttons/closeButton"

export default function App() {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [busData, setBusData] = useState([])
  const [selectedShuttle, setSelectedShuttle] = useState(null)
  const [boardedShuttle, setBoardedShuttle] = useState(null)
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

  const handleBoardShuttle = (shuttle) => {
    setBoardedShuttle(shuttle)
  }

  const handleOpenShuttle = (shuttle) => {
    setSelectedShuttle(shuttle)
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
      <>
        <CloseButton onPress={handleCloseShuttle} />
        <UpcomingStopsSheet
          handleBoard={handleBoardShuttle}
          selectedShuttle={selectedShuttle}
          boardedShuttle={boardedShuttle}
          stopsData={[
            ["Stop 1", 4],
            ["Stop 2", 16],
            ["Stop 3", 17],
          ]}
        />
      </>
    )
  }, [selectedShuttle, boardedShuttle])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map busData={busData} />
      {renderBottomSheet}
    </GestureHandlerRootView>
  )
}
