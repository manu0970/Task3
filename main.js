//SET MAP

var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append('g')
  .attr('class', 'map');

var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) + "</span>";
  })

svg.call(tip);

var color = d3.scaleThreshold()
  .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
  .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

var projection = d3.geoMercator()
  .scale(130)
  .translate([width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

// COMBOBOX to pick year

var array  = [];
        for (var i = 1960; i <= 2015; i++) {
          array .push(i);
        }

          function load_years()
          {
            
            document.getElementById("MySelectYear").innerHTML += "<option value='"+0+"'>"+"Animated Version"+"</option>";

              for(var i in array)
              { 
                  document.getElementById("MySelectYear").innerHTML += "<option value='"+array[i]+"'>"+array[i]+"</option>"; 

              }
      }

      load_years();

// INICIALITE MAP

var year = 1960;
var oldyear = year;
// World_countries extracted from: https://raw.githubusercontent.com/jdamiani27/Data-Visualization-and-D3/master/lesson4/world_countries.json
queue()
.defer(d3.json, "world_countries.json")
.await(ready);

// ANIMATED MAP each 2000ms change the year
autoRefreshChart(2000);

//Funtions

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




