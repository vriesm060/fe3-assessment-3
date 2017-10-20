
/*
 *	Fatal vehicle crashes and fatalities of the USA in 2012 per state:
 *	__________________________________________________________
 *
 *	Data from: https://www-fars.nhtsa.dot.gov
 *
 *	Datasets used:
 *	______________
 *
 *	01.	Fatal crashes by state and First Harmful Event - Year: 2015
 *			https://www-fars.nhtsa.dot.gov/States/StatesCrashesAndAllVictims.aspx
 *	02.	Person killed, by state and age group - Year: 2015
 *			https://www-fars.nhtsa.dot.gov/States/StatesCrashesAndAllVictims.aspx
 *	03.	Persons killed, by state and highest driver Blood Alcohol Concentration (BAC) in crash - Year: 2015
 *			https://www-fars.nhtsa.dot.gov/States/StatesAlcohol.aspx
 *
 *	Charts used:
 *	______________
 *
 *	01.	Choropleth
 *			https://bl.ocks.org/mbostock/4060606
 *	02.	Donut chart
 *			https://bl.ocks.org/mbostock/3887193
 *	03.	Bar chart
 *			http://bl.ocks.org/Caged/6476579
 */

/*
 *	REWRITING DATA
 */

// Rewriting the state names as their abbreviations:
var stateAbbreviations = {
	'Alabama': 'AL',
	'Alaska': 'AK',
	'Arizona': 'AZ',
	'Arkansas': 'AR',
	'California': 'CA',
	'Colorado': 'CO',
	'Connecticut': 'CT',
	'Delaware': 'DE',
	'District of Columbia': 'DC',
	'Florida': 'FL',
	'Georgia': 'GA',
	'Hawaii': 'HI',
	'Idaho': 'ID',
	'Illinois': 'IL',
	'Indiana': 'IN',
	'Iowa': 'IA',
	'Kansas': 'KS',
	'Kentucky': 'KY',
	'Louisiana': 'LA',
	'Maine': 'ME',
	'Maryland': 'MD',
	'Massachusetts': 'MA',
	'Michigan': 'MI',
	'Minnesota': 'MN',
	'Mississippi': 'MS',
	'Missouri': 'MO',
	'Montana': 'MT',
	'Nebraska': 'NE',
	'Nevada': 'NV',
	'New Hampshire': 'NH',
	'New Jersey': 'NJ',
	'New Mexico': 'NM',
	'New York': 'NY',
	'North Carolina': 'NC',
	'North Dakota': 'ND',
	'Ohio': 'OH',
	'Oklahoma': 'OK',
	'Oregon': 'OR',
	'Pennsylvania': 'PA',
	'Rhode Island': 'RI',
	'South Carolina': 'SC',
	'South Dakota': 'SD',
	'Tennessee': 'TN',
	'Texas': 'TX',
	'Utah': 'UT',
	'Vermont': 'VT',
	'Virginia': 'VA',
	'Washington': 'WA',
	'West Virginia': 'WV',
	'Wisconsin': 'WI',
	'Wyoming': 'WY'
};

/*
 *	Rerouting the state codes from the embedded data file that draws
 *	the map of the USA to the state codes in my data file.
 *
 *	The two don't match exactly. There are some state codes missing
 *	from the embedded data file, like '03' and '07', therefore I had
 *	to reroute them. They are, however, in the right order.
 */

var states = {
	'01': 0,
	'02': 1,
	'04': 2,
	'05': 3,
	'06': 4,
	'08': 5,
	'09': 6,
	'10': 7,
	'11': 8,
	'12': 9,
	'13': 10,
	'15': 11,
	'16': 12,
	'17': 13,
	'18': 14,
	'19': 15,
	'20': 16,
	'21': 17,
	'22': 18,
	'23': 19,
	'24': 20,
	'25': 21,
	'26': 22,
	'27': 23,
	'28': 24,
	'29': 25,
	'30': 26,
	'31': 27,
	'32': 28,
	'33': 29,
	'34': 30,
	'35': 31,
	'36': 32,
	'37': 33,
	'38': 34,
	'39': 35,
	'40': 36,
	'41': 37,
	'42': 38,
	'44': 39,
	'45': 40,
	'46': 41,
	'47': 42,
	'48': 43,
	'49': 44,
	'50': 45,
	'51': 46,
	'53': 47,
	'54': 48,
	'55': 49,
	'56': 50
};

