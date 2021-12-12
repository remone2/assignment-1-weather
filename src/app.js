function getLatAndLon() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Error, cannot find your location.");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  });
}