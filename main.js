// Initialize the map view
var mapView = new ol.View({
    center: ol.proj.fromLonLat([72.8710, 19.0211]),
    zoom: 18.2
});
 
// Create the map instance
var map = new ol.Map({
    target: 'map',
    view: mapView
});
 
// Add OpenStreetMap base layer
var osmTile = new ol.layer.Tile({
    title: 'Open Street Map',
    visible: true,
    source: new ol.source.OSM()
});
map.addLayer(osmTile);
 
// Add WMS layers
var vitpolygonshpfile = createWMSLayer('VIT_ShapeFile_updated', 'http://localhost:8080/geoserver/VitShpUpdated2/wms', 'VitShpUpdated2:Vitpolyfile2');
var existing_trees = createWMSLayer('Existing_tree_data', 'http://localhost:8080/geoserver/VitShapeUpdated/wms', 'VitShapeUpdated:existing_tree_data');
map.addLayer(vitpolygonshpfile);
map.addLayer(existing_trees);
 
// Add popup overlay
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
 
var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: { duration: 250 }
});
map.addOverlay(popup);
 
closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};
 
// Handle single click event
map.on('singleclick', function(evt) {
    content.innerHTML = '';
    var clickedCoord = evt.coordinate;
    var transformedCoord = ol.proj.transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');
    var resolution = mapView.getResolution();
    var url = existing_trees.getSource().getFeatureInfoUrl(transformedCoord, resolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json', 'propertyName': 'Type, height' });
   
    if (url) {
        $.getJSON(url, function(data) {
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> State: </h3> <p>" + props.state.toUpperCase() + "</p> <br> <h3> District: </h3> <p>" + props.district.toUpperCase() + "</p>";
            popup.setPosition(evt.coordinate);
        });
    } else {
        popup.setPosition(undefined);
    }
});
 
// Add GeoJSON layer
var geoJsonSource = new ol.source.Vector({ url: 'data/data.geojson', format: new ol.format.GeoJSON() });
var vitPolygonGeoJSON = new ol.layer.Vector({ title: "Existing_tree_data", source: geoJsonSource });
map.addLayer(vitPolygonGeoJSON);
 
// Show popup on click for GeoJSON layer
map.on('singleclick', function(evt) {
    content.innerHTML = '';
    map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        var props = feature.getProperties();
        content.innerHTML = "<h3> State: </h3> <p>" + props.state.toUpperCase() + "</p> <br> <h3> District: </h3> <p>" + props.district.toUpperCase() + "</p>";
        popup.setPosition(evt.coordinate);
    });
});
 
// Add mouse position control
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function(coordinate) {
        return ol.coordinate.format(coordinate, '{y}, {x}', 6);
    },
    projection: 'EPSG:4326',
    className: 'mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});
map.addControl(mousePositionControl);
 
// Function to create WMS layers
function createWMSLayer(title, url, layers) {
    return new ol.layer.Tile({
        title: title,
        source: new ol.source.TileWMS({
            url: url,
            params: { 'LAYERS': layers, 'TILED': true },
            serverType: 'geoserver',
            visible: true
        })
    });
}