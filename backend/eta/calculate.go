package eta

import (
	"errors"
	"math"
)

type StopInfo struct {
	Longitude float64
	Latitude  float64
	Direction string
	TimeStamp int // in milliseconds
}

const (
	StopBtime = 251973
	StopAtime = 457254 // in milliseconds
)

var ReferenceMap = []StopInfo{ // forward is going from A -> B, reverse B -> A
	{Longitude: -79.9219256, Latitude: 43.2601414, Direction: "forward", TimeStamp: 0}, // Point A
	{Longitude: -79.9209266, Latitude: 43.2601393, Direction: "forward", TimeStamp: 22019},
	{Longitude: -79.9190291, Latitude: 43.2597076, Direction: "forward", TimeStamp: 71957},
	{Longitude: -79.9190397, Latitude: 43.2585466, Direction: "forward", TimeStamp: 91927},
	{Longitude: -79.9180279, Latitude: 43.2578761, Direction: "forward", TimeStamp: 111765},
	{Longitude: -79.9159219, Latitude: 43.2590493, Direction: "forward", TimeStamp: 141781},
	{Longitude: -79.9158942, Latitude: 43.2607345, Direction: "forward", TimeStamp: 161717},
	{Longitude: -79.916043, Latitude: 43.261486, Direction: "forward", TimeStamp: 171701},
	{Longitude: -79.9165057, Latitude: 43.262646, Direction: "forward", TimeStamp: 201761},
	{Longitude: -79.9163497, Latitude: 43.2634842, Direction: "forward", TimeStamp: 222013},
	{Longitude: -79.9166429, Latitude: 43.2632088, Direction: "forward", TimeStamp: 251973}, // Point B
	{Longitude: -79.9166429, Latitude: 43.2632088, Direction: "reverse", TimeStamp: 251973}, // Point B
	{Longitude: -79.9168373, Latitude: 43.2623833, Direction: "reverse", TimeStamp: 291853},
	{Longitude: -79.9158826, Latitude: 43.2614362, Direction: "reverse", TimeStamp: 322038},
	{Longitude: -79.9159878, Latitude: 43.2602883, Direction: "reverse", TimeStamp: 331970},
	{Longitude: -79.915909, Latitude: 43.2589812, Direction: "reverse", TimeStamp: 351936},
	{Longitude: -79.9173126, Latitude: 43.2580618, Direction: "reverse", TimeStamp: 372088},
	{Longitude: -79.9183927, Latitude: 43.2583166, Direction: "reverse", TimeStamp: 381971},
	{Longitude: -79.9190962, Latitude: 43.259267, Direction: "reverse", TimeStamp: 402035},
	{Longitude: -79.9193478, Latitude: 43.2600841, Direction: "reverse", TimeStamp: 422045},
	{Longitude: -79.9210478, Latitude: 43.2600492, Direction: "reverse", TimeStamp: 445502},
	{Longitude: -79.9219256, Latitude: 43.2601414, Direction: "reverse", TimeStamp: 457254}, // Point A (back to start)
}

func Haversine(lat1, lon1, lat2, lon2 float64) float64 {
	var (
		r    = 6371 // Earth radius in kilometers
		dLat = (lat2 - lat1) * (math.Pi / 180.0)
		dLon = (lon2 - lon1) * (math.Pi / 180.0)
		a    = math.Sin(dLat/2)*math.Sin(dLat/2) + math.Cos(lat1*(math.Pi/180.0))*math.Cos(lat2*(math.Pi/180.0))*math.Sin(dLon/2)*math.Sin(dLon/2)
		c    = 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	)
	distance := float64(r) * c
	return distance // Distance in kilometers
}

func GetClosestStop(lat, lon float64, direction string) (StopInfo, error) {
	var closestStop StopInfo
	var minDistance float64

	minDistance = math.MaxFloat64 // Assigning Min Distance Inf Value

	// Loop through the points and identify the closest stop from reference table to the bus coords
	for _, stop := range ReferenceMap {
		distance := Haversine(lat, lon, stop.Latitude, stop.Longitude)
		// If new minimum distance is found in the same direction, update the minimum reference coord to this new coord
		if distance < minDistance && direction == stop.Direction {
			minDistance = distance
			closestStop = stop
		}
	}

	if minDistance == math.MaxFloat64 {
		return closestStop, errors.New("no stop found in GetClosestStop()")
	}
	return closestStop, nil
}

func CalculateETA(referenceCoords StopInfo) ([]float64, error) {
	const (
		millisInMinute = 60000 // 60,000 milliseconds in a minute for conversion
	)
	var ETAStopA float64
	var ETAStopB float64
	// Calculating eta when bus is driving from A -> B
	if referenceCoords.Direction == "forward" {
		ETAStopB = float64(StopBtime - referenceCoords.TimeStamp)
		ETAStopA = float64(ETAStopB + (StopAtime - StopBtime))
	} else { // Calculating eta when bus is driving from B -> A
		ETAStopA = float64(StopAtime - referenceCoords.TimeStamp)
		ETAStopB = float64(ETAStopA + StopBtime)
	}

	// Converting to ETA in minutes
	ETAStopA = ETAStopA / millisInMinute
	ETAStopB = ETAStopB / millisInMinute

	if ETAStopA < 0 || ETAStopB < 0 {
		return nil, errors.New("failed to calculate ETA in CalculateETA()")
	}

	ETAs := []float64{ETAStopA, ETAStopB, referenceCoords.Longitude, referenceCoords.Latitude}
	return ETAs, nil
}

func GetBusETA(lat, lon float64, direction string) ([]float64, error) {
	// Get closest reference stop to bus ETA
	closestStop, err := GetClosestStop(lat, lon, direction)
	if err != nil {
		return nil, err
	}

	// Calculate ETA to each of the stops
	ETAs, err := CalculateETA(closestStop)
	if err != nil {
		return nil, err
	}

	return ETAs, nil
}
