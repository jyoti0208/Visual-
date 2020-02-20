var SalePrice = [];
var LotArea = [];
var TotalBsmtSF=[];
var GarageArea=[]
var WoodDeckSF=[]
var FirstFloor=[]
var MasVnrArea=[]
let myMap = new Map()
var category = ["SaleCondition", "Utilities", "LotConfig", "Neighborhood","LandSlope","HouseStyle","RoofMatl", "Heating" , "Electrical", "YrSold"];
///

var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

//Parse CSV file.
d3.csv("test_data.csv", function(csvdata) {
		
    csvdata.map(function(d) {
        SalePrice.push(+d.SalePrice);
        LotArea.push(+d.LotArea);
    })
    for(let i = 0; i < category.length; i++){
    	myMap.set(category[i], getSum(csvdata, category[i]));
    }
    console.log("map...", LotArea);
});


function getSum(data, key){
	var expensesCount = d3.nest()
  .key(function(d) { return d[key]; })
  .rollup(function(v) { return v.length; })
  .entries(data);
return expensesCount;

}

function htFn(id) {	
	document.getElementById("bar").innerHTML = '';
	if( category.indexOf(id) > -1){
		plotBarGraph(id);
	} else{
		if(id =="LotArea"){
			plotHistoGram(LotArea);
		}else if(id =="SalePrice"){
			plotHistoGram(SalePrice);
		} else if(id =="TotalBsmtSF"){
			plotHistoGram(TotalBsmtSF);
		} else if(id =="GarageArea"){
			plotHistoGram(GarageArea);
		} else if(id =="WoodDeckSF"){
			plotHistoGram(WoodDeckSF);
		} else if(id =="MasVnrArea"){
			plotHistoGram(MasVnrArea);
		} else if(id == "FirstFloor"){
			plotHistoGram(FirstFloor);
		}
	}
}



function plotBarGraph(id){
	var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "f1f1f1")
    .text("a simple tooltip");
	data = myMap.get(id);
	console.log("data..",data);

	var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
	var y = d3.scaleLinear()
          .range([height, 0]);
    var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.key; }));
  	y.domain([0, d3.max(data, function(d) { return d.value; })]);

  	 svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "barNew")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); }).on("mouseover", function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});;

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}
function plotHistoGram(values){
var color = "steelblue";
var formatCount = d3.format(",.0f");
var max = d3.max(values);
var min = d3.min(values);
var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

var yMax = d3.max(data, function(d){return d.length});
var yMin = d3.min(data, function(d){return d.length});
var colorScale = d3.scale.linear()
            .domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

var y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")").on('mouseover',mouseover)
      .on('mouseout',mouseout);

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", (x(data[0].dx) - x(0)) - 1)
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", function(d) { return colorScale(d.y) });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

}



