
//var users = {};
//var usernames = [];

var width = 1000;
var height = 400;
var padding = 40;

var subchart1;

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
function drawPlot(high_scorer_objs, user) {
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

	console.log(high_scorers);
	console.log(Object.values(high_scorers));
	for (var i = 0; i < high_scorers.length; i++) {
		console.log(high_scorers[i]);
		console.log("NAME: ", high_scorers[i]["username"]);
		console.log("NUM: ", high_scorers[i]["num_solved"]);
	}
	//console.log(high_scorers[0].username);

	console.log("initPlot()");
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
		.attr("stroke-width", 5);


	var usernames = [];
  	for (var i = 0; i < high_scorers.length; i++) {
    	usernames.push(high_scorers[i].username);
  	}


	var subchart1_axis = d3.select("#chart")
							.select("svg")
							.append("g")
							.attr("transform", "translate(" + padding + "," + (1 * padding) + ")");

	var bandScale = d3.scaleBand()
						.domain(usernames)
						.range([padding * 1.5, padding * 1.5 + high_scorers.length * 20])
						.paddingInner(0.05);

	var xScale = d3.scaleLinear()
					.domain([0, d3.max(high_scorers, function(d) { return d.score})])
					.range([2 * padding, width - 2 * padding]);

	var xAxis = d3.axisTop(xScale)
					.ticks(20);


	subchart1_axis.call(xAxis);
	subchart1_axis.style("visibility", "visible");


  subchart1
         .selectAll("text")
         .data(high_scorers)
         .enter()
         .append("text")
         .attr("class", "chart_text")
         .attr("x", function(d, i) {
            return padding * 2;
         })
         .attr("y", function(d) {
            return bandScale(d.username) + 15;
         })
         .attr("text-anchor", "end")
         .text(function(d) { return d.username; })
         .style("cursor", "default")



	subchart1.selectAll("rect")
				.data(high_scorers)
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return 3 * padding;
				})
				.attr("y", function(d) {
					return bandScale(d.username);
				})
				.attr("width", function(d) {
					return xScale(d.score) - 2 * padding;
				})
				.attr("height", function(d) {
					return bandScale.bandwidth();
				})
				.attr("fill", "lightblue");



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


	console.log("appending text");
	svg.append("text")
	 .attr("x", width / 2)
     .attr("y", height - 30)
     .attr("text-anchor", "middle")
     .attr("font-size", 24)
     .attr("font-family", "sans-serif")
     .attr("stroke", "white")
     .text("TEST");



	

}

/*
function color_lookup(language) {

	if (language == "Python")



}
*/