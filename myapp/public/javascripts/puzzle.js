
var svg;
var subchart_bg;
var subchart;
var users = {};
var usernames = [];
var width;
var height;
var legend_width = 150;
var legend_height = 160;
var legend_svg;

var padding = 40;


window.addEventListener("resize", drawPlot);


function drawPlot() {

	$("#difficulty").css("color", difficulty_color(puzzle.difficulty));

	var div = $('#chart');
	var width = div.width();
		
	div.css('height', (15/16) * width);


	if (svg) {
		svg.remove();
		legend_svg.remove();
	}

	var langs = ["Python", "Scheme", "JavaScript", "Haskell"];

	width = div.width();
	height = (7/8) * div.height();

	svg = d3.select("#chart")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

	legend_svg = d3.select("#legend")
			.append("svg")
			.attr("width", legend_width)
			.attr("height", legend_height);

	chart_bg = d3.select("#chart").select("svg").append("g");
	legend_bg = d3.select("#legend").select("svg").append("g");


	var xScale = d3.scaleLinear()
					//.domain([0, d3.max(fastest_solutions, function(d){ return parseFloat(d.time); })])
					.range([2*padding, width-2*padding]);

	var yScale = d3.scaleLinear()
					//.domain([0, d3.max(fastest_solutions, function(d){ return parseInt(d.length); })])
					.range([height-2*padding, 2*padding]);

	var xAxis = d3.axisBottom(xScale)
					.ticks(width / 100);

	var yAxis = d3.axisLeft(yScale)
					.ticks(height / 100);




	var xAxisHandle = svg.append("g")
		.attr("transform", "translate(0," + (height - 2*padding) + ")")
		.call(xAxis);

	var yAxisHandle = svg.append("g")
		.attr("transform", "translate(" + 2*padding + ",0)")
		.call(yAxis);

	svg.append("text")
		.attr("transform", "translate(" + (width/2) + " ," +
											(height - padding + 10) + ")")
		.style("text-anchor", "middle")
		.text("Time (seconds)");

	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", padding)
		.attr("x", 0 - (height/2))
		.style("text-anchor", "middle")
		.text("Length (characters)");

	chart_bg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "#172027")
		.attr("stroke", "white")
		.attr("stroke-width", 2);

	legend_bg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", legend_width)
		.attr("height", legend_height)
		.attr("fill", "#172027")
		.attr("stroke", "white")
		.attr("stroke-width", 2);

	legend_svg.selectAll("circle")
		.data(langs)
		.enter()
		.append("circle")
		.attr("cx", padding/2)
		.attr("cy", function(d, i) {
			return padding + i*25;
		})
		.attr("r", 5)
		.attr("fill", function(d) {
			return lang_color(d.toLowerCase());
		})
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	legend_svg.selectAll("text")
			.data(langs)
			.enter()
			.append("text")
			.attr("x", padding)
			.attr("y", function(d, i) {
				return padding + 5 + i*25;
			})
			.attr("text-anchor", "left")
			.text(function(d) {
				return d;
			})
			.attr("font-size", 14);


	var tooltip = d3.select("#chart").append("div")
					.attr("class", "tooltip")
					.style("opacity", 0);


	var tip_mouseover = function(d) {

		var html = "<strong>User: </strong>" + d.username + "</br>" 
					+ "<strong>Time: </strong>" + d.time + " seconds</br>" 
					+ "<strong>Length: </strong>" + d.length + " characters";
		tooltip.html(html)
			.style("left", (d3.event.pageX + 15) + "px")
			.style("top", (d3.event.pageY - 28) + "px")
			.transition()
			.duration(200)
			.style("opacity", 0.9);
	};

	var tip_mouseout = function(d) {
		tooltip.transition()
				.duration(300)
				.style("opacity", 0);
	};


	var update_plot = function(solutions) {

		xScale.domain([0, d3.max(solutions, function(d){ return parseFloat(d.time); })]);
		yScale.domain([0, d3.max(solutions, function(d){ return parseInt(d.length); })]);

		xAxisHandle.call(xAxis);
		yAxisHandle.call(yAxis);


		var points = svg.selectAll(".sol_points").data(solutions);

		points.enter()
				.append("circle")
				.attr("class", "sol_points")
				.attr("cx", function(d){
					return xScale(parseFloat(d.time));
				})
				.attr("cy", function(d){
					return yScale(parseInt(d.length));
				})
				.attr("r", 5)
				.attr("fill", function(d){
					return lang_color(d.language);
				})
				.attr("stroke", "black")
				.attr("stroke-width", 1)
				.on("mouseover", tip_mouseover)
				.on("mouseout", tip_mouseout)
				.attr("cursor", "pointer");

		points.transition().duration(250)
				.attr("cx", function(d){
					return xScale(parseFloat(d.time));
				})
				.attr("cy", function(d){
					return yScale(parseInt(d.length));
				})
				.attr("fill", function(d){
					return lang_color(d.language);
				});

	};

	var dropdownChange = function() {
		var selection = d3.select(this).property('value');
		if (selection === "Fastest") {
			update_plot(fastest_solutions);
		}
		else {
			update_plot(shortest_solutions);
		}
	}

	var dropdown = d3.select("#drop").on("change", dropdownChange);
	dropdown.selectAll("option")
			.data(["Fastest", "Shortest"])
			.enter()
			.append("option")
			.attr("value", function(d) { return d;})
			.text(function(d) {
				return d;
			});

	update_plot(fastest_solutions);

}

