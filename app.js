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

GenerateImage.numberOfPicturesDisplayed = 3;

GenerateImage.maxClicks = 25;

GenerateImage.currentClicks = 0;

GenerateImage.imgElements = ['image_one', 'image_two', 'image_three'];

GenerateImage.indicesUsed = [];

GenerateImage.names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum',
  'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep',
  'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

GenerateImage.all = [];

for (var i = 0; i < GenerateImage.names.length; i++) {
  new GenerateImage(GenerateImage.names[i]);
}

// Handles clicking of images
function handleClick(e) {

  // Run this code only if there was an event
  if (e) {
    GenerateImage.currentClicks++;
    for (var i = 0; i < GenerateImage.all.length; i++) {
      if (e.target.alt === GenerateImage.all[i].name) {
        GenerateImage.all[i].clicked++;
        console.log('User clicked: ' + GenerateImage.all[i].name);
        i = GenerateImage.all.length;
      }
    }
  }

  // End if max clicks
  if (GenerateImage.currentClicks >= 25) {
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
      var liElement = document.createElement('li');
      liElement.textContent = GenerateImage.all[i].name + ' has been viewed ' +
        GenerateImage.all[i].viewed + ' times and has been clicked ' +
        GenerateImage.all[i].clicked + ' times.' + '(' + percentage + '%)';
      document.getElementById('results').appendChild(liElement);
    }

    alert('You have completed the focus group! Please see results.');
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
    // Can now reuse the previous three images
    GenerateImage.indicesUsed.shift();
    GenerateImage.indicesUsed.shift();
    GenerateImage.indicesUsed.shift();
  }
}

for (i = 0; i < GenerateImage.imgElements.length; i++) {
  document.getElementById(GenerateImage.imgElements[i]).addEventListener('click', handleClick);
}

handleClick(false);
