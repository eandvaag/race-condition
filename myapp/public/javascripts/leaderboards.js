
//var users = {};
//var usernames = [];
var svg;
var width;//= 1000;
var height;// = 400;
var padding = 40;
var data;
var subchart1;

var subchart1_axis;
var yScale;
var xScale;

var dropdown;
var dropdownChange;

var most_solved_data = [];
var most_won_data = [];
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
	initPlot();


})
*/

window.addEventListener("resize", drawPlot);

//

function init() {
	console.log("most_solved", most_solved);
	console.log("most_won", most_won);
//console.log(Object.values(most_solved));
	for (var i = 0; i < most_solved.length; i++) {
		most_solved_data.push({ username : most_solved[i].username,
														score : most_solved[i].total_solved});

		most_won_data.push({ username : most_won[i].username,
												 score : most_won[i].games_won});

	}


	dropdownChange = function() {
		var selection = d3.select(this).property('value');
		
		console.log("you selected", selection);
		
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

	//data = //d3.select("#drop").property('value');
	data = most_won_data;
	console.log(data);
	drawPlot();

}


function drawPlot() {
	console.log(data);
	/*
	console.log(high_scorer_objs);
	console.log(JSON.stringify(high_scorer_objs));
*/
	//console.log(JSON.stringify(user));
	//var high_scorers = [];

	//for (high_scorer_obj in high_scorer_objs) {
	//	console.log(JSON.stringify(high_scorer_obj));
	//	high_scorers.push(JSON.stringify(high_scorer_obj));
	//}
	var div = $('#chart');
	var width = div.width();
		
	div.css('height', (15/16) * width);


	if (svg) {
		svg.remove();
	}

	width = div.width();
	height = (7/8) * div.height();


/*
	console.log(most_solved);
	console.log(Object.values(most_solved));
	for (var i = 0; i < most_solved.length; i++) {
		console.log(most_solved[i]);
		console.log("NAME: ", most_solved[i]["username"]);
		console.log("NUM: ", most_solved[i]["total_solved"]);
	}*/
	//console.log(high_scorers[0].username);

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
		//.attr("opacity", 0.25)
		.attr("stroke", "white")
		.attr("stroke-width", 2);


	var usernames = [];
	for (var i = 0; i < data.length; i++) {
		usernames.push(data[i].username);
	}


	subchart1_axis = //d3.select("#chart")
							//.select("svg")
							svg.append("g")
							.attr("class", "x axis")
							.attr("transform", "translate(" + padding + "," + (1 * padding) + ")")
/*
	bandScale = d3.scaleBand()
						.domain(usernames)
						.range([padding * 1.5, padding * 1.5 + data.length * 20])
						.paddingInner(0.05);
						*/
	yScale = d3.scaleLinear()
						.domain([0, data.length])
						.range([padding * 1.5, padding * 1.5 + (height - padding * 1.5)]); //data.length * 20]);
						//.paddingInner(0.05);
	xScale = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return d.score; })])
					.range([2 * padding, width - 2 * padding]);

	//xAxis = d3.axisTop(xScale)
	//				.ticks(5);


							//.call(xAxisCall);


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
				 .text(function(d) { return d.username; })
				 .style("cursor", "default");



	subchart1.selectAll(".bar")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d, i) {
					return 3 * padding;
				})
				.attr("y", function(d, i) {
					return yScale(i);
				})
				.attr("width", function(d) {
					return xScale(d.score) - 2 * padding;
				})
				.attr("height", function(d) {
					return height / (1.35 * data.length); //bandScale.bandwidth();
				})
				.attr("fill", "#dfac36")
				.attr("opacity", 0.95);



/*
	var bandScale = d3.scaleBand()
					.domain(high_scorers)
					.range([padding, width-padding])
					.paddingInner(0.1);

	var yScale = d3.scaleLinear()
					.domain([0, d3.max(high_scorers, function(d) { return parseInt(d.num_solved); })])
					.range([padding, height - padding]);


	console.log("adding rects");
	subchart1.selectAll("rect")
		.data(high_scorers)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			//console.log(d.username);
			//return width/2;
			return bandScale(d.username);
		})
		.attr("y", function(d) {
			//return height/2;
			return height - yScale(parseInt(d.num_solved));
		})
		.attr("width", function(d) {
			//return 20;
			return bandScale.bandwidth();
		})
		.attr("height", function(d) {
			//return 10;
			//return d.score;
			//console.log("yScale(d.score)", yScale(d.num_completed));
			return yScale(parseInt(d.num_solved)) - padding;
			//return height - padding;
			//return height - d[score];;

		})
		.attr("fill", "#111144");
*/

/*
	console.log("appending text");
	svg.append("text")
	 .attr("x", width / 2)
		 .attr("y", height - 30)
		 .attr("text-anchor", "middle")
		 .attr("font-size", 24)
		 .attr("font-family", "sans-serif")
		 .attr("stroke", "white")
		 .text("TEST");*/
}


function updateBars() {
	console.log("update bars", data);

	var usernames = [];
	for (var i = 0; i < data.length; i++) {
		usernames.push(data[i].username);
	}


	console.log("updating axis");


	xScale.domain([0, d3.max(data, function(d) { return d.score; })]);
					//.range([2 * padding, width - 2 * padding]);
	subchart1_axis.transition().duration(1000).call(d3.axisTop(xScale).ticks(5).tickFormat(d3.format("d")));
/*
	var t = d3.transition().duration(1000);

	//svg.select(".x")
	subchart1_axis
			.transition(t)
			.call(xAxis);*/

/*
	bandScale.domain(usernames)
					.range([padding * 1.5, padding * 1.5 + most_solved.length * 20])
					.paddingInner(0.05);

	xScale.domain([0, d3.max(most_solved, function(d) { return d.score; })])
				.range([2 * padding, width - 2 * padding]);


	xAxis = d3.axisTop(xScale)
					.ticks(20);
	//var xAxis = d3.axisTop(xScale)
	//				.ticks(20);

	subchart1_axis.call(xAxis);
	subchart1_axis.style("visibility", "visible");
	*/
	console.log("updating bars");

	d3.selectAll(".bar")
		.data(data)
		.transition()
		.duration(1000)
		.attr("x", function(d, i) {
			return 3 * padding;
		})
		/*
		.attr("y", function(d, i) {
			return yScale(i);//bandScale(d.username);
		})*/
		.attr("width", function(d) {
			return xScale(d.score) - 2 * padding;
		});
		/*
		.attr("height", function(d) {
			return height / (1.35 * data.length);;
		});*/
		//.attr("fill", "lightblue");
/*
	d3
	 .selectAll(".chart_text")
	 .remove();
*/

	d3.selectAll(".chart_text").each(function(d, i) {
		d3.select(this).text(data[i].username);
	});
	/*
	d3.selectAll(".chart_text")
		.data(data)
		.enter()
		.append("text")
	 .attr("class", "chart_text")
	 //.data(data)
	 //.transition()
	 //.duration(1000)
	 //.append("text")
	 //.attr("class", "chart_text")
	 .attr("x", function(d, i) {
			return padding * 2.5;
	 })
	 .attr("y", function(d, i) {
			return yScale(i) + (height / (1.35 * data.length) / 1.5)
	 })
	 .attr("text-anchor", "end")
	 .text(function(d) { return d.username; })
	 .style("cursor", "default");*/
}
/*
function color_lookup(language) {

	if (language == "Python")



}
*/