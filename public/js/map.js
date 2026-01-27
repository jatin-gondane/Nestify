maptilersdk.config.apiKey = apiKeyMap;

  // set coordinate later to centre and lng,lat
  let finalCoordinate = JSON.parse(coordinate);


  const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.STREETS, // change map style by .dark or whatever you want
      center: finalCoordinate, // starting position [lng, lat]
      zoom: 14
  });

  const marker = new maptilersdk.Marker()
  .setLngLat(finalCoordinate)
  .addTo(map);