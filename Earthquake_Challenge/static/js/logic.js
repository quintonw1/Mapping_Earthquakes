// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center and zoom level.
let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
});

// Create a base layer that holds both maps. 
let baseMaps = {
	Street: streets,
  SatelliteStreets: satelliteStreets,
  Dark: dark
};

// Create the plate layer for our map. 
let plates = new L.layerGroup();

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays. 
// This overlay will be visible all the time. 
let overlays = {
  Earthquakes: earthquakes,
  Plates: plates
};

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the earthquake GeoJSON URL
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Accessing the tectonic plate linelist GeoJSON url
let platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function createMarkers (data) {
	console.log(data);
	data.forEach(function(entry) {
		L.geoJSON(entry,{
			onEachFeature: function(feature, layer) {
				layer.bindPopup("<h2>Airport code: " + layer.feature.properties.faa + "</h2> <hr> <h3>Airport name: "+ layer.feature.properties.name + "</h3>")
			}
			}).addTo(map)
	});
};

// Initialize the styleInfo Feature function
function styleInfo(feature) {
    return {
        opacity: 1, 
        fillOpacity: 1, 
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1; 
    }
    return magnitude * 4;
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
}

// Grabbing our GeoJSON data.
d3.json(earthquakeUrl).then(function(data) {
    // We turn each feature into a circleMarker on the map.
    L.geoJSON(data, { 
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function
        style: styleInfo,
        // Wet ceate a popup for each circleMarker to display the magnitude and 
        // location of the earthquake after the marker has been created and styled 
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: "+ feature.properties.mag + "<br> Location: " + feature.properties.place);
        }
        }).addTo(earthquakes);
    // Then we add the earthquake layer to our map. 
    earthquakes.addTo(map);
});

// Create a legend control object. 
let legend = L.control({
  position: 'bottomright'
});

legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');
    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
    // Looping through our intervals to generate a label with a colored square for each interval. 
    for (var i = 0; i< magnitudes.length; i++) {
      div.innerHTML += 
        "<i style ='background: " + colors[i] + "'></i>" + 
        magnitudes[i] + (magnitudes[i+1] ? "&ndash;" + magnitudes[i+1] + "<br>" : "+");

    }
    return div;
};

legend.addTo(map);

// Adding myStyle object to style the lines 
let myStyle = {
  color: "#00ff00",
  opacity: 0.65,
}

// d3.json call to grab GeoJSON data for tectonic plates
d3.json(platesUrl).then(function(data) {
  console.log(data);
  // Adding the plates lines to the map 
  L.geoJSON(data,{
    style: myStyle
  }).addTo(plates);
  // Then we add the plates layer to our map. 
  plates.addTo(map);
});
