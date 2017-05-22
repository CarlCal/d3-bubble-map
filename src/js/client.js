
import "../styles/main.sass"

import * as d3 from "d3"

const	margin = { top: 50, left: 50, right: 50, bottom: 50 },
			width = 800 - margin.top - margin.bottom,
			height = 400 - margin.left - margin.right

			// sort strikes by mass, smallest last

			// plus: radius, Fillkey based on mass

			// Tooltip
			// Zoom


var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height)

d3.queue()
	.defer(d3.json, "https://unpkg.com/world-atlas@1.1.4/world/50m.json")
	.defer(d3.json, "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
	.await(ready)

var projection = d3.geoMercator()
	.translate([ width / 2, height / 2 ])
	.scale(75) //Zoom ???

var path = d3.geoPath()
	.projection(projection)

function ready (error, data, strikes) {
	console.log(data)

	var land = topojson.feature(data, data.objects.land).features
	
	console.log("land", land);

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
				.data(strikes.features)
				.enter()
				.append("circle")
					.attr("r", 2)
					.attr("cx", (d) => {
						var coords = projection([d.properties.reclong, d.properties.reclat,])
						return coords[0]
					})
					.attr("cy", (d) => {
						var coords = projection([d.properties.reclong, d.properties.reclat,])
						return coords[1]
					})


	console.log(strikes)
}
