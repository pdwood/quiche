//Circles: https://bl.ocks.org/mbostock/22994cc97fefaeede0d861e6815a847e
//Drag to resize: http://bl.ocks.org/mccannf/1629464

var currentVars = ["P","Q"]
var selectedForMenu = undefined

var mode = "select"

var menuheight = 500
var menuwidth = 500

var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height")

var data = { 'children': [
	{'x':60,'y':60, "children" : [
		{"name" : "node0", "value" : "P", 'x':220,'y':220},
		{"name" : "node1", 'x':60,'y':60, "children" : [
			{"name" : "node2", 'x':60,'y':60, "children" : [ {"name":"node3","value":"Q",'x':60,'y':60} ]},
			{"name" : "node2", 'x':120,'y':60, "children" : [ {"name":"node3","value":"P",'x':80,'y':80} ]}
		]}
	]}
]}

var inpad = 64
var outpad = 10

function getw(d) {
	if(d.data.children === undefined) return d.data.value.length * 11
	if(d.children === undefined) return inpad //if d.data has children but not d then this is empty cut
	return outpad + d.children.reduce( (a,b) => Math.max(a, getx(b) + getw(b) - d.data.x) , inpad) + (d.data.x - getx(d))
}
function geth(d) {
	if(d.data.children === undefined) return 17
	if(d.children === undefined) return inpad //if d.data has children but not d then this is empty cut
	return outpad + d.children.reduce( (a,b) => Math.max(a, gety(b) + geth(b) - d.data.y) , inpad) + (d.data.y - gety(d))
}
function getx(d){
	if(d.children === undefined) return d.data.x
	return d.children.reduce( (a,b) => Math.min(a, getx(b) - outpad) , d.data.x)
}
function gety(d){
	if(d.children === undefined) return d.data.y
	return d.children.reduce( (a,b) => Math.min(a, gety(b) - outpad) , d.data.y)
}

var root = d3.hierarchy(data)

function refresh () {
	cuts = svg.select("g#cuts").selectAll("rect").data(root.descendants().filter( (d) => d!=root && !d.data.value ))
	vars = svg.select("g#vars").selectAll("text").data(root.descendants().filter( (d) => !!d.data.value ))


	cuts.enter().append('rect')
		.attr("class", 'cut')
		.on("click",onClick)
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

	cuts.sort(function(x,y) {return x.depth > y.depth})
		
	vars.enter().append('text')
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

	cuts.attr('x', getx)
		.attr('y', gety)
		.attr('width', getw)
		.attr('height', geth)
		.style('fill',function(d){ return ['#ffffff','#afc6e9'] [d.depth%2] })

	vars.attr('x', getx)
		.attr('y', gety)
		.attr('class','atom')
		.html((d) => d.data.value)
	
	cuts.exit().remove()
	vars.exit().remove()
}

function dragstarted(d) {
	d3.select(this).attr('xoffset', d3.event.x - d.data.x)
	d3.select(this).attr('yoffset', d3.event.y - d.data.y)
}

function dragged(d) {
	var deltax = d3.event.x - d3.select(this).attr('xoffset') - d.data.x
	var deltay = d3.event.y - d3.select(this).attr('yoffset') - d.data.y

	d.descendants().forEach( function(d1){ d1.data.x += deltax; d1.data.y += deltay } )
	refresh()
}

function dragended(d) {
	//refresh()
}

function openVariableMenu(d, x, y){
	console.log(x + ", "+ y)
    
	d3.select('.vars_menu').remove();
	
	var menuw = 100, menuh = 0, margin = 0.1;
	parentElement = d

	d3.select('svg')
		.append('g').attr('class', 'vars_menu')
		.selectAll('tmp')
		.data(currentVars).enter()
		.append('g').attr('class', 'menu-entry')
		.on('mouseover', function(){ 
			d3.select(this).select('rect').attr("class","mouseover") })
		.on('mouseout', function(){ 
			d3.select(this).select('rect').attr("class","mouseout") })
		.on('click', function(d) { d3.select('.vars_menu').remove(); addVariable(parentElement, x, y, d); d3.event.stopPropagation() })

	d3.selectAll('.menu-entry')
		.append('rect')
		.attr('class', 'mouseout');

	d3.selectAll('.menu-entry')
		.append('text')
		.text(function(d){ return d; })
		.attr('class', 'menutext')
		.each( function() {
			// Determine width and height of menu here.
			var b = this.getBBox()
			if(b.width > menuw) menuw = b.width
			if(b.height > menuh) menuh = b.height
		})

	margin *= menuw
	menuw += 2*margin

	var addnew = d3.select('.vars_menu')
		.append('g').attr('class', 'menu-entry')
		.on('mouseover', function(){ 
			d3.select(this).select('rect').attr("class","mouseover") })
		.on('mouseout', function(){ 
			d3.select(this).select('rect').attr("class","mouseout") })
		.on('click', function(d) {
				d3.select('.vars_menu').remove();
				var newvar = prompt("Add new variable...");
				if( ! (newvar in currentVars) ){
					console.log("Adding?")
					currentVars.push(newvar)
				}
				addVariable(parentElement, x, y, newvar);
				d3.event.stopPropagation() })

	addnew.append('rect')
		.attr('class', 'mouseout')

	addnew.append('text')
		.text("Add new...")
		.attr('class', 'menutext')


	d3.selectAll('.mouseout')
		.attr('x', x)
		.attr('y', function(d, i){ return y + (i * menuh); })
		.attr('width', menuw)
		.attr('height', menuh)
	
	d3.selectAll(".menutext")
		.attr('x', x)
		.attr('y', function(d, i){ return y + (i * menuh); })
		.attr('dy', menuh - margin / 2)
		.attr('dx', margin)

}

function onClick(d){
	d3.event.preventDefault()
	if(mode == "delete"){
		console.log(d)
		erase(d)
		d3.event.stopPropagation()
	}else if(! d.data.value){
		if(mode == "addcut"){
			addCut(d, d3.event.x-inpad/2, d3.event.y-inpad/2)
		}else if(mode == "addvar"){
			openVariableMenu(d, d3.event.x, d3.event.y)
		}
		d3.event.stopPropagation()
	}
}

function addCut(d,x,y){
	//console.log(d)
	//https://stackoverflow.com/questions/43140325/
	var newCut = d3.hierarchy( { 'x':x,'y':y,'children':[] } )
	console.log(newCut)
	newCut.depth = d.depth + 1
	newCut.parent = d
	newCut.height = d.height - 1
	if(!d.children) d.children=[]
	d.children.push(newCut)
	d.data.children.push(newCut.data)
	//root.children.push(newCut)
	refresh()
	refresh()
}

function addVariable(d,x,y,name){
	//console.log(d)
	//https://stackoverflow.com/questions/43140325/
	var newCut = d3.hierarchy( { 'x':x,'y':y,'value':name } )
	console.log(newCut)
	newCut.depth = d.depth + 1
	newCut.parent = d
	newCut.height = d.height - 1
	if(!d.children) d.children=[]
	d.children.push(newCut)
	d.data.children.push(newCut.data)
	//root.children.push(newCut)
	refresh()
	refresh()
}

function erase(d){
	d.parent.children = d.parent.children.filter( (a) => a!=d )
	//something = something.filter( function(a){ return !(a in d.descendants()) } )
	refresh()
}

d3.select("svg").on("click", function(){console.log("root clicked");onClick(root)})

refresh()
refresh() // idk why i have to do it twice