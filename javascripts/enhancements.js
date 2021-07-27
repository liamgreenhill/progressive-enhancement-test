var SVG_NS = 'http://www.w3.org/2000/svg';

function supportsSvg() {
  return document.implementation &&
    (
      document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Shape', '1.0') ||
      document.implementation.hasFeature('SVG', '1.0')
    );
}

function getDataFromDefinitionList(definitionList) {
  var children = definitionList.children;
  
  var yearIndex = {};
  var data = [];
  var currentYear = null;
  
  for (var childIndex = 0; childIndex < children.length; childIndex++) {
    var child = children[childIndex];
    
    if (child.nodeName == 'DT') {
      currentYear = child.textContent;
    } else if (child.nodeName == 'DD' && currentYear !== null) {
      if (!yearIndex[currentYear]) {
        yearIndex[currentYear] = data.length;
        data.push({
          year: +currentYear,
          values: []
        });
      }
      
      data[yearIndex[currentYear]].values.push(child.textContent);
    }
  }
  return data;
}

function createSvgElement() {
  var element = document.createElementNS(SVG_NS, 'svg');
  element.setAttribute('width', '100%');
  element.setAttribute('height', '250px');
  
  // Improvement... 
  // you should set a viewBox so that when the page scales 
  // the whole timeline is still viewable.
  
  element.classList.add('timeline-visualization');
  
  return element;
}

function drawTimeline(svgElement, data) {
  var paper = Snap(svgElement);
  
  var canvasSize = parseFloat(getComputedStyle(paper.node)["width"]);
  
  var start = +data[0].year;
  var end = +data[data.length - 1].year;
  
  // add some padding
  start--;
  end++; end++;
  
  var range = end - start;
  
  paper.line(0, 200, canvasSize, 200).attr({
    'stroke': 'black',
    'stroke-width': 2
  });
  
  data.forEach(function(datum) {
    var x = canvasSize * (datum.year - start) / range;
    
    paper.circle(x, 200, 6);
    
    paper.text(x, 230, datum.year).attr({
      'text-anchor': 'middle'
    });
    
    var averageIndex = (datum.values.length - 1) / 2;
    var xOffsetSize = 24;
    datum.values.forEach(function(value, index) {
      var offset = (index - averageIndex) * xOffsetSize;
      
      paper.text(x + offset, 180, value)
        .attr({
          'text-anchor': 'start'
        })
        .transform('r -45 ' + (x + offset) + ' 180');
    });
  });
}

if (supportsSvg()) {
  var timeline = document.querySelector('.timeline');
  
  timeline.style.display = 'none';
  
  var data = getDataFromDefinitionList(timeline);
  
  var svgElement = createSvgElement();
  timeline.parentNode.insertBefore(svgElement, timeline);
  
  drawTimeline(svgElement, data);
}


function myConfetti () {
	console.log("myConfetti runs");
// do this for 5 seconds
var duration = 5 * 1000;
var end = Date.now() + duration;

(function frame() {
  // launch a few confetti from the left edge
  confetti({
    particleCount: 7,
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  });
  // and launch a few from the right edge
  confetti({
    particleCount: 7,
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  });

  // keep going until we are out of time
  if (Date.now() < end) {
    requestAnimationFrame(frame);
  }
}());
}


// Google Chart 
// Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'People who save for a pension');
    data.addColumn('number', 'Age Range');
    data.addRows([
      ['20–29', 1],
      ['30–39', 2],
      ['40–49', 3],
      ['50–59', 5],
    ]);

    // Set chart options
    var options = {'title':'Pension Savers Grouped By Age',
                   'width':400,
                   'height':300,
                   'animation':{
                     duration: 1000,
                     easing: 'out',
                     startup: 'true'
                     }
                  };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  