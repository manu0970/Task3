# Task3
Based on the population country and year we got on the first nvd3 sample (1960 - 2016 all countries in the world), create a world map chart and combo to pick the year and display data as a plus create an animated version, transitioning from 1960 to 2016.

# Steps to reproduce the sample

## Create index.html
Index is responsible for joining all javascript and css files.
```html
<!DOCTYPE html>
<meta charset="utf-8">
<link rel="stylesheet" href="./styles.css" />
<body>
  <h1 id="showYear">1960</h1>
  
  <form id="myCombobox">
      Combo to pick Year:
      <select name="MySelectYear" id="MySelectYear"></select>
  </form>

  <script src="http://d3js.org/d3.v4.min.js"></script>
  <script src="http://d3js.org/queue.v1.min.js"></script>
  <script src="http://d3js.org/topojson.v1.min.js"></script>
  <script src="./country-data.js"></script> 
  <script src="./d3-tip.js"></script>
  <script src="./main.js"></script>

</body>
</html>
```
## Create styles.css
```css
.names {
  fill: none;
  stroke: #fff;
  stroke-linejoin: round;
}

/* Tooltip CSS */

.d3-tip {
  line-height: 1.5;
  font-weight: 400;
  font-family: "avenir next", Arial, sans-serif;
  padding: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: #FFA500;
  border-radius: 1px;
  pointer-events: none;
}

...

/*    text{
    pointer-events:none;
  }*/

.details {
  color: white;
}

h1 {
  margin: 10px 50px 0px 50px;
  font-size:60px;
}

form {
  margin: 0px 50px 15px 50px;
}
```
## Import Data
### world_countries.json
This json file contains the geometry data of each of the countries to be able to draw the map. It is independent of the data to be plotted.
```json
{"type":"FeatureCollection","features":[
  {"type":"Feature","properties":{
                            "name":"Afghanistan"},
                            "geometry":{"type":"Polygon",
                                        "coordinates":[[[61.210817,35.650072],[...],[61.210817,35.650072]]]},
                            "id":"AFG"},
{...}
]}
```
### country_data.js
This js file contains the data of each of the countries. Through the field "country code" it is related to the file world_countries.json.
```js
var countryData =[{
"Country Code": "ARB",
"Country Name": "Arab World",
"Value": 92490932.0, "Year": 1960
},
{...}
]
```

## Set up lite-server
First of all it is necessary to have installed nodejs.
https://nodejs.org/es/
From the project folder (where is index.html) run console, and type:
```cmd
npm init
```
Next step:
```cmd
npm install lite-server --save-dev
```
...and add a "script" entry within your project's package.json file:
```json
  "scripts": {    
    "dev": "lite-server"
  },
```
Finally, and whenever you want to visualize the web page type:
```cmd
npm start
```
For more information about "lite-server":

https://www.npmjs.com/package/lite-server


## Create main.js
### Set the map
The body of the html document is selected and a svg containing the map is added. In addition, the svg attributes are defined as margins, width and height.
```javascript
var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
  
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append('g')
  .attr('class', 'map');
```
Now the variable tip () is defined. This variable defines the format of the tooltips, which will show the information of the countries each time the mouse passes over them. First define the format, "d3.format (", ")" that will show the population amount, ex:"Population: 40,560,563". Later it will return an html line with the "country" and the "population".
```javascript
var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) + "</span>";
  })

svg.call(tip);
```
This code defines the scale of colors according to population density. There are 10 domains and the colors of each one is defined by the rgb format (red, green and blue).
```javascript
var color = d3.scaleThreshold()
  .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
  .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);
```
The geographic coordinates (from the "world_countries.json" file) are converted to a 2D map, using the function "d3.geoPath (). Projection ()". To see other map projections visit the following link:

https://github.com/d3/d3-geo-projection/
```javascript
var projection = d3.geoMercator()
  .scale(130)
  .translate([width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);
```
### Combobox
A combobox is created to select the year that you want to show on the map. To do this, an array is created with all the years, and then the years are added to the empty combobox created in index.html.
```javascript
var array  = [];
        for (var i = 1960; i <= 2015; i++) {
          array .push(i);
        }

          function load_years()
          {
              for(var i in array)
              { 
                  document.getElementById("MySelectYear").innerHTML += "<option value='"+array[i]+"'>"+array[i]+"</option>"; 

              }
      }

      load_years();
```
In addition, an "animated mode" is requested. Which changed the years automatically. To do this we add one more year "0", when the program detects it will pass the "animation mode".
```diff
var array  = [];
        for (var i = 1960; i <= 2015; i++) {
          array .push(i);
        }

          function load_years()
          {
            
+            document.getElementById("MySelectYear").innerHTML += "<option value='"+0+"'>"+"Animated Version"+"</option>";

              for(var i in array)
              { 
                  document.getElementById("MySelectYear").innerHTML += "<option value='"+array[i]+"'>"+array[i]+"</option>"; 

              }
      }

      load_years();
```
The variables are initialized. The variable "oldyear" is used to store the year when it is in "animation mode".
```javascript
var year = 1960;
var oldyear = year;
```
The map is initialized with the "ready" function that will be explained later.
```javascript
queue()
.defer(d3.json, "world_countries.json")
.await(ready);
```
In addition to the "animated mode", a function is created to refresh the graph and change the year every 2 seconds. Calling again "ready" with the new year.
- If the year is "0", it changes to "animated mode" adding a year to the old year.
- If the animated mode reaches the maximum year "2015", it returns to the first year "1961".
- The year is saved in "oldyear" for the next loop.
```javascript
// ANIMATED MAP each 2000ms change the year
autoRefreshChart(2000);

function autoRefreshChart(miliSeconds) {
  setInterval(function() {

    year = parseInt(document.getElementById('MySelectYear').value);
    if (year == 0) {
      year = oldyear + 1;
    }
    if(year > 2015){
      year = 1961
    }
    oldyear = year

    document.getElementById("showYear").innerHTML = year;

    queue()
    .defer(d3.json, "world_countries.json")
    .await(ready);
  }, miliSeconds);
}
```
The "ready" function loads the data on the map. 
- Create a variable "populationById", which adds the data from country_data.js to world_countries.json, realated by "Country Code".
- The variable "country" filters all the countries for the selected year and returns the "population" and the "Country Code".
- The map is drawn inside the svg that had been previously configured.
- And the tip function is added to show the tooltip.
```javascript
function ready(error, data) {
  var populationById = {};

  var countries = countryData
  .filter(data => data.Year === year)
  .map(data => ({id:data["Country Code"], population:data.Value.toString()}))
  console.log(year);
  
  countries.forEach(function (d) { populationById[d.id] = +d.population; });
  data.features.forEach(function (d) { d.population = populationById[d.id] });

  svg.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", function (d) { return color(populationById[d.id]); })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity", 0.8)
    // tooltips
    .style("stroke", "white")
    .style('stroke-width', 0.3)
    .on('mouseover', function (d) {
      tip.show(d);

      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", 3);
    })
    .on('mouseout', function (d) {
      tip.hide(d);

      d3.select(this)
        .style("opacity", 0.8)
        .style("stroke", "white")
        .style("stroke-width", 0.3);

    });
}
```
The final result is shown in the following animated image:
- The data of the chosen year "1960" is shown. When the mouse passes over a country it shows its population with a tooltip.
- In the combobox instead of selecting a year, "Animated" is selected, it will pass to the next year every 2 seconds.

<a href="https://imgflip.com/gif/25wdmt"><img src="https://i.imgflip.com/25wdmt.gif" title="made at imgflip.com"/></a>
