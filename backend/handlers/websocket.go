package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/OmarCodes2/MacShuttle-v2/eta"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Initialize the buses at different points to spread them out evenly
var busIndices = []int{
	0,                               // Bus 1 starts at the first point
	len(eta.ReferenceMap) / 3,       // Bus 2 starts one-third of the way through
	2 * (len(eta.ReferenceMap) / 3), // Bus 3 starts two-thirds of the way through
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
				etas := make([][]float64, 0, len(busIndices))

				for i := range busIndices {
					// Get the current reference point for this bus
					refPoint := eta.ReferenceMap[busIndices[i]]

					// Calculate ETA for this reference point
					etaResult, err := eta.GetBusETA(refPoint.Latitude, refPoint.Longitude, refPoint.Direction)
					if err != nil {
						log.Println("Error calculating ETA:", err)
						continue
					}

					etas = append(etas, etaResult)

					// Move to the next reference point
					busIndices[i] = (busIndices[i] + 1) % len(eta.ReferenceMap)
				}

				// Send all ETAs to client
				err = conn.WriteJSON(etas)
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
