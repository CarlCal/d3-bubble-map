
import "../styles/main.sass"

import * as d3 from "d3"
import topojson from "topojson"
import axios from "axios"

import Datamap from 'datamaps'

var meteoriteMap = new Datamap({
  element: document.getElementById('mapContainer'),
  scope: 'world',
  projection: 'mercator',
  geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false
  },
})

//const URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",

// axios.get(URL) 
// 		.then((response) => {

// 		})
// 		.catch((error) => {
// 			console.error(error)
// 		})
