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
      .attr("height", function(d) { return height - y(d.value); }).on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);



  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}

            function handleMouseOver(d, i) {  // Add interactivity

            // Use D3 to select element, change color and size
            d3.select(this).attr({
              fill: "orange",
            });

            // Specify where to put label of text
            svg.append("text").attr({
               id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
                x: function() { return xScale(d.x) - 30; },
                y: function() { return yScale(d.y) - 15; }
            })
            .text(function() {
              return [d.x, d.y];  // Value of the text
            });
          }

      function handleMouseOut(d, i) {
            // Use D3 to select element, change color back to normal
            d3.select(this).attr({
              fill: "black",
              r: radius
            });

            // Select text by id and then remove
            d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
          }


function plotHistoGram(histData){
	var noOfBins = 15;
	var binWidth = (d3.max(histData) - d3.min(histData))/(noOfBins-1);
    
    // create an empty feature frequency array
    ftrFreq = Array.apply(null, Array(noOfBins)).map(Number.prototype.valueOf,0);
    binValues = [];

    // populate ftrFreq array
    histData.forEach(function(d){
        ftrFreq[Math.floor((d - d3.min(histData))/binWidth)]++;
    })

    //populate binValues
    var min = d3.min(histData);
    for(i=0; i<noOfBins; i++){
    	var end = (+min + +binWidth).toFixed(1);
    	binValues.push(min + "-" + end);
    	min = end;
    }



    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
	var y = d3.scaleLinear()
          .range([height, 0]);

// x axis of bar chart
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// y axis of bar chart
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);
	 var scaleHeight = (0.9*h/d3.max(histData));

    //Create SVG element. This is my bar chart/histogram element
    var svg = d3.select("#bar")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //Set background color of svg container or chart.
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "aliceblue");

    //colors for bar chart.
    var color = d3.scale.category20();

    //Append y axis to chart.
    svg.append("g")
        .attr("class", "y axis")
        .append("text") 
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    y.domain([0, d3.max(histData, function(d) {
        return d;
    })]);

    // x.domain(binValues)
    //     .rangePoints([0, w]);

    svg.select(".y.axis").call(yAxis);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
    
    svg.call(tip);

    //create histogram bins and its events (mouse-over, mouse-out and click)
    svg.selectAll(".bar")
        .data(histData)
    .enter().append("rect")
        .attr("class", "bar")
        .attr('fill', function(d,i){
            return color(i);
        })
        .attr("x", function(d, i) {
            return i * (w / histData.length);
        })
        .attr("y", function(d) {
            return h - (d * scaleHeight);
        })
        .attr("width", w / histData.length - barPadding)
        .attr("height", function(d) {
            return d * scaleHeight;
        })
        
        .on("mouseover", function(d,i) {
            // on mouse-over make the bin wider and higher to focus on it
            d3.select(this)
            // .transition().duration(500)
            .attr("x",i * (w / histData.length) - 5)
            .attr("y", parseInt(d3.select(this).attr("y")) - 15)         
            .attr("width",w / histData.length - barPadding + 10)
            .attr("height",parseInt(d3.select(this).attr("height")) + 15);
            
            tip.html( "<strong> <span style='color:red'>" + d + "</span></strong>");
            tip.show();


        })
        
        .on("mouseout", function(d,i) {
            // on mouse-out make the bin back to normal size
            d3.select(this)   
            // .transition().duration(500)
            .attr("x",i * (w / histData.length))         
            .attr("y",parseInt(d3.select(this).attr("y")) + 15)            
            .attr("width", w / histData.length - barPadding)
            .attr("height",parseInt(d3.select(this).attr("height")) - 15)  

            tip.hide();

  
        })

        .on("click", function() {
            document.getElementById("bar").innerHTML = '';
            tip.hide();
            createPieChart(histData);      
            chartType = 1;      
        })



}