/*
 *	SVG
 */

// Define the margins:
var margin = {
	top: 25, 
	right: 25, 
	bottom: 25, 
	left: 25
};

// Define the sizes of the SVG:
var width = screen.width;
var height = 750;

// Select the SVG element:
var svg = d3.select('svg')
	.attr('width', width)
	.attr('height', height);

/*
 *	MAP
 */

// Current state set to 51 (USA as a whole):
var currentState = 51;

// Defining the sizes of the map:
var widthMap = width * 0.7;
var heightMap = 650;
var widthMapLegend = 300;

// Define the path as a path to draw geometric shapes:
var path = d3.geoPath();

// Create a linear scale for the color range:
var colorsMap = d3.scaleLinear()
	.range(['#FFF3F9', '#FF0073']);

// Create an ordinal scale for the map legend:
var xMap = d3.scaleOrdinal()
	.range([0, widthMapLegend]);

// Add this scale to an x axis:
var xAxisMap = d3.axisBottom(xMap);

// Create a group for the map:
var drawMap = svg.append('g')
	.attr('class', 'map')
	.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

/*
 *	MAP LEGEND
 */

// Drawing a linear gradient using the colors to fill the map:
// Helpful source: https://www.w3schools.com/graphics/svg_grad_linear.asp
drawMap.append('defs')
	.append('linearGradient')
		.attr('id', 'gradient_legend')
		.attr('x1', '0%')
		.attr('y1', '0%')
		.attr('x2', '100%')
		.attr('y2', '0%')
			.append('stop')
				.attr('offset', '0%')
				.style('stop-color', colorsMap(colorsMap.domain()[0]));

drawMap.select('linearGradient')
	.append('stop')
		.attr('offset', '100%')
		.style('stop-color', colorsMap(colorsMap.domain()[1]));

/*
 *	DONUT CHART
 */

// Defining the size of the donut chart:
var widthDonut = (width * 0.2) - margin.left;
var heightDonut = 500;

// Define the radius of the donut chart:
var radius = widthDonut / 2;

// Create an ordinal scale for the color range:
var colorsDonut = d3.scaleOrdinal()
	.range(['#E57661', '#F0433A', '#C9283E', '#7B2A3B', '#86DDB2', '#ADD96C', '#4EA64B', '#428C5C', '#165873', '#124C59', '#3E1B3C', '#AAA']);

// Define the size of the arcs of the donut chart:
var arc = d3.arc()
	.outerRadius(radius)
	.innerRadius(radius / 1.5);

// Returning the value within our data to create the donut chart:
var pie = d3.pie()
	.sort(null)
	.value(function (d) { return d.value; });

// Draw a group for the donut chart:
var drawDonut = svg.append('g')
	.attr('class', 'donut')
	.attr('transform', 'translate(' + (width - widthDonut - margin.right) + ', 0)');

/*
 *	BAR CHART
 */

// Define the size of the bar chart:
var widthBar = (width * 0.2) - margin.left;
var heightBar = 200;

// Define the scale for the x axis of the bar chart:
var xBar = d3.scaleBand()
	.rangeRound([0, widthBar]).padding(0.25);

// Define a linear scale for the y axis of the bar chart:
var yBar = d3.scaleLinear()
	.range([heightBar, 0]);

// Define the axis of the bar chart:
var xAxisBar = d3.axisBottom(xBar);
var yAxisBar = d3.axisLeft(yBar);

