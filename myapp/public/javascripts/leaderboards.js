
var svg;
var width;
var height;
var padding;
var data;
var subchart1;

var subchart1_axis;
var yScale;
var xScale;

var dropdown;
var dropdownChange;

var most_solved_data = [];
var most_won_data = [];


window.addEventListener("resize", drawPlot);


function init() {

	for (var i = 0; i < most_solved.length; i++) {
		most_solved_data.push({ username : most_solved[i].username,
														score : most_solved[i].total_solved,
														picture : most_solved[i].picture});

		most_won_data.push({ username : most_won[i].username,
												 score : most_won[i].games_won,
												 picture : most_won[i].picture});

	}


	dropdownChange = function() {
		var selection = d3.select(this).property('value');
		
		if (selection === "Most Games Won") {
			data = most_won_data;
		}
		else {
			data = most_solved_data;
		}
		updateBars()
	}

	dropdown = d3.select("#drop").on("change", dropdownChange);
	dropdown.selectAll("option")
			.data(["Most Games Won", "Most Puzzles Solved"])
			.enter()
			.append("option")
			.attr("value", function(d) { return d;})
			.text(function(d) {
				return d;
			});	

	data = most_won_data;
	drawPlot();

}


function drawPlot() {

	var div = $('#chart');
	width = div.width();
		
	div.css('height', (15/16) * width);


	if (svg) {
		svg.remove();
	}

	width = div.width();
	height = (7/8) * div.height();

	padding = width / 14;

	svg = d3.select("#chart")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

	subchart1_bg = d3.select("#chart").select("svg").append("g");
	subchart1 = d3.select("#chart").select("svg").append("g");


	subchart1_bg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "#172027")
		.attr("stroke", "white")
		.attr("stroke-width", 2);


	var usernames = [];
	for (var i = 0; i < data.length; i++) {
		usernames.push(data[i].username);
	}


	subchart1_axis = svg.append("g")
							.attr("class", "x axis")
							.attr("transform", "translate(" + padding + "," + (1 * padding) + ")")

	yScale = d3.scaleLinear()
						.domain([0, data.length])
						.range([padding * 1.5, padding * 1.5 + (height - padding * 1.5)]);

	xScale = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return d.score; })])
					.range([3 * padding, width - 2 * padding]);


	subchart1_axis.call(d3.axisTop(xScale).ticks(5).tickFormat(d3.format("d")));
	subchart1_axis.style("visibility", "visible");


	subchart1
				 .selectAll("text")
				 .data(data)
				 .enter()
				 .append("text")
				 .attr("class", "chart_text")
				 .attr("x", function(d, i) {
						return padding * 2.5;
				 })
				 .attr("y", function(d, i) {
						return yScale(i) + (height / (1.35 * data.length) / 1.5);
				 })
				 .attr("text-anchor", "end")
				 .attr("font-size", (width / 34).toString() + "px")
				 .text(function(d) { return d.username; })
				 .style("cursor", "default");



	subchart1
				.selectAll("image")
				.data(data)
				.enter()
				.append("image")
				.attr("x", function(d, i) {
					return padding * 3;
				})
				.attr("y", function(d, i) {
					return yScale(i);
				})
				.attr("height", function(d) {
					return height / (1.35 * data.length);
				})
				.attr("xlink:href", function(d) {
					if (d.picture) {
						return "/user/" + d.username + "/picture_resized";
					}
					else {
						return "/images/profile_placeholder.png";
					}
				});


	subchart1.selectAll(".bar")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d, i) {
					return 4 * padding;
				})
				.attr("y", function(d, i) {
					return yScale(i);
				})
				.attr("width", function(d) {
					return xScale(d.score) - 3 * padding;
				})
				.attr("height", function(d) {
					return height / (1.35 * data.length);
				})
				.attr("fill", "#dfac36")
				.attr("opacity", 0.95);

}


function updateBars() {

	var usernames = [];
	for (var i = 0; i < data.length; i++) {
		usernames.push(data[i].username);
	}

	xScale.domain([0, d3.max(data, function(d) { return d.score; })]);
	subchart1_axis.transition().duration(1000).call(d3.axisTop(xScale).ticks(5).tickFormat(d3.format("d")));

	d3.selectAll(".bar")
		.data(data)
		.transition()
		.duration(1000)
		.attr("x", function(d, i) {
			return 4 * padding;
		})
		.attr("width", function(d) {
			return xScale(d.score) - 3 * padding;
		});

	d3
	 .selectAll(".chart_text")
	 .remove();


	subchart1
				 .selectAll("text")
				 .data(data)
				 .enter()
				 .append("text")
				 .attr("class", "chart_text")
				 .attr("x", function(d, i) {
						return padding * 2.5;
				 })
				 .attr("y", function(d, i) {
						return yScale(i) + (height / (1.35 * data.length) / 1.5);
				 })
				 .attr("text-anchor", "end")
				 .attr("font-size", (width / 34).toString() + "px")
				 .text(function(d) { return d.username; })
				 .style("cursor", "default");

	d3
	 .selectAll("image")
	 .remove();

	subchart1
				.selectAll("image")
				.data(data)
				.enter()
				.append("image")
				.attr("x", function(d, i) {
					return padding * 3;
				})
				.attr("y", function(d, i) {
					return yScale(i);
				})
				.attr("height", function(d) {
					return height / (1.35 * data.length);
				})
				.attr("xlink:href", function(d) {
					if (d.picture) {
						return "/user/" + d.username + "/picture_resized";
					}
					else {
						return "/images/profile_placeholder.png";
					}
				});
}
