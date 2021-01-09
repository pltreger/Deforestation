var marginC = { top: 10, right: 30, bottom: 20, left: 100 },
  widthC = 1500 - marginC.left - marginC.right,
  heightC = 500 - marginC.top - marginC.bottom;

// append the svgC object to the body of the page
var svgC = d3
  .select("#grapheComparatif")
  .append("svg")
  .attr("width", widthC + marginC.left + marginC.right)
  .attr("height", heightC + marginC.top + marginC.bottom + 100)
  .append("g")
  .attr("transform", "translate(" + marginC.left + "," + marginC.top + ")");

var tickDuration = 1500;
var top_n = 10;

let barPadding = (heightC - (marginC.bottom + marginC.top)) / (top_n * 5);

let title = svgC
  .append("text")
  .attr("class", "titreComparatif")
  .attr("x", marginC.left)
  .attr("y", 24)
  .html("2019 : top 10 des pays les plus déforestateurs");

let subTitle = svgC
  .append("text")
  .attr("class", "subTitleComparatif")
  .attr("x", marginC.left)
  .attr("y", 60)
  .html("Déforestation, en hectare");

couleurs = ["#F1C453", "#83E377", "#048BA8", "#EFEA5A", "#16DB93", "#F29E4C", "#2C699A", "#B9E769", "#0DB39E", "#54478C"];

let annee = 2019;
d3.csv("https://raw.githubusercontent.com/pltreger/Deforestation/main/data/perte_couverture_par_pays.csv").then(function (data) {
  //Récupérations données 2001
  let donneesAnnee = data
    .filter((d) => d.annee == annee && !isNaN(d.annee))
    .sort((a, b) => b.perte_surface_ha - a.perte_surface_ha)
    .slice(0, top_n);
  donneesAnnee.forEach((d, i) => (d.rank = i));


  //Affichage graphique pour 2001
  let xC = d3
    .scaleLinear()
    .domain([0, donneesAnnee[0].perte_surface_ha])
    .range([marginC.left, 1200]);

  let yC = d3
    .scaleLinear()
    .domain([top_n, 0])
    .range([heightC - marginC.bottom, marginC.top]);

  let xAxisC = d3
    .axisTop()
    .scale(xC)
    .ticks(widthC > 500 ? 5 : 2)
    .tickSize(-(heightC.top - marginC.bottom))
    .tickFormat((d) => d3.format(",")(d));
  svgC
    .append("g")
    .attr("class", "axis xAxis")
    .attr("transform", `translate(0, ${marginC.top + 100})`)
    .call(xAxisC)
    .selectAll(".tick line")
    .classed("origin", (d) => d == 0);
  svgC
    .selectAll("rect.barComparatif")
    .data(donneesAnnee, (d) => d.pays)
    .enter()
    .append("rect")
    .attr("class", "barComparatif")
    .attr("x", xC(0) + 1)
    .attr("width", (d) => xC(d.perte_surface_ha) - xC(0) - 1)
    .attr("y", (d) => yC(d.rank) + 5 + 100)
    .attr("height", yC(1) - yC(0) - barPadding)
    .style("fill", (d) => couleurs[d.rank]);
  svgC
    .selectAll("text.labelComparatif")
    .data(donneesAnnee, (d) => d.pays)
    .enter()
    .append("text")
    .attr("class", "labelComparatif")
    .attr("x", (d) => xC(d.perte_surface_ha) - 8)
    .attr("y", (d) => yC(d.rank) + 5 + (yC(1) - yC(0)) / 2 + 1 + 100)
    .style("text-anchor", "end")
    .html((d) => d.pays);

  svgC
    .selectAll("text.valueLabelComparatif")
    .data(donneesAnnee, (d) => d.pays)
    .enter()
    .append("text")
    .attr("class", "valueLabelComparatif")
    .attr("x", (d) => xC(d.perte_surface_ha) + 5)
    .attr("y", (d) => yC(d.rank) + 5 + (yC(1) - yC(0)) / 2 + 1 + 100)
    .text((d) => d3.format(",.0f")(d.perte_surface_ha));

  let texteAnnee = svgC
    .append("text")
    .attr("class", "anneeComparatif")
    .attr("x", widthC - marginC.right - 200)
    .attr("y", heightC - 25 + 50)
    .style("text-anchor", "end")
    .html(~~annee);
});