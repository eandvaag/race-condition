
var svg;
var subchart_bg;
var subchart;
var users = {};
var usernames = [];
var width;// = 800;
var height;// = 600;
var legend_width = 150;
var legend_height = 160;
var legend_svg;

var padding = 40;

/*
$(function() {
		var div = $('#chart');
		var width = div.width();
		
		div.css('height', width);
});*/
/*
d3.csv("../sample_data/sample_scores.csv").then(function(data) {
	console.log("LEADERBOARDS.js");
	//console.log(data);
	users = data;
	
	data.forEach(function(d) {
		//console.log(data.username, ": ", data.score);
		usernames.push(d.username);
		//users[d.username] = d.score;
	});
	
	console.log("users: ", users);
	drawPlot();


})
*/
//drawPlot()
window.addEventListener("resize", drawPlot);


function drawPlot() {
//function drawPlot(puzzle) {


	$("#difficulty").css("color", difficulty_color(puzzle.difficulty));

	var div = $('#chart');
	var width = div.width();
		
	div.css('height', (15/16) * width);


	if (svg) {
		svg.remove();
		legend_svg.remove();
	}

	console.log('fastest_solutions', fastest_solutions);
	console.log('shortest_solutions', shortest_solutions);
/*
	var fastest_solutions = [{ id: 3, username: 'erik', puzzle_name: 'fibonacci', language: 'javascript',
								time: 0.02, length: 125},
								{ id: 2, username: 'erik', puzzle_name: 'fibonacci', language: 'javascript',
								time: 0.03, length: 200},
								{ id: 94, username: 'ian', puzzle_name: 'fibonacci', language: 'python',
								time: 0.04, length: 106},
								{ id: 4, username: 'erik', puzzle_name: 'fibonacci', language: 'scheme',
								time: 0.14, length: 125}]

	var shortest_solutions = [{ id: 7, username: 'erik', puzzle_name: 'fibonacci', language: 'python',
								time: 0.93, length: 45},
								{ id: 9, username: 'erik', puzzle_name: 'fibonacci', language: 'python',
								time: 0.72, length: 49},
								{ id: 67, username: 'ian', puzzle_name: 'fibonacci', language: 'python',
								time: 0.64, length: 70},
								{ id: 58, username: 'erik', puzzle_name: 'fibonacci', language: 'scheme',
								time: 0.44, length: 97}]
*/

	var langs = ["Python", "Scheme", "JavaScript", "Haskell"];




	console.log('drawPlot()');
	console.log('puzzle', puzzle);
	console.log('puzzle name', puzzle.name);
	//console.log('solutions', solutions);

	//let chart_div = document.getElementById("chart");

	width = div.width();
	height = (7/8) * div.height();/*
	console.log("chart width:", chart_div.clientWidth);
	console.log("chart height:", chart_div.clientHeight);*/

	svg = d3.select("#chart")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
			//.attr("preserveAspectRatio", "xMinYMin meet")
			//.attr("viewBox", "0 0 height width");
			//.attr("width", chart_div.clientWidth)
			//.attr("height", chart_div.clientHeight);

	legend_svg = d3.select("#legend")
			.append("svg")
			.attr("width", legend_width)
			.attr("height", legend_height);

	chart_bg = d3.select("#chart").select("svg").append("g");
	legend_bg = d3.select("#legend").select("svg").append("g");



	//var dropdown = d3.select("#legend").select("svg")
		//.insert("select", "svg")
		//.on("change", dropdownChange);
	//subchart = d3.select("#chart").select("svg").append("g");
	//legend = d3.select("#chart").select("svg").append("g");
	//var dropdown = d3.select("#chart").insert("select", "svg").style("top", "400px").style("left", "250px");//.on("change", drowdownChange);
	//var dropdown = d3.select("#legend").insert("select").style("top", "-400px").style("left", "-250px");
	//var dropdown = legend_bg.insert("select", "svg");




	//var xAxis = d3.svg.axis()
	//				.scale(xScale)
	//				.orient("bottom");
/*
	var legend = svg.append("g")
					.attr("transform", "translate(50, 30)")
					.style("font-size", "12px")
					.call(d3.legend);
					*/

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
		//.attr("class", "axis")
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
		//.attr("transform", "translate(" + padding + " ," +
		//									(height/2) + ")")
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
		//.attr("opacity", 0.25)
		.attr("stroke", "white")
		.attr("stroke-width", 2);

	legend_bg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", legend_width)
		.attr("height", legend_height)
		.attr("fill", "#172027")
		//.attr("opacity", 0.25)
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



/*
	svg.selectAll("circle")
			.data(solutions)
			.enter()
			.append("circle")
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
			*/


	var tip_mouseover = function(d) {
		//console.log("mouseover on ", d.username);
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

		console.log("NEW SOLUTIONS: ", solutions);

		xScale.domain([0, d3.max(solutions, function(d){ return parseFloat(d.time); })]);
		yScale.domain([0, d3.max(solutions, function(d){ return parseInt(d.length); })]);

		xAxisHandle.call(xAxis);
		yAxisHandle.call(yAxis);


		var points = svg.selectAll(".sol_points").data(solutions);

		//svg.selectAll("circle")
		//		.data(solutions)
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

		//		.attr("cy", )


		//svg.selectAll("circle").remove();

	};

	var dropdownChange = function() {
		var selection = d3.select(this).property('value');
		console.log("you selected", selection);
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





	console.log("done");




}

