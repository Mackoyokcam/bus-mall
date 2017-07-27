'use strict';

var surveyData = JSON.parse(localStorage.storedAll);
var headerData = ['Item', 'Views', 'Clicks', '% of Clicks when Viewed', 'Recommended?'];
var theTable = document.getElementById('theTable');


/* Header */
var tableRow = document.createElement('tr');

for (var i = 0; i < headerData.length; i++) {
  var tableHeader = document.createElement('th');
  tableHeader.textContent = headerData[i];
  tableRow.appendChild(tableHeader);
}
theTable.appendChild(tableRow);
var recommend = 'Y';

/* Body */
for (i = 0; i < surveyData.length; i++) {

  var percentage = Math.round((surveyData[i].clicked / surveyData[i].viewed) * 100);

  // No dividing by 0s!
  if(surveyData[i].viewed === 0) {
    percentage = 0;
  }

  // recommended logic
  if (percentage < 25) {
    recommend = 'N';
  } else {
    recommend = 'Y';
  }
  tableRow = document.createElement('tr');
  var bodyData = [surveyData[i].capitalName, surveyData[i].viewed, surveyData[i].clicked,
    percentage + '%', recommend];

  for (var j = 0; j < bodyData.length; j++) {
    var tableData = document.createElement('td');
    tableData.textContent = bodyData[j];

    if (bodyData[j] === recommend) {
      if(recommend === 'Y') {
        tableData.classList.add('yes');
        tableRow.firstChild.classList.add('yes');
      } else {
        tableData.classList.add('no');
        tableRow.firstChild.classList.add('no');
      }
    }

    tableRow.appendChild(tableData);
  }
  theTable.appendChild(tableRow);
}
