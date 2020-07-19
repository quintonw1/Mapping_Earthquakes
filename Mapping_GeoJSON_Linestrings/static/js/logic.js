// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
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

// Create a base layer that holds both maps. 
let baseMaps = {
	Light: light,
	Dark: dark
};

// Create the map object with center and zoom level.
let map = L.map('mapid', {
	center: [44, -80],
	zoom: 2,
	layers: [dark]
});

let myStyle = {
	color: "yellow",
	weight : 2
};
// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Accessing the airport GeoJSON URL
let torontoData = "https://raw.githubusercontent.com/quintonw1/Mapping_Earthquakes/Mapping_GeoJSON_Linestrings/Mapping_GeoJSON_Linestrings/torontoRoutes.json";

function createMarkers (data) {
	console.log(data);
	data.forEach(function(entry) {
		// Adding markers with popups 
		L.geoJSON(entry,{
			style: myStyle,
			onEachFeature: function(feature, layer) {
				layer.bindPopup("<h2>Airline: " + layer.feature.properties.airline + "</h2> <hr> <h3>Destination: "+ layer.feature.properties.dst + "</h3>")
			}
			}).addTo(map)
	});
};

// Grabbing our GeoJSON data.
d3.json(torontoData).then(function(data) {
	console.log(data);
	// Creating a GeoJSON layer with the retrieved data.
	createMarkers(data.features);
});
