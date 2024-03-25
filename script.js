
// Function to toggle the visibility of the popup form
function togglePopup() {
    var popup = document.getElementById('popupForm');
    var overlay = document.getElementById('overlay');
    if (popup.style.display === 'none') {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }
}
 
// Handle form submission
document.getElementById('treeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    storeData(); // Call function to store data
});
 
// Function to store data in Excel sheet
function storeData() {
    var treeName = document.getElementById('treeName').value;
    var treeHeight = document.getElementById('treeHeight').value;
    var treeAge = document.getElementById('treeAge').value;
    var latitude = document.getElementById('latitude').value;
    var longitude = document.getElementById('longitude').value;
 
    // Create a new workbook
    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet('TreeDetails');
 
    // Add headers
    worksheet.addRow(['Tree Name', 'Tree Height', 'Tree Age', 'Latitude', 'Longitude']);
 
    // Add data
    worksheet.addRow([treeName, treeHeight, treeAge, latitude, longitude]);
 
    // Generate Excel file
    workbook.xlsx.writeBuffer().then(function(buffer) {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'tree_details.xlsx');
    });
}
 
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
    
});
map.addOverlay(popup);
 
closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};
 
 // Handle single click event
 map.on('singleclick', function (evt) {
    var clickedCoord = evt.coordinate;
    var transformedCoord = ol.proj.transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');
    document.getElementById('latitude').value = transformedCoord[1];
    document.getElementById('longitude').value = transformedCoord[0];
   
    // Display the popup with latitude and longitude
    content.innerHTML = 'Latitude: ' + transformedCoord[1] + '<br>Longitude: ' + transformedCoord[0];
    popup.setPosition(clickedCoord);
});
 
// Function to validate the form
function validateForm() {
    var treeName = document.getElementById('treeName').value;
    var treeHeight = document.getElementById('treeHeight').value;
    var treeAge = document.getElementById('treeAge').value;
    var latitude = document.getElementById('latitude').value;
    var longitude = document.getElementById('longitude').value;
    var errorMessage = '';
 
    if (treeName.trim() === '') {
        errorMessage += 'Please enter the tree name.<br>';
    }
 
    if (treeHeight <= 0 || isNaN(treeHeight)) {
        errorMessage += 'Please enter a valid tree height (greater than 0).<br>';
    }
 
    if (treeAge <= 0 || isNaN(treeAge)) {
        errorMessage += 'Please enter a valid tree age (greater than 0).<br>';
    }
 
    if (latitude.trim() === '' || longitude.trim() === '') {
        errorMessage += 'Latitude and Longitude are required.<br>';
    }
 
    if (errorMessage !== '') {
        document.getElementById('errorMessages').innerHTML = errorMessage;
        return false;
    } else {
        document.getElementById('errorMessages').innerHTML = '';
        return true;
    }
}
 