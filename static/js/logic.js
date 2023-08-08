// Use this link to get the GeoJSON data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Create markers that reflect the depth of the earthquake by  color
function getColor(depth) {
  if (depth >= 90) return "#FF0D0D";
  else if (depth >= 70) return "#FF4E11";
  else if (depth >= 50) return "#FF8E15";
  else if (depth >= 30) return  "#FFB92E";
  else if (depth >= 10) return "#ACB334";
  else if (depth >= -10) return "#69B34C"; 
}

// Create markers that reflect the magnitude of the earthquake by size
function radiusMagnitude(magnitude) {
  return magnitude * 6000;
};


function createFeatures(earthquakeData) {

  // Define a function to run once for each feature in the feature array
  // Create popups that would provide additional information about the place, magnitude, lat/long, depth and date of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Type: ${feature.geometry.type}</p><p>Magnitude: ${feature.properties.mag}</p><p>Latitude, Longitude: ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Date: ${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeaJson layer that contains the features array on the  earchquakeData object
  let earthquakes = L.geoJSON(earthquakeData, {onEachFeature: onEachFeature,
    pointToLayer: function(feature, coords) {
      // Create marker style - showing magnitude higher magnitude earthquakes with larger markers and showing the depth with the color scale established above
      let style = {
        radius: radiusMagnitude(feature.properties.mag),
        color: "#000000",
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: 1,
        opacity:1,
        weight:0.5} 
      return L.circle(coords, style);} });
  
  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}
   
function createMap(earthquakes) {
  
  // Create the base layer
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

   // Create a baseMaps object.
   let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [35.09, -100.71],
    zoom: 3.5,
    layers: [street, earthquakes]
  });

  // Set up a legend to display information about our map
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = () => {
    let div = L.DomUtil.create('div', 'info legend');
    grades = [-10, 10, 30, 50, 70, 90];
  
      // loop through the intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);
};

// I used some codes from  class activities