// Draw a group for the bar chart:
var drawBar = svg.append('g')
  .attr('class', 'barchart')
  .attr('transform', 'translate(' + (width - widthBar - margin.right) + ', ' + (heightDonut + 10) + ')');

/*
 *	LOADING DATA
 */

// Import all the data files simultaneously:
// Helpful source: https://stackoverflow.com/questions/21842384/importing-data-from-multiple-csv-files-in-d3
d3.queue()
	.defer(d3.json, 'https://d3js.org/us-10m.v1.json')
	.defer(d3.text, 'dataset0.txt')
	.defer(d3.text, 'dataset1.txt')
	.defer(d3.text, 'dataset2.txt')
	.await(function (err, us, doc0, doc1, doc2) {
		if (err) throw err;
		onload(us, [doc0, doc1, doc2]);
	});

/*
 *	CLEANING DATA
 */

function onload (us, doc) {
	// Clean all the data files from the array doc:
	for (var i = 0; i < doc.length; i++) {
		var header = doc[i].indexOf('Alabama');
		doc[i] = doc[i].slice(header).trim();
		doc[i] = doc[i].replace(/\t/g, ',');
	}

	// Format the data files into a CSV format using the map functions:
	var data0 = d3.csvParseRows(doc[0], map0);
	var data1 = d3.csvParseRows(doc[1], map1);
	var data2 = d3.csvParseRows(doc[2], map2);

	function map0 (d) {
		return {
			'stateAbbreviation': stateAbbreviations[d[0]],
			'state': d[0],
			'totalCrashes': Number(d[15]),
			'crashes': [
				{
					'type': 'Motor Vehicle',
					'value': Number(d[1])
				},
				{
					'type': 'Nonmotorist',
					'value': Number(d[3])
				},
				{
					'type': 'Fixed Object',
					'value': Number(d[5])
				},
				{
					'type': 'Object Not Fixed',
					'value': Number(d[7])
				},
				{
					'type': 'Overturn',
					'value': Number(d[9])
				},
				{
					'type': 'Other',
					'value': Number(d[11])
				},
				{
					'type': 'Unknown Crashes',
					'value': Number(d[13])
				}
			]
		}
	}

	function map1 (d) {
		return {
			'stateAbbreviation': stateAbbreviations[d[0]],
			'state': d[0],
			'totalFatalities': Number(d[13]),
			'fatalities': [
				{
					'age': '<5',
					'value': Number(d[1])
				},
				{
					'age': '5-9',
					'value': Number(d[2])
				},
				{
					'age': '10-15',
					'value': Number(d[3])
				},
				{
					'age': '16-20',
					'value': Number(d[4])
				},
				{
					'age': '21-24',
					'value': Number(d[5])
				},
				{
					'age': '25-34',
					'value': Number(d[6])
				},
				{
					'age': '35-44',
					'value': Number(d[7])
				},
				{
					'age': '45-54',
					'value': Number(d[8])
				},
				{
					'age': '55-64',
					'value': Number(d[9])
				},
				{
					'age': '65-74',
					'value': Number(d[10])
				},
				{
					'age': '>74',
					'value': Number(d[11])
				},
				{
					'age': 'Unknown',
					'value': Number(d[12])
				}
			]
		}
	}

	function map2 (d) {
		return {
			'stateAbbreviation': stateAbbreviations[d[0]],
			'state': d[0],
			'totalFatalities': Number(d[9]),
			'BAClevels': [
				{
					'level': '0.00%',
					'value': Number(d[1])
				},
				{
					'level': '0.01-0.07%',
					'value': Number(d[3])
				},
				{
					'level': '0.08%+',
					'value': Number(d[5])
				},
				{
					'level': '0.01%+',
					'value': Number(d[7])
				}
			]
		}
	}

	// Combine the data files into one file:
	data0.forEach(function (item, i) {
		// Helpful source: https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
		Object.assign(item, data1[i], data2[i]);
	});

	var data = data0;

	/*
	 *	DRAWING MAP
	 */

	// Define the domain of the color scale to be in between 0 and the max. number of crashes:
	colorsMap.domain([0, d3.max(data, function (d) { if (d.state !== 'USA') return d.totalCrashes; })]);

	// Scale the map depending on the width of the SVG (us.bbox[2] is the original width of the map):
	var scaleMap = widthMap / us.bbox[2];

	// Helpful source: https://bl.ocks.org/mbostock/4060606
	drawMap.selectAll('.state')
		.data(topojson.feature(us, us.objects.states).features)
		.enter()
			.append('g')
				.attr('class', 'state')
				.on('click', changeState);

	drawMap.selectAll('.state')
		.append('path')
			.attr('transform', 'scale(' + scaleMap + ', ' + scaleMap + ')')
			.style('opacity', 0)
			.transition()
				.delay(function (d) { return data[states[d.id]].totalCrashes; })
				.ease(d3.easeCubic)
				.duration(500)
				.style('opacity', 1)
				.attr('fill', function (d) { return colorsMap(data[states[d.id]].totalCrashes); })
				.attr('d', path);

	// Helpful source: https://stackoverflow.com/questions/13897534/add-names-of-the-states-to-a-map-in-d3-js
	drawMap.selectAll('.state')
		.append('text')
			.attr('transform', 'scale(' + scaleMap + ', ' + scaleMap + ')')
			.text(function (d) { return data[states[d.id]].stateAbbreviation; })
			.attr('x', function (d) { return path.centroid(d)[0]; })
			.attr('y', function (d) { return path.centroid(d)[1]; })
			.attr('text-anchor', 'middle')
			.style('opacity', 0)
			.transition()
				.delay(function (d) { return data[states[d.id]].totalCrashes; })
				.duration(500)
				.style('opacity', 1);

	/*
	 *	DRAWING MAP LEGEND
	 */

	// Set the domain for the legend between 0 and the max. number of crashes:
	xMap.domain([0, d3.max(data, function (d) { return d.totalCrashes; })]);

	// Draw the legend's x axis and append a label to it:
	drawMap.append('g')
		.attr('class', 'x-axis_map')
		.attr('transform', 'translate(0, ' + (heightMap + 50) + ')')
		.call(xAxisMap)
			.append('text')
				.attr('x', 0)
  			.attr('y', -35)
  			.attr('fill', '#000')
  			.style('text-anchor', 'start')
  			.text('Total crashes');
	
	// Draw the rectangle for the legend and fill this with the gradient:
	drawMap.selectAll('.x-axis_map')
		.append('rect')
			.attr('x', 0)
			.attr('y', -25)
			.attr('width', widthMapLegend)
			.attr('height', 25)
			.attr('fill', 'url(#gradient_legend)');

	/*
	 *	DRAWING DONUT CHART
	 */

	// Add the name of the state into the center of the donut chart:
	drawDonut.append('text')
		.attr('transform', 'translate(' + radius + ', ' + (radius - 20) + ')')
		.attr('text-anchor', 'middle')
		.style('opacity', 0)
		.transition()
			.delay(3000)
			.duration(500)
 			.style('opacity', 1)
			.text(data[currentState].state);

	// Add the number of crashes of the state into the center of the donut chart:
	drawDonut.append('text')
		.attr('transform', 'translate(' + radius + ', ' + (radius) + ')')
		.attr('text-anchor', 'middle')
		.style('opacity', 0)
		.transition()
			.delay(3000)
			.duration(500)
 			.style('opacity', 1)
			.text('Crashes: ' + data[currentState].totalCrashes);

	// Add the number of fatalities of the state into the center of the donut chart:
	drawDonut.append('text')
		.attr('transform', 'translate(' + radius + ', ' + (radius + 20) + ')')
		.attr('text-anchor', 'middle')
		.style('opacity', 0)
		.transition()
			.delay(3000)
			.duration(500)
 			.style('opacity', 1)
			.text('Fatalities: ' + data[currentState].totalFatalities);

	// Draw the arcs:
	drawDonut.selectAll('.arc')
		.data(pie(data[currentState].fatalities))
		.enter()
			.append('g')
				.attr('class', 'arc')
				.attr('transform', 'translate(' + radius + ', ' + radius + ')');
	
	// Select the arcs and fill them with the color that corresponds with the value:
	drawDonut.selectAll('.arc')
		.append('path')
			.attr('fill', function (d) { return colorsDonut(d.data.value); })
			.attr('d', arc)
			.each(function (d) { this._current = d; });

	// Select the arcs and add the label to it that corresponds with the value:
	drawDonut.selectAll('.arc')
		.append('text')
			.attr('transform', function (d) { return 'translate(' + arc.centroid(d) + ')'; })
      .attr('dy', '.35em')
      .style('opacity', 0)
			.transition()
				.delay(3000)
				.duration(500)
 				.style('opacity', 1)
      	.text(function (d) { if (d.data.value !== 0) return d.data.value; })
      .each(function (d) { this._current = d; });  

  /*
	 *	DRAWING DONUT LEGEND
	 */

	// Short form for better readability:
	var fatalities = data[currentState].fatalities;

	// Function to determine if the index of the age group is odd or even,
	// in order to place the legend item next or under the other item:
	var outcome = function (d) {
		if (fatalities.indexOf(d) % 2 === 0) {
			return 0;
		} else {
			return 15;
		}
	}

	// Create a group for the donut legend:
	drawDonut.append('g')
		.attr('id', 'donut_legend')
			.append('text')
				.attr('x', 0)
				.attr('y', (radius * 2) + 30)
				.text('Fatalities per age group');

	// Select and place all the legend items according to the outcome function:
	drawDonut.select('#donut_legend')
		.selectAll('.donut_legend_item')
		.data(fatalities)
		.enter()
			.append('g')
				.attr('class', 'donut_legend_item')
					.append('rect')
						.attr('x', function (d) { return (fatalities.indexOf(d) % 2 === 0 ? 0 : (widthDonut / 2)); })
						.attr('y', function (d) { return (radius * 2) + 50 + (fatalities.indexOf(d) * 15) - outcome(d); })
						.attr('width', 25)
						.attr('height', 25)
						.attr('fill', function (d) { return colorsDonut(d.value); })
		.exit()
		.remove();

	// Place the label next to the corresponding legend items:
	drawDonut.selectAll('.donut_legend_item')
		.append('text')
			.attr('transform', function (d) {
				return 'translate(' + (fatalities.indexOf(d) % 2 === 0 ? 30 : (widthDonut / 2) + 30) +
							 ', ' + ((radius * 2) + 50 + (fatalities.indexOf(d) * 15) - outcome(d) + 15) +
							 ')';
			})
			.text(function (d) { return d.age; });

	/*
   *	DRAWING BAR CHART
   */

  // Setting the domains of the x and y axis for the bar chart:
  xBar.domain(data[currentState].BAClevels.map(function (d) { return d.level; }));
  yBar.domain([0, data[currentState].totalFatalities]);

  // Draw the x-axis and assign a label to it:
  drawBar.append('g')
  	.attr('class', 'x-axis_bar')
  	.attr('transform', 'translate(0, ' + heightBar + ')')
  	.call(xAxisBar)
  		.append('text')
  			.attr('x', 0)
  			.attr('y', 40)
  			.attr('fill', '#000')
  			.style('text-anchor', 'start')
  			.text('Blood Alcohol Concentration');

  // Draw the y-axis and assign a label to it:
  drawBar.append('g')
  	.attr('class', 'y-axis_bar')
  	.call(yAxisBar)
  		.append('text')
  			.attr('transform', 'rotate(-90)')
  			.attr('x', -heightBar)
  			.attr('y', -60)
      	.attr('fill', '#000')
      	.style('text-anchor', 'start')
      	.text('Fatalities');

  // Select all bars and draw them into the chart,
  // also, assign a mouseover function to show the tooltip:
  drawBar.selectAll('.bar')
  	.data(data[currentState].BAClevels)
  	.enter()
  		.append('rect')
  			.attr('class', 'bar')
      	.attr('x', function (d) { return xBar(d.level); })
      	.attr('y', function (d) { return yBar(d.value); })
      	.attr('width', xBar.bandwidth())
      	.attr('height', function (d) { return heightBar - yBar(d.value); })
      	.attr('fill', '#FAC857')
      	.on('mouseover', function (d) {
      		// Helpful source: https://bl.ocks.org/sarubenfeld/56dc691df199b4055d90e66b9d5fc0d2
      		var xPosition = parseFloat(d3.select(this).attr('x')) + (xBar.bandwidth() * 1.5) + widthMap + 20;
      		var yPosition = parseFloat(d3.select(this).attr('y')) + (heightBar * 2) + 100;

      		d3.select('#tooltip')
      			.style('left', xPosition + 'px')
      			.style('top', yPosition + 'px')
      			.select('#value')
      			.text(d.value);

      		d3.select('#tooltip').classed('hidden', false);
      	})
      	.on('mouseout', function () {
      		d3.select('#tooltip').classed('hidden', true);
      	})
    .exit()
    .remove();

  /*
   *	INTERACTION
   */

  // Activate this function whenever you change a state:
  function changeState (d) {
  	// Change the index of the current state:
 		currentState = states[d.id];

 		/*
 		 *	UPDATE DONUT CHART
 		 */

 		drawDonut.selectAll('text')
 			.filter(function (d, i) { return i === 0; })
 			.transition()
 				.duration(375)
 				.style('opacity', 0)
 			.transition()
 				.duration(375)
 				.style('opacity', 1)
 				.text(data[currentState].state);

 		drawDonut.selectAll('text')
 			.filter(function (d, i) { return i === 1; })
 			.transition()
 				.duration(375)
 				.style('opacity', 0)
 			.transition()
 				.duration(375)
 				.style('opacity', 1)
 				.text('Crashes: ' + data[currentState].totalCrashes);

 		drawDonut.selectAll('text')
 			.filter(function (d, i) { return i === 2; })
 			.transition()
 				.duration(375)
 				.style('opacity', 0)
 			.transition()
 				.duration(375)
 				.style('opacity', 1)
 				.text('Fatalities: ' + data[currentState].totalFatalities);

 		drawDonut.selectAll('.arc')
 			.data(pie(data[currentState].fatalities));

 		drawDonut.selectAll('.arc')
 			.select('path')
 			.transition()
 				.delay(375)
 				.duration(375)
 				.attrTween('d', arcTween);

 		drawDonut.selectAll('.arc')
 			.select('text')
 			.transition()
 				.duration(375)
 				.style('opacity', 0)
 			.transition()
 				.duration(375)
 				.style('opacity', 1)
 				.attrTween('transform', labelArcTween)
 				.text(function (d) { if (d.data.value !== 0) return d.data.value; });

 		/*
 		 *	UPDATE BAR CHART
 		 */

 		xBar.domain(data[currentState].BAClevels.map(function (d) { return d.level; }));
 		yBar.domain([0, data[currentState].totalFatalities]);

 		drawBar.select('.y-axis_bar')
 			.call(yAxisBar);

 		drawBar.selectAll('.bar')
 			.data(data[currentState].BAClevels);

 		drawBar.selectAll('.bar')
 			.transition()
 				.duration(375)
 				.attr('y', function (d) { return yBar(d.value); })
 				.attr('height', function (d) { return heightBar - yBar(d.value); });
	}
}

// This function makes sure when the donut chart animates, the arc stay in a circle and don't bend:
// Helpful source: https://bl.ocks.org/mbostock/1346410
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

// This function makes sure when the donut chart animates, the labels in the arcs stay in a circle:
function labelArcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
  	return 'translate(' + arc.centroid(i(t)) + ')';
  };
}