var menuMode = 1;
const CONSTRUCT = 1;
const INFERENCE = 2;

//Test function for buttons
function buttonClick(bgColor, aColor) {
	var buttons = document.getElementById("constructSidebar").children
	for (var i = 0;i < buttons.length; i++){
		if (buttons[i].className.includes("button")){
			buttons[i].style.backgroundColor = bgColor;
			buttons[i].style.color = aColor;
		}
	} 
}

//Dont call this
function selfDestruct(){
    var elem = document.getElementsByTagName("HTML")[0];
    var parent = elem.parentNode;
    parent.removeChild(elem);
}

//Called when the menu schould switch to a different mode
//This will close the current sidebar and open the correct one for the mode
function menuModeChange(newMode){
    this.menuMode = newMode;
    closeBar();
    toolModeChange('select');
    openBar();
}

//Change the cursor mode when a button is clicked
function toolModeChange(newMode){
	d3.select('.vars_menu').remove();
    this.mode = newMode;
    buttons = document.getElementsByClassName("button");
    for (var i = 0;i < buttons.length; i++){
        if (mode == buttons[i].id){
            buttons[i].style.backgroundColor = 'white';
            buttons[i].style.color = 'black';
        }else{
            buttons[i].style.backgroundColor = '';
            buttons[i].style.color = '';
        }
    }
}

function openBar() {
    if (this.menuMode == 1)
	    document.getElementById("constructSidebar").style.width = "250px";
    else if (this.menuMode == 2)
        document.getElementById("inferenceSidebar").style.width = "250px";
    else{
        //Mode should only be 1 or 2
        throw "Invalid Mode: should be 1 or 2";
    }
}

function closeBar() {
	document.getElementById("constructSidebar").style.width = "0";
    document.getElementById("inferenceSidebar").style.width = "0";
}
