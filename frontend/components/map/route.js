export const buildFullRoute = (referenceMap) => {
    const forwardRoute = referenceMap.filter((pt) => pt.Direction === "forward");
    const reverseRoute = referenceMap.filter((pt) => pt.Direction === "reverse");
  
    forwardRoute.sort((a, b) => a.TimeStamp - b.TimeStamp);
    reverseRoute.sort((a, b) => a.TimeStamp - b.TimeStamp);
  
    const fullRoute = [...forwardRoute, ...reverseRoute];
  
    const startTime = fullRoute[0].TimeStamp;
    const endTime = fullRoute[fullRoute.length - 1].TimeStamp;
    const totalDuration = endTime - startTime;
  
    const normalizedRoute = fullRoute.map((pt) => {
      return {
        lat: pt.Latitude,
        lon: pt.Longitude,
        t: (pt.TimeStamp - startTime) / totalDuration,
      };
    });
  
    return { route: normalizedRoute, totalDuration };
  };
  
  export const interpolatePosition = (route, timeFraction) => {
    const wrappedTime = timeFraction % 1;
  
    for (let i = 0; i < route.length - 1; i++) {
      const current = route[i];
      const next = route[i + 1];
      if (wrappedTime >= current.t && wrappedTime <= next.t) {
        const segmentFraction = (wrappedTime - current.t) / (next.t - current.t);
  
        const lat = current.lat + (next.lat - current.lat) * segmentFraction;
        const lon = current.lon + (next.lon - current.lon) * segmentFraction;
  
        return { lat, lon };
      }
    }
  
    return {
      lat: route[route.length - 1].lat,
      lon: route[route.length - 1].lon,
    };
  };
  