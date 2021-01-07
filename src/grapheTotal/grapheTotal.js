// ================================================
//                Important 
// ================================================
// Faites attention aux variables que vous donnez ! Je vous donne un exemple 'type'
// Mais il faut adapter chaque variable au nom du fichier pour éviter les soucis lors du merge !
// Pensez aussi a adapter les tailles et tout à ce que vous voulez rendre !

// Definition de la taille du svg (width et height)
var width = 450, height = 300;

// ajout du svg 
var svg = d3
.select("#grapheTotal")
.append("svg")
.attr("width", width)
.attr("height", height)

var g = svg.append("g");