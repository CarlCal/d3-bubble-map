
import "../styles/main.sass"

import * as d3 from "d3"

const	margin = { top: 50, left: 50, right: 50, bottom: 50 },
			width = 910 - margin.top - margin.bottom,
			height = 600 - margin.left - margin.right

var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height)

d3.queue()
	.defer(d3.json, "https://unpkg.com/world-atlas@1.1.4/world/50m.json")
	.defer(d3.json, "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
	.await(ready)

var projection = d3.geoMercator()
	.translate([ width / 2, height / 2 ])
	.scale(135)

var path = d3.geoPath()
	.projection(projection)

var tooltip = d3.select(".card")
								.append("div")
									.attr("class", "toolTip")

function ready (error, data, strikes) {

	var land = topojson.feature(data, data.objects.land).features,
			sortedStrikes = strikes.features.sort((a, b) => { return +b.properties.mass - a.properties.mass })

	var radius = d3.scaleSqrt().range([1, 15])
			.domain([0, 1e6])

	var massFormat = d3.format(".1s") // ???

	chart.append("g")
				.attr("class", "landContainer")
			.selectAll(".land")
			.data(land)
			.enter()
			.append("path")
				.attr("class", "land")
				.attr("d", path)

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
					var coords = projection([d.properties.reclong, d.properties.reclat,])
					return coords[0]
				})
				.attr("cy", (d) => {
					var coords = projection([d.properties.reclong, d.properties.reclat,])
					return coords[1]
				})
				.on("mouseover", (d) => {

					var name = d.properties.name,
							mass = massFormat(d.properties.mass),
							recclass = d.properties.recclass,
							year = d.properties.year.substr(0, 4)

					tooltip
	         	.html(['<p>' + name + '</p>',
         				   '<p>' + mass + '</p>',
         				   '<p>' + recclass + '</p>',
         				   '<p> ' + year + ' </p>'].join(''))
	         	.style("opacity", "0.9")
	         	.style("left", (d3.event.pageX) + "px") // placing off tool tip on hover
	         	.style("top", (d3.event.pageY) + "px")
				})
				.on("mouseout", () => { 
					tooltip
						.style("opacity", "0") 
				})

	var legend = chart.append("g")
			    .attr("class", "legendSpectrum")
			    .attr("transform", "translate(" + 50 + "," + (height - 20) + ")")
			  .selectAll("g")
			    .data([1e6, 3e6, 6e6])
			  	.enter()
			  .append("g")

	legend.append("circle")
					.attr("class", "legendRing")
					.attr("r", radius)
					.attr("cy", (d) => { return -radius(d); })
		    
  legend.append("text")
			  	.attr("class", "legendLabel")
			  	.attr("y", (d) => { return -2 * radius(d); })
			  	.attr("dy", "0.9em")
			  	.attr("dx", "-0.2em")
			  	.attr("fill", "black")
			  	.style("font-size", "17px")
			  	.text((d) => { return d/1000000 })

	legend.append("text")
					.attr("class", "format")
					.attr("dx", "2em")
					.attr("fill", "black")
			  	.style("font-size", "14px")
			  	.text("metric ton(ne)")

	// legend.append("text")
	// 	    .attr("y", function(d) { return -2 * radius(d); })
	// 	    .attr("dy", "1.3em")
	// 	    .text(d3.format(".1s"));


}
