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

// Create a base layer that holds both maps. 
let baseMaps = {
	Street: streets,
	SatelliteStreets: satelliteStreets
};

// Create the map object with center and zoom level.
let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

streets.addTo(map);

// Accessing the airport GeoJSON URL
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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
        fillColor: "#ffae42",
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

// Grabbing our GeoJSON data.
d3.json(earthquakeUrl).then(function(data) {
    // We turn each feature into a circleMarker on the map.
    L.geoJSON(data, { 
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function
        style: styleInfo
        }).addTo(map);
});
