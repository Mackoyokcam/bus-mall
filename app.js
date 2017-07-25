'use strict';

function GenerateImage(name) {
  this.name = name;
  if (name === 'usb') {
    this.ext = '.gif';
  } else if (name === 'sweep') {
    this.ext = '.png';
  } else {
    this.ext = '.jpg';
  }
  this.pathName = 'img/' + this.name + this.ext;
  this.clicked = 0;
  this.viewed = 0;
  GenerateImage.all.push(this);
}

// Must be less than half the amount of images in img directory
GenerateImage.numberOfPicturesDisplayed = 3;

GenerateImage.maxClicks = 5;

GenerateImage.currentClicks = 0;

GenerateImage.imgElements = [];

GenerateImage.createImgElements = function () {
  var imageContainer = document.getElementById('images');
  for(var i = 1; i < GenerateImage.numberOfPicturesDisplayed + 1; i++) {
    var imageElement = document.createElement('img');
    imageElement.id = 'image' + i;
    imageElement.src = '';
    imageContainer.appendChild(imageElement);
    GenerateImage.imgElements.push(imageElement.id);
  }
}();

GenerateImage.indicesUsed = [];

GenerateImage.names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum',
  'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep',
  'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

GenerateImage.all = [];

var barData = [];
var percentages = [];
var colors = randomColor({
  count: 20});

function newCanvas() {
  var body = document.getElementById('body');
  var oldCanvas = document.getElementById('chart_area');
  body.removeChild(oldCanvas);
  var newCanvas = document.createElement('canvas');
  newCanvas.id = 'chart_area';
  newCanvas.width = '960';
  newCanvas.height = '700';
  body.appendChild(newCanvas);
}

// Create image objects
for (var i = 0; i < GenerateImage.names.length; i++) {
  new GenerateImage(GenerateImage.names[i]);
  barData[i] = 0;
}

// Handles clicking of images
function handleClick(e) {

  // Run this code only if there was an event
  if (e) {
    GenerateImage.currentClicks++;
    for (var i = 0; i < GenerateImage.all.length; i++) {
      if (e.target.alt === GenerateImage.all[i].name) {
        GenerateImage.all[i].clicked++;
        barData[i] = GenerateImage.all[i].clicked;
        console.log('User clicked: ' + GenerateImage.all[i].name);
        i = GenerateImage.all.length;
      }
    }
  }

  // End if max clicks
  if (GenerateImage.currentClicks >= GenerateImage.maxClicks) {
    //Disable Event Listeners
    for (i = 0; i < GenerateImage.imgElements.length; i++) {
      document.getElementById(GenerateImage.imgElements[i]).removeEventListener('click', handleClick);
      document.getElementById(GenerateImage.imgElements[i]).style.borderColor = 'black';
      document.getElementById(GenerateImage.imgElements[i]).style.cursor = 'default';
    }
    //Display Data
    for (i = 0; i < GenerateImage.all.length; i++) {
      var percentage = Math.round((GenerateImage.all[i].clicked / GenerateImage.all[i].viewed) * 100);
      if(GenerateImage.all[i].viewed === 0) {
        percentage = 0;
      }

      percentages.push(percentage);
    }

    alert('You have completed the focus group! Please see results.');

    //Remove Images
    var deleteImages = document.getElementById('body');
    deleteImages.removeChild(document.getElementById('images'));
    deleteImages.removeChild(document.getElementById('h2'));

    //Add charts with headers
    // var barHeader = document.getElementById('bar_header');
    // barHeader.textContent = 'Number of votes per item.';
    // var polarHeader = document.getElementById('polar_header');
    // polarHeader.textContent = 'Percentages based on views and votes';
    // buttons
    var voteButtonElement = document.createElement('button');
    var percentButtonElement = document.createElement('button');
    voteButtonElement.id = 'vote_button';
    percentButtonElement.id = 'percent_button';
    voteButtonElement.textContent = 'Votes bar graph';
    percentButtonElement.textContent = 'Percentage graph';
    var buttonContainer = document.getElementById('buttons');
    buttonContainer.appendChild(voteButtonElement);
    buttonContainer.appendChild(percentButtonElement);

    // add event listeners to buttons
    voteButtonElement.addEventListener('click', drawBarGraph);
    percentButtonElement.addEventListener('click', drawPolarArea);

    drawBarGraph();
    return true;
  }

  // Display new images and collect data
  for (i = 0; i < GenerateImage.numberOfPicturesDisplayed; i++) {
    var random_number = Math.floor(Math.random() * GenerateImage.all.length);

    console.log('Indices before render = ' + GenerateImage.indicesUsed);
    console.log('random: ' + random_number);
    // Make sure three previous images and current images are not duplicated
    if (GenerateImage.indicesUsed.includes(random_number)) {
      console.log('Duplicate found on image ' + i);
      i--;
    } else { // Display Image
      document.getElementById(GenerateImage.imgElements[i]).src =
        GenerateImage.all[random_number].pathName;
      document.getElementById(GenerateImage.imgElements[i]).alt =
        GenerateImage.all[random_number].name;
      GenerateImage.all[random_number].viewed++;
      GenerateImage.indicesUsed.push(random_number);
      console.log('Indices after render = ' + GenerateImage.indicesUsed);
    }
  }

  if (e) {
    // Can now reuse the previous images
    for(i = 0; i < GenerateImage.numberOfPicturesDisplayed; i++) {
      GenerateImage.indicesUsed.shift();
    }
  }
}

for (i = 0; i < GenerateImage.imgElements.length; i++) {
  document.getElementById(GenerateImage.imgElements[i]).addEventListener('click', handleClick);
}

handleClick(false);

function drawBarGraph() {
  var voteButtonElement = document.getElementById('vote_button');
  var percentButtonElement = document.getElementById('percent_button');

  // Disable/Reenable buttons
  voteButtonElement.disabled = true;
  voteButtonElement.style.opacity = 0.4;
  percentButtonElement.disabled = false;
  percentButtonElement.style.opacity = 1;

  // clear canvas
  newCanvas();

  var canvas = document.getElementById('chart_area');
  var ctx = document.getElementById('chart_area').getContext('2d');

  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: GenerateImage.names,
      datasets: [{
        label: 'Number of Votes',
        data: barData,
        backgroundColor: colors
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      },
      responsive: false,
      animation: {
        duration: 2000,
        easing: 'easeOutBounce'
      }
    }
  });
}

function drawPolarArea() {
  var percentButtonElement = document.getElementById('percent_button');
  var voteButtonElement = document.getElementById('vote_button');

  // Disable/Reenable buttons
  percentButtonElement.disabled = true;
  percentButtonElement.style.opacity = 0.4;
  voteButtonElement.disabled = false;
  voteButtonElement.style.opacity = 1;

  // clear canvas
  newCanvas();

  var canvas = document.getElementById('chart_area');
  var ctx = document.getElementById('chart_area').getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var myPolar = new Chart(ctx,{
    type: 'doughnut',
    data: {
      labels: GenerateImage.names, // titles array we declared earlier
      datasets: [{
        data: percentages, // votes array we declared earlier
        backgroundColor: colors
      }]
    },
    options: {
      responsive: false,
      animation: {
        duration: 2000,
        easing: 'easeOutBounce'
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          max: 10,
          min: 0,
          stepSize: 1.0
        }
      }]
    }
  });
}
