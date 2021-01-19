const marginDB = {top: 20, right: 40, bottom: 60, left: 70},
    widthDB = 1100 - marginDB.left - marginDB.right,
    heightDB = 510 - marginDB.top - marginDB.bottom,
    keys = ["Agriculture", "Autres", "Deforestation due aux produits de base", "Foresterie", "Feu de foret", "Urbanisation"],
    colorsDB = ["#EFEA5A","#0DB39E","#2C699A","#B9E769","#F29E4C","#54478C"],
    legendCellSize = 20,
    tooltipWidthDB = 210;

const svgDB = d3.select("#grapheDeforestationBis").append("svg")
    .attr("id", "svg")
    .attr("width", "100%")
    .attr("height", heightDB + marginDB.top + marginDB.bottom)
    .attr("viewBox", [300, 0, 500, 500])
    .append("g")
    .attr("transform", "translate(" + marginDB.left + "," + marginDB.top + ")");

d3.csv("https://raw.githubusercontent.com/pltreger/Deforestation/main/data/perte_couverture_mondiale_par_causes.csv").then(function(data) { 
    //console.log(data)

    var goodData = []
    for(var i = 2001; i < 2020; i++) {
        let gd = {date: String(i), "Agriculture": null, "Autres": null, "Deforestation due aux produits de base": null, "Foresterie": null, "Feu de foret": null, "Urbanisation": null}
        for(var j = 0; j < data.length; j++) {
            if(data[j].annee === String(i)) {
                key = data[j].cause
                gd[key] = data[j].perte_surface_ha
            }
        }
        goodData.push(gd)
    }

    var stack = d3.stack()
    	.keys(keys)
    	.order(d3.stackOrderNone)
    	.offset(d3.stackOffsetNone);

    var series = stack(goodData);

    const xDB = d3.scaleBand()
        .domain(goodData.map(d => d.date).sort())
    	.range([0, widthDB])
    	.padding(0.1);

    const yDB = d3.scaleLinear()
        .domain([0, d3.max(series[series.length - 1], d => d[1])])
        .range([heightDB, 0]);
        
    // Sur l'axe horizontal, on filtre les dates afficher
    const xAxis = d3.axisBottom(xDB)
        .tickValues(xDB.domain());

    svgDB.append("g")
        .attr("class", "x axis")
      	.attr("transform", "translate(0," + heightDB + ")")
      	.call(xAxis)
        .selectAll("text")	
        .style("text-anchor", "middle");

    svgDB.append("g")
        .attr("class", "y axis")
       	.call(d3.axisLeft(yDB))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")

    let groups = svgDB.selectAll("g.biberon")
        .data(series)
        .enter()
        .append("g")
        .style("fill", (d, i) => {console.log('heho', d, i);return colorsDB[i]});

    let rect = groups.selectAll("rect")
        .data(d => d)
        .enter()
            .append("rect")
            .attr("x", d => xDB(d.data.date))
            .attr("width", xDB.bandwidth())
            .attr("y", d => yDB(d[1]))
            .attr("height", d => heightDB - yDB(d[1] - d[0]));

    //addMovingAverage(data, x, y);
    addLegend(colorsDB);
    //let tooltip = addTooltip(keys.length);
    //handleMouseEvent(data, x, y, tooltip);
})

function addLegend(colorsDB) {
    var reverseColors = colorsDB.reverse(); // Pour présenter les catégories dans le même sens qu'elles sont utilisées
    var reverseKeys = keys.reverse();
    console.log('youhou')
        
    var legendDB = svgDB.append('g')
        .attr('transform', 'translate(10, 20)'); // Représente le point précis en haut à gauche du premier carré de couleur
                
    // Pour chaque couleur, on ajoute un carré toujours positionné au même endroit sur l'axe X et décalé en fonction de la 
    // taille du carré et de l'indice de la couleur traitée sur l'axe Y
    legendDB.selectAll()
        .data(reverseColors)
        .enter()
        .append('rect')
        .attr('height', legendCellSize + 'px')
        .attr('width', legendCellSize + 'px')
        .attr('x', 5)
        .attr('y', (d,i) => i * legendCellSize)
        .style("fill", d => d);
            
        // On procéde de la même façon sur les libellés avec un positionement sur l'axe X de la taille des carrés 
        // à laquelle on rajoute 10 px de marge
    legendDB.selectAll()
        .data(reverseKeys)
        .enter().append('text')
        .attr("transform", (d,i) => "translate(" + (legendCellSize + 10) + ", " + (i * legendCellSize) + ")")
        .attr("dy", legendCellSize / 1.6) // Pour centrer le texte par rapport aux carrés
        .style("font-size", "13px")
        .style("fill", "grey")
        .text(d => d);
}