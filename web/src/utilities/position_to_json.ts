export const positionToJSON = (pos: Position) => {
  return {
    timestamp: pos.timestamp,
    coords: {
      longitude: pos.coords.longitude,
      latitude: pos.coords.latitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude,
      altitudeAccuracy: pos.coords.altitudeAccuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed
    }
  };
};
