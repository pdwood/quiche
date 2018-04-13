//Circles: https://bl.ocks.org/mbostock/22994cc97fefaeede0d861e6815a847e
//Drag to resize: http://bl.ocks.org/mccannf/1629464

var mode = "select"

var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height"),
	radius = 32;

var circles = d3.range(20).map(function() {
  return {
	x: Math.round(Math.random() * (width - radius * 2) + radius),
	y: Math.round(Math.random() * (height - radius * 2) + radius)
  };
});

var data = {
	"name" : "root", 'x':200,'y':200, "children" : [
		{"name" : "node0", "value" : "P", 'x':220,'y':220},
		{"name" : "node1", 'x':400,'y':320, "children" : [
			{"name" : "node2", 'x':700,'y':700, "children" : [ {"name":"node3","value":"Q",'x':60,'y':60} ]},
			{"name" : "node2", 'x':750,'y':750, "children" : [ {"name":"node3","value":"P",'x':80,'y':80} ]}
		]}
	]
}

var inpad = 64
var outpad = 10
//var text

function getw(d) {
	if(!d.children) return inpad
	return outpad + d.children.reduce( (a,b) => Math.max(a,b.data.x + getw(b) - d.data.x) , 0)
}
function geth(d) {
	if(!d.children) return inpad
	return outpad + d.children.reduce( (a,b) => Math.max(a,b.data.y + geth(b) - d.data.y) , 0)
}
function getw_minus(d){
	if(!d.children) return 0
	return d.children.reduce( (a,b) => Math.max(a, b.data.x + getw_minus(b) - d.data.x - outpad) , 0)				
}
function geth_minus(d){
	if(!d.children) return 0
	return d.children.reduce( (a,b) => Math.min(a, b.data.y + geth_minus(b) - d.data.y - outpad) , 0)				
}
function getx(d){
	if(!d.children) return d.data.x
	return d.children.reduce( (a,b) => Math.min(a, getx(b) - outpad) , d.data.x)
}
function gety(d){
	if(!d.children) return d.data.y
	return d.children.reduce( (a,b) => Math.min(a, gety(b) - outpad) , d.data.y)
}

var root = d3.hierarchy(data)

function update () {
	svg.selectAll("rect")
		.data(root.descendants().filter( (d) => !d.data.value ))
		//
		.enter().append("g").append('rect')

	svg.selectAll("rect")
		.attr('x', getx)
		.attr('y', gety)
		.attr('width', getw)
		.attr('height', geth)
		.attr('rx',32)
		.attr('ry',32)
		.style('stroke','#000000')
		.style('fill',function(d){ return ['#afc6e9','#ffffff'] [d.depth%2] })
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));
	
	svg.selectAll("g")
		.data(root.descendants().filter( (d) => !!d.data.value ))
		.enter().append("g").append('text')
		.attr('x',function(d){return d.data.x} )
		.attr('y',function(d){return d.data.y} )
		//.attr('width', getw)
		//.attr('height', geth)
		//.style('stroke','#000000')
		//.style('fill','#ffffff')
		.attr('innerHTML', (d) => d.data.value)
}

function dragstarted(d) {
  //d3.select(this).raise().classed("active", true);
	d3.select(this).attr('xoffset', d3.event.x - d.data.x)
	d3.select(this).attr('yoffset', d3.event.y - d.data.y)
}

function dragged(d) {
	var deltax = d3.event.x - d3.select(this).attr('xoffset') - d.data.x
	var deltay = d3.event.y - d3.select(this).attr('yoffset') - d.data.y
	
	//d.data.x += deltax
	//d.data.y += deltay

	d.descendants().forEach( function(d1){ d1.data.x += deltax; d1.data.y += deltay } )
	//console.log("becomes")
	//console.log(d)
	update()
}

function dragended(d) {
	//update()
}

update()