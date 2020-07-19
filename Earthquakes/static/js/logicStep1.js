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

// Grabbing our GeoJSON data.
d3.json(earthquakeUrl).then(function(data) {
	console.log(data);
	L.geoJSON(data).addTo(map);
});
