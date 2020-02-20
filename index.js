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
d3.csv("test_data_2.csv", function(csvdata) {
		
    csvdata.map(function(d) {
        SalePrice.push(+d.SalePrice);
        LotArea.push(+d.LotArea);
        TotalBsmtSF.push(+d.TotalBsmtSF);
        GarageArea.push(+d.GarageArea);
        WoodDeckSF.push(+d.WoodDeckSF);
        FirstFloor.push(+d.FirstFloor);
        MasVnrArea.push(+d.MasVnrArea);

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


function plotHistoGram(data){
	console.log("data...", data);
	var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

	var svg = d3.select("#my_dataviz")
  	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return d; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")


}



