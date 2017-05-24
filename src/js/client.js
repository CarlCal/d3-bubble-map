
import "../styles/main.sass"

import * as d3 from "d3"

/*Defining the width of the svg element with a margin in mind*/
const	margin = { top: 50, left: 50, right: 50, bottom: 50 },
			width = 910 - margin.top - margin.bottom,
			height = 600 - margin.left - margin.right

/*Setting the size of the svg element*/
var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height)

/*Collecting the necessary data before calling the ready function*/
d3.queue()
	.defer(d3.json, "https://unpkg.com/world-atlas@1.1.4/world/50m.json")
	.defer(d3.json, "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
	.await(ready)

/*Creating a projection for displaying a round map on a flat surface*/
var projection = d3.geoMercator()
	.translate([ width / 2, height / 2 ])
	.scale(135)

var path = d3.geoPath()
	.projection(projection)

/*Creating a div as a tooltip*/
var tooltip = d3.select(".card")
								.append("div")
									.attr("class", "toolTip")

/*Callback when the data is collected*/
function ready (error, data, strikes) {
	/*If any, console error*/
	if (error) {console.log(error)}

	/*Make the topojson data workable*/
	/*Sort the strikes by size, biggest first*/
	var land = topojson.feature(data, data.objects.land).features,
			sortedStrikes = strikes.features.sort((a, b) => { return +b.properties.mass - a.properties.mass })

	/*Define a scale for the bubbles radius based on the mass of the meteorite*/
	var radius = d3.scaleSqrt().range([1, 15])
			.domain([0, 1e6])

	var massFormatK = d3.format(",")

	/*Append the world map to the svg*/
	chart.append("g")
				.attr("class", "landContainer")
			.selectAll(".land")
			.data(land)
			.enter()
			.append("path")
				.attr("class", "land")
				.attr("d", path)

	/*Append all the bubbles to chart*/
	chart.append("g")
				.attr("class", "strikesCollection")
			.selectAll(".strike")
			.data(sortedStrikes)
			.enter()
			.append("circle")
				.attr("class", "strike")
				.attr("fill", "red")
				.attr("r", (d) => { return radius(+d.properties.mass) })
				.attr("cx", (d) => {
					/*Calculate the corresponding longitude value*/
					var coords = projection([d.properties.reclong, d.properties.reclat,])
					return coords[0]
				})
				.attr("cy", (d) => {
					/*Calculate the corresponding latitude value*/
					var coords = projection([d.properties.reclong, d.properties.reclat,])
					return coords[1]
				})
				.on("mouseover", (d) => {
					/*On mouseover display the tooltip*/
					var name = d.properties.name,
							recclass = d.properties.recclass,
							year = d.properties.year.substr(0, 4),
							mass = (d.properties.mass >= 1e6) ? 
										 (d.properties.mass/1e6) + " metric tonnes" :
										 massFormatK(d.properties.mass) + " kilograms"

					tooltip
	         	.html(['<div class="tipText">',
	         				 '<p><strong>Name: </strong>' + name + '</p>',
         				   '<p><strong>Mass: </strong>' + mass + '</p>',
         				   '<p><strong>Class: </strong>' + recclass + '</p>',
         				   '<p><strong>Year: </strong>' + year + '</p>',
         				   '</div>'].join(''))
	         	.style("opacity", "0.9")
	         	.style("left", () => { return (d3.event.pageX >= (window.innerWidth - 130)) ? 
	         																(d3.event.pageX - 200) + "px" :
	         																(d3.event.pageX + 20) + "px" })
	         	.style("top", () => { return (d3.event.pageY >= (window.innerHeight - 130)) ? 
	         															 (d3.event.pageY - 100) + "px" :
	         															 (d3.event.pageY + 20) + "px" })
				})
				.on("mouseout", () => { 
					tooltip
						.style("opacity", "0") 
				})
	/*Append legend*/
	var legend = chart.append("g")
			    .attr("class", "legendSpectrum")
			    .attr("transform", "translate(" + 50 + "," + (height - 20) + ")")
			  .selectAll("g")
			    .data([1e6, 3e6, 6e6])
			  	.enter()
			  .append("g")

	/*Legend symbol*/
	legend.append("circle")
					.attr("class", "legendRing")
					.attr("r", radius)
					.attr("cy", (d) => { return -radius(d); })

	/*Legend numbers*/
  legend.append("text")
			  	.attr("class", "legendLabel")
			  	.attr("y", (d) => { return -2 * radius(d); })
			  	.attr("dy", "0.9em")
			  	.attr("dx", "-0.3em")
			  	.attr("fill", "black")
			  	.style("font-size", "17px")
			  	.text((d) => { return d/1e6 })

	/*Legend text*/
	legend.append("text")
					.attr("class", "format")
					.attr("dx", "2.5em")
					.attr("fill", "black")
			  	.style("font-size", "14px")
			  	.text("metric ton(ne)")
}
