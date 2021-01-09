// ================================================
//                Important 
// ================================================
// Faites attention aux variables que vous donnez ! Je vous donne un exemple 'type'
// Mais il faut adapter chaque variable au nom du fichier pour éviter les soucis lors du merge !
// Pensez aussi a adapter les tailles et tout à ce que vous voulez rendre !

// Definition de la taille du svgDefo (width et height)
var wDefo = 400;
var hDefo = 400;
var radius = Math.min(wDefo, hDefo) / 2;

var svgDefo = d3.select("#grapheDeforestation")
	.append("svg")
	.attr("width", "100%")
	.attr("height", hDefo)
  	.attr("viewBox", [-wDefo / 2, -hDefo / 2, wDefo, hDefo]);

var pieDefo = d3.pie()
	.padAngle(0.005)
	.sort(null)
	.value(d => {if(d.annee === "2018") return d.perte_surface_ha})

	var data =  [{name: "<5", value: 19912018},
               {name: "5-9", value: 20501982},
               {name: "10-14", value: 20679786},
               {name: "15-19", value: 21354481},
               {name: "20-24", value: 22604232},
               {name: "25-29", value: 21698010},
               {name: "30-34", value: 21183639},
               {name: "35-39", value: 19855782},
               {name: "40-44", value: 20796128},
               {name: "45-49", value: 21370368},
               {name: "50-54", value: 22525490},
               {name: "55-59", value: 21001947},
               {name: "60-64", value: 18415681},
               {name: "65-69", value: 14547446},
               {name: "70-74", value: 10587721},
               {name: "75-79", value: 7730129},
               {name: "80-84", value: 5811429},
               {name: "≥85", value: 5938752}];

d3.csv("https://raw.githubusercontent.com/pltreger/Deforestation/main/data/perte_couverture_mondiale_par_causes.csv").then(function(data) {
	console.log(data)
	var arcsDefo = pieDefo(data);

	var colorDefo = d3.scaleOrdinal()
      .domain(data.map(d => {if(d.annee === "2018") return d.cause}))
	  .range(["#54478C","#EFEA5A","#0DB39E","#2C699A","#B9E769","#F29E4C"]);
	  
	svgDefo.selectAll("path")
	  .data(arcsDefo)
	  .enter()
	  .append("path")
		.attr("fill", d => colorDefo(d.data.cause))
		.attr("d", d3.arc().innerRadius(radius * 0.67).outerRadius(radius))

	svgDefo.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 12)
		.attr("text-anchor", "middle")
	  .selectAll("text")
	  .data(arcsDefo)
	  .enter()
	  .append("text")
		.attr("transform", d => `translate(${d3.arc().innerRadius(radius * 0.67).outerRadius(radius - 1).centroid(d)})`)
		.call(text => text.append("tspan")
			.attr("y", "-0.4em")
			.attr("font-weight", "bold")
			.text(d => {if(d.data.annee === "2018") return d.data.cause}))
		.call(text => text.append("tspan")
			.attr("x", 0)
			.attr("y", "0.7em")
			.attr("fill-opacity", 0.7)
			.text(d => {if(d.data.annee === "2018") return d.data.perte_surface_ha.toLocaleString()}));
})



  

  /*svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 2)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .enter()
    .append("text")
      .attr("transform", d => `translate(${d3.arc().innerRadius(radius * 0.67).outerRadius(radius - 1).centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
		  .text(d => d.data.value.toLocaleString()));
		  
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 var arcsDefo = pieDefo([data2]);

	var colorDefo = d3.scaleOrdinal()
      .domain([data2].map(d => d.cause))
	  .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
	  
	svgDefo.selectAll("path")
	  .data(arcsDefo)
	  .enter()
	  .append("path")
		.attr("fill", d => colorDefo(d.data.cause))
		.attr("d", d3.arc().innerRadius(radius * 0.67).outerRadius(radius))
	  .append("title")
		.text(d => `${d.data.cause}: ${d.data.perte_surface_ha.toLocaleString()}`);

	svgDefo.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 12)
		.attr("text-anchor", "middle")
	  .selectAll("text")
	  .data(arcsDefo)
	  .enter()
	  .append("text")
		.attr("transform", d => `translate(${d3.arc().innerRadius(radius * 0.67).outerRadius(radius - 1).centroid(d)})`)
		.call(text => text.append("tspan")
			.attr("y", "-0.4em")
			.attr("font-weight", "bold")
			.text(d => d.data.cause))
		.call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
			.attr("x", 0)
			.attr("y", "0.7em")
			.attr("fill-opacity", 0.7)
			.text(d => d.data.perte_surface_ha.toLocaleString())); */