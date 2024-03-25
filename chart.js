// Chart.js code
document.addEventListener('DOMContentLoaded', function() {
    var legendData = [
        { color: '#89ff89', label: 'Ground' },
        { color: '#6b5ad8', label: 'Building' },
        { color: '#e095df', label: 'Road' },
        { color: '#e9e176', label: 'Parking Area' },
        { color: '#d07835', label: 'Volleyball Ground' }
    ];

    var legendContainer = document.createElement('div');
    legendContainer.classList.add('legend-container');

    legendData.forEach(function(item) {
        var legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');

        var colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = item.color;

        var label = document.createElement('span');
        label.textContent = '- ' + item.label;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);
    });

    document.body.appendChild(legendContainer);
});

document.addEventListener('DOMContentLoaded', function() {
    var legendData = [
        { color: '#89ff89', label: 'Ground', plantable: true },
        { color: '#6b5ad8', label: 'Building', plantable: false },
        { color: '#e095df', label: 'Road', plantable: false },
        { color: '#e9e176', label: 'Parking Area', plantable: false },
        { color: '#d07835', label: 'Volleyball Ground', plantable: false }
    ];

    var legendContainer = document.createElement('div');
    legendContainer.classList.add('legend-container');

    legendData.forEach(function(item) {
        var legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');

        var colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = item.color;

        var label = document.createElement('span');
        label.textContent = '- ' + item.label;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);

        // Add event listener to legend item
        legendItem.addEventListener('click', function() {
            var popupContent = document.querySelector('.popup-content');
            if (item.plantable) {
                // Display popup for plantable area
                popupContent.textContent = 'Plantable Area!';
            } else {
                // Display popup for non-plantable area
                popupContent.textContent = 'Not a plantable area!';
            }
            var popup = document.querySelector('.popup');
            popup.style.display = 'block';

            // Hide the popup after 5 seconds
            setTimeout(function() {
                popup.style.display = 'none';
            }, 5000);
        });
    });

    document.body.appendChild(legendContainer);
});

