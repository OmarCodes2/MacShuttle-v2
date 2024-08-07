package wialon

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type BusLocation struct {
	Lat float64 `json:"y"`
	Lon float64 `json:"x"`
}

func GetBusLocation() (BusLocation, error) {
	var location BusLocation

	// Get environment variables
	token := os.Getenv("WIALON_TOKEN")
	id := os.Getenv("WIALON_ID")

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

	sid := loginResponse["eid"].(string)

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

	pos := locationResponse["item"].(map[string]interface{})["pos"].(map[string]interface{})
	location.Lat = pos["y"].(float64)
	location.Lon = pos["x"].(float64)

	return location, nil
}
