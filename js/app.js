
window.addEventListener('DOMContentLoaded', function() {

  var data =[]; var prices = [];
  var x = []; var y=[];
  selection_metal.addEventListener("change",function(){
    var option = document.getElementById("selection_metal").value;
    if(option == "gold")
           document.body.style.backgroundColor = "gold";
    else if(option == "silver")
           document.body.style.backgroundColor = "silver";
    else if (option == "copper")
          document.body.style.backgroundColor = "copper";

    
  });
  get_live_price.addEventListener("click",function(){
    var option = document.getElementById("selection_metal").value;
    var url_load = "";
    var grams="";
    console.log(option);
    if(option == "gold"){
      url_load = "http://www.quandl.com/api/v1/datasets/CHRIS/MCX_GC1.json?auth_token=bVaeLgsvxEp9Fakb-33G"
      grams = "10gm";
    }
    else if (option == "silver"){
      url_load = "http://www.quandl.com/api/v1/datasets/CHRIS/MCX_SI1.json?auth_token=bVaeLgsvxEp9Fakb-33G"
      grams = "1kg";
    }
    else if (option == "copper"){
      url_load = "http://www.quandl.com/api/v1/datasets/CHRIS/MCX_CU1.json?auth_token=bVaeLgsvxEp9Fakb-33G"
      grams = "1kg" ;
    }
    console.log(url_load);
    $.ajax({
       url : url_load,
       xhr: function() {
       return new window.XMLHttpRequest( {
        mozSystem: true
         } );
      },
      success: function(response){
        window.response = JSON.parse(response);
        console.log(window.response.data[0]);
        console.log(window.response.data[0][4]);
        document.getElementById("metal_price").innerHTML = "<br>The Price is: Rs.<b>"+window.response.data[0][4]+"</b>/"+grams+"<br>Date:"+window.response.data[0][0]+"<br>";
        for(var i=0;i<10;i++){
          var date = new Date(window.response.data[i][0]);
          var price = window.response.data[i][4];
                  
          data.push(date);
          prices.push(price/10000);
          
        }
       var pass = [
         {
           x : data,
           y : price,
           type: "scatter"
         }
       ]
      }
      });
  });
   
 /* show_chart.addEventListener("click",function(){
     var option = document.getElementById("selection_metal").value;
    var url_load = "";
     if(option == "gold"){
      url_load = "http://www.quandl.com/api/v1/datasets/CHRIS/MCX_GC1.png?auth_token=bVaeLgsvxEp9Fakb-33G"
      
    }
    else if (option == "silver"){
      url_load = "http://www.quandl.com/api/v1/datasets/CHRIS/MCX_SI1.png?auth_token=bVaeLgsvxEp9Fakb-33G"
      
    }
    else if (option == "copper"){
      url_load = "http://www.quandl.com/api/v1/datasets/CHRIS/MCX_CU1.png?auth_token=bVaeLgsvxEp9Fakb-33G"
     }
    
    document.getElementById("display_chart").innerHTML = "<img src="+ "\""+url_load+"\" style=\"width:100%;height:60%;\"></img>";

});*/
  
  show_chart.addEventListener("click",function(){
  /* implementation heavily influenced by http://bl.ocks.org/1166403 */
		
		// define dimensions of graph
		var m = [80, 80, 80, 80]; // margins
		var w = 1000 - m[1] - m[3]; // width
		var h = 400 - m[0] - m[2]; // height
		
		// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
		var data = prices;
    console.log(data);
		// X scale will fit all values from data[] within pixels 0-w
		var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
		// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
		var y = d3.scale.linear().domain([0,5]).range([h, 10]);
			// automatically determining max range can work something like this
			// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

		// create a line function that can convert data[] into x and y points
		var line = d3.svg.line()
			// assign the X function to plot our line as we wish
			.x(function(d,i) { 
				// verbose logging to show what's actually being done
				console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
				// return the X coordinate where we want to plot this datapoint
				return x(i); 
			})
			.y(function(d) { 
				// verbose logging to show what's actually being done
				console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
				// return the Y coordinate where we want to plot this datapoint
				return y(d); 
			})

			// Add an SVG element with the desired dimensions and margin.
			var graph = d3.select("#graph").append("svg:svg")
			      .attr("width", w + m[1] + m[3])
			      .attr("height", h + m[0] + m[2])
			    .append("svg:g")
			      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			// create yAxis
			var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
			// Add the x-axis.
			graph.append("svg:g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + h + ")")
			      .call(xAxis);


			// create left yAxis
			var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
			// Add the y-axis to the left
			graph.append("svg:g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(-25,0)")
			      .call(yAxisLeft);
			
  			// Add the line by appending an svg:path element with the data line we created above
			// do this AFTER the axes above so that the line is above the tick-lines
  			graph.append("svg:path").attr("d", line(data));
           
  });
  
});