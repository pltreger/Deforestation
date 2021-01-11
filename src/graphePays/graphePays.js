// ================================================
//                Important 
// ================================================
// Faites attention aux variables que vous donnez ! Je vous donne un exemple 'type'
// Mais il faut adapter chaque variable au nom du fichier pour éviter les soucis lors du merge !
// Pensez aussi a adapter les tailles et tout à ce que vous voulez rendre !

// Definition de la taille du svgP (widthP et heightP)
var marginP = {top: 10, right: 100, bottom: 30, left: 60},
    widthP = 1200 - marginP.left - marginP.right,
    heightP = 400 - marginP.top - marginP.bottom;

var paysDefaut = 'Russie';
var csvDataPays = [];
// append the svgP object to the body of the page
var svgP = d3.select("#graphePays")
  .append("svg")
    .attr("width", "100%")
    .attr("height", heightP + marginP.top + marginP.bottom)
    .attr("viewBox", [350, 0, 500, 450])
  .append("g")
    .attr("transform",
          "translate(" + marginP.left + "," + marginP.top + ")");
//Read the data
d3.csv("https://raw.githubusercontent.com/pltreger/Deforestation/main/data/perte_couverture_par_pays_par_causes.csv").then(function(data) {
    console.log(data)
    for(var i = 0; i < data.length; i++) {
        if(data[i].pays === paysDefaut) {
            csvDataPays.push(data[i])
        }
    }

    csvDataPays = csvDataPays.sort(function compare(a, b) {
        return a.annee - b.annee;
    });
    console.log(csvDataPays)

    var allCause = ["Agriculture", "Autres", "Deforestation due aux produits de base", "Foresterie", "Feu de foret", "Urbanisation"]

    csvDataPays = allCause.map( function(grpName) { // .map allows to do something for each element of the list
        return {
          name: grpName,
          values: csvDataPays.filter(d => d.cause === grpName)
    }});

    console.log(csvDataPays)

    var myColor = d3.scaleOrdinal()
      .domain(allCause)
      .range(["#EFEA5A","#0DB39E","#2C699A","#B9E769","#F29E4C","#54478C"]);

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain([new Date(2001, 0, 1), new Date(2019, 0, 1)])
        .range([ 0, widthP]);

    svgP.append("g")
        .attr("transform", "translate(0," + heightP + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain( [0, 4500000])
        .range([ heightP, 0 ]);

    svgP.append("g")
        .call(d3.axisLeft(y));

    // Add the lines
    var lineP = d3.line()
        .x(function(d) { return x(new Date (d.annee, 0, 1)) })
        .y(function(d) { return y(d.perte_surface_ha) })
    svgP.selectAll("myLines")
      .data(csvDataPays)
      .enter()
      .append("path")
      .attr("class", function(d){return d.name[4] })
        .attr("d", function(d){ return lineP(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")
    
    // Add the points
    svgP
        // First we need to enter in a group
        .selectAll("myDots")
        .data(csvDataPays)
        .enter()
          .append('g')
          .style("fill", function(d){ return myColor(d.name) })
          .attr("class", function(d){ return d.name[4] })
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(function(d){ return d.values })
        .enter()
        .append("circle")
          .attr("cx", function(d) { return x(new Date (d.annee, 0, 1)) } )
          .attr("cy", function(d) { return y(d.perte_surface_ha) } )
          .attr("r", 5)
          .attr("stroke", "white")
})