// Creating map object
var myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


var geojson;

// Grab data with d3
d3.json(APILink, function(data) {
    
  // Create a new choropleth layer
  geojson = L.choropleth(data, {
  
    // Define what  property in the features to use
    valueProperty: "mag",

    //Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 5,

  onEachFeature:function(feature){
    if(feature.properties.mag<3.61){
      color="#ffffb2"
    }
    else if (feature.properties.mag<6.15){
      color="#ebbf8f"
    }
    else if (feature.properties.mag<6.3){
      color="#d87f6c"
    }
    else if (feature.properties.mag<6.5){
      color="#c43f49"
    }
    else{
      color="#b10026"
    }
    L.circle(feature.geometry.coordinates.slice(0,2).reverse(), {
    fillOpacity: 0.75,
    color: "black",
        //fillColor: colors,
    fillColor:color,
    weight:0.2,
    // Adjust radius
    radius: feature.properties.mag * 20000
  }).bindPopup("Earthquake Magnitude:<br>"+feature.properties.mag).addTo(myMap)}})

  

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];
    // Add min & max
    var legendInfo = "<h1>Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
});
