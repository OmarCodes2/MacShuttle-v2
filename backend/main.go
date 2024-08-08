package main

import (
	"log"
	"net/http"

	"github.com/OmarCodes2/MacShuttle-v2/handlers"
	"github.com/gorilla/mux"
)

func main() {
	port := "8080"

	// Create a new router
	r := mux.NewRouter()

	// Add the WebSocket endpoint
	r.HandleFunc("/ws", handlers.WebSocketHandler)

	// Add the new GET endpoint
	r.HandleFunc("/get-bus-location", handlers.GetBusLocationHandler).Methods("GET")

	// Start the server
	log.Printf("Server started on :%s", port)
	err := http.ListenAndServe(":"+port, r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
