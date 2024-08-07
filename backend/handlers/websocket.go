package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/OmarCodes2/MacShuttle-v2/eta"
	"github.com/OmarCodes2/MacShuttle-v2/wialon"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv: %s", message)

		go func() {
			for {
				// Retrieve bus location
				location, err := wialon.GetBusLocation()
				if err != nil {
					log.Println("Error retrieving bus location:", err)
					continue
				}

				// Calculate ETA
				eta, err := eta.GetBusETA(location.Lat, location.Lon, "forward")
				if err != nil {
					log.Println("Error calculating ETA:", err)
					continue
				}

				// Send ETA to client
				err = conn.WriteJSON(eta)
				if err != nil {
					log.Println("write:", err)
					break
				}

				// Wait for 5 seconds before next update
				time.Sleep(5 * time.Second)
			}
		}()
	}
}
