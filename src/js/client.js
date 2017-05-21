
import "../styles/main.sass"

import * as d3 from "d3"
import topojson from "topojson"
import axios from "axios"
import Datamap from 'datamaps'

const URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"

axios.get(URL) 
		.then((response) => {

			var strikes = response.data.features


			// map the data from response.data.features in a new array of objects
				// each object should contain latitude, longitude and radius (from mass)
					// plus: Name, Date, Mass, Class, Fillkey based on mass

			console.log(d3.min(strikes, (d) => {return d.mass}),d3.max(strikes, (d) => {return d.mass}))


			// Tooltip
			// Zoom

			var meteoriteMap = new Datamap({
			  element: document.getElementById('mapContainer'),
			  scope: 'world',
			  projection: 'mercator',
			  geographyConfig: {
			      popupOnHover: false,
			      highlightOnHover: false
			  },
			  fills: {
			    // 'USA': '#1f77b4',
			    // 'RUS': '#9467bd',
			    // 'PRK': '#ff7f0e',
			    // 'PRC': '#2ca02c',
			    // 'IND': '#e377c2',
			    // 'GBR': '#8c564b',
			    // 'FRA': '#d62728',
			    // 'PAK': '#7f7f7f',
			    defaultFill: '#000'
			  },
			  data: {
			    'RUS': {fillKey: 'RUS'},
			    'PRK': {fillKey: 'PRK'},
			    'PRC': {fillKey: 'PRC'},
			    'IND': {fillKey: 'IND'},
			    'GBR': {fillKey: 'GBR'},
			    'FRA': {fillKey: 'FRA'},
			    'PAK': {fillKey: 'PAK'},
			    'USA': {fillKey: 'USA'}
			  }
			})

			meteoriteMap.bubbles(strikes, {
			    popupTemplate: (geography, data) => { 
			      return ['<div class="hoverinfo"><strong>' +  data.name + '</strong>'].join('')
					}
			})

		})
		.catch((error) => {
			console.error(error)
		})
