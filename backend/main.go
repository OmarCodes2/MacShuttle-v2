package main

import (
	"log"
	"net/http"
	"os"

	"github.com/OmarCodes2/MacShuttle-v2/handlers"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, falling back to environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if PORT is not set
	}

	http.HandleFunc("/ws", handlers.WebSocketHandler)

	log.Printf("Server started on :%s", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
