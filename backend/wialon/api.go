package wialon

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)


type BusData struct {
	Id int `json:"id"`
	Lat       float64 `json:"y"`
	Lon       float64 `json:"x"`
	TimeStamp float64     `json:"t"`
}

func GetBusData() ([]BusData, error) {
	var busesData []BusData
	var busIDs []int

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Get the token from environment variables
	token := os.Getenv("WIALON_TOKEN")

	// Step 1: Get the session ID (sid) using the token
	resp, err := http.Get(fmt.Sprintf(`https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"%s"}`, token))
	if err != nil {
		return busesData, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return busesData, err
	}

	var loginResponse map[string]interface{}
	err = json.Unmarshal(body, &loginResponse)
	if err != nil {
		return busesData, err
	}

	sid := loginResponse["eid"].(string)

	// Step 2: Get the list of tracker IDs (id) using the session ID (sid)
	resp, err = http.Get(fmt.Sprintf(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params=%%7B%%22spec%%22%%3A%%7B%%22itemsType%%22%%3A%%22avl_unit%%22%%2C%%22propName%%22%%3A%%22sys_name%%22%%2C%%22propValueMask%%22%%3A%%22*%%22%%2C%%22sortType%%22%%3A%%22sys_name%%22%%7D%%2C%%22force%%22%%3A1%%2C%%22flags%%22%%3A1%%2C%%22from%%22%%3A0%%2C%%22to%%22%%3A0%%7D&sid=%s`, sid))
	if err != nil {
		return busesData, err
	}
	defer resp.Body.Close()

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		return busesData, err
	}

	var trackerSearchResponse map[string]interface{}
	err = json.Unmarshal(body, &trackerSearchResponse)
	if err != nil {
		return busesData, err
	}

	items := trackerSearchResponse["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{}) // Assert the type of each item to map[string]interface{}
		busID := int(itemMap["id"].(float64))    // Convert the id to int (it's stored as float64 in the interface{} type)
		busIDs = append(busIDs, busID)
	}

	// Step 3: Get all the bus locations using the session ID & tracker IDs
	for _, id := range busIDs {
		var busdata BusData
		busdata.Id = id

		url := fmt.Sprintf(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item&params={"id":%d,"flags":1025}&sid=%s`, id, sid)
		resp, err = http.Get(url)
		if err != nil {
			return busesData, err
		}
		defer resp.Body.Close()

		body, err = io.ReadAll(resp.Body)
		if err != nil {
			return busesData, err
		}

		var locationResponse map[string]interface{}
		err = json.Unmarshal(body, &locationResponse)
		if err != nil {
			return busesData, err
		}

		pos := locationResponse["item"].(map[string]interface{})["pos"].(map[string]interface{})
		busdata.Lat = pos["y"].(float64)
		busdata.Lon = pos["x"].(float64)
		busdata.TimeStamp = pos["t"].(float64)

		busesData = append(busesData, busdata)
	}

	return busesData, nil
}
