package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
)

type Coordinates struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

type Response struct {
	Provided Coordinates `json:"provided"`
	Wialon   Coordinates `json:"wialon"`
}

func getBusLocation() (Coordinates, error) {
	var location Coordinates

	// Get environment variables
	token := os.Getenv("WIALON_TOKEN")
	id := os.Getenv("WIALON_ID")

	if token == "" || id == "" {
		return location, errors.New("missing WIALON_TOKEN or WIALON_ID environment variable")
	}

	// Step 1: Get the session ID (sid) using the token
	resp, err := http.Get(fmt.Sprintf(`https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"%s"}`, token))
	if err != nil {
		return location, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return location, err
	}

	var loginResponse map[string]interface{}
	err = json.Unmarshal(body, &loginResponse)
	if err != nil {
		return location, err
	}

	sid, ok := loginResponse["eid"].(string)
	if !ok {
		return location, errors.New("failed to retrieve session ID from login response")
	}

	// Step 2: Get the bus location using the session ID
	url := fmt.Sprintf(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item&params={"id":%s,"flags":1025}&sid=%s`, id, sid)
	resp, err = http.Get(url)
	if err != nil {
		return location, err
	}
	defer resp.Body.Close()

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		return location, err
	}

	var locationResponse map[string]interface{}
	err = json.Unmarshal(body, &locationResponse)
	if err != nil {
		return location, err
	}

	item, ok := locationResponse["item"].(map[string]interface{})
	if !ok {
		return location, errors.New("failed to retrieve item from location response")
	}

	pos, ok := item["pos"].(map[string]interface{})
	if !ok {
		return location, errors.New("failed to retrieve pos from item")
	}

	lat, ok := pos["y"].(float64)
	if !ok {
		return location, errors.New("failed to retrieve latitude from pos")
	}

	lon, ok := pos["x"].(float64)
	if !ok {
		return location, errors.New("failed to retrieve longitude from pos")
	}

	location.Lat = lat
	location.Lon = lon

	return location, nil
}

func GetBusLocationHandler(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	latParam := r.URL.Query().Get("lat")
	lonParam := r.URL.Query().Get("lon")

	lat, err := strconv.ParseFloat(latParam, 64)
	if err != nil {
		http.Error(w, "Invalid latitude", http.StatusBadRequest)
		return
	}

	lon, err := strconv.ParseFloat(lonParam, 64)
	if err != nil {
		http.Error(w, "Invalid longitude", http.StatusBadRequest)
		return
	}

	// Fetch Wialon coordinates
	wialonLocation, err := getBusLocation()
	if err != nil {
		log.Println("Error retrieving Wialon location:", err)
		http.Error(w, "Error retrieving Wialon location", http.StatusInternalServerError)
		return
	}

	// Create response
	response := Response{
		Provided: Coordinates{
			Lat: lat,
			Lon: lon,
		},
		Wialon: Coordinates{
			Lat: wialonLocation.Lat,
			Lon: wialonLocation.Lon,
		},
	}

	// Convert response to JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
