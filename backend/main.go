package main

import (
	"log"
	"net/http"

	"github.com/OmarCodes2/MacShuttle-v2/handlers"
)

func main() {
	port := "8080"

	http.HandleFunc("/ws", handlers.WebSocketHandler)

	log.Printf("Server started on :%s", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
