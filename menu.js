var menuMode = 1;
const CONSTRUCT = 1;
const INFERENCE = 2;


function buttonClick(bgColor, aColor) {
	var buttons = document.getElementById("constructSidebar").children
	for (var i = 0;i < buttons.length; i++){
		if (buttons[i].className.includes("button")){
			buttons[i].style.backgroundColor = bgColor;
			buttons[i].style.color = aColor;
		}
	} 
}

//Called when the menu schould switch to a different mode
//This will close the current sidebar and open the correct one for the mode
function modeChange(newMode){
    this.menuMode = newMode;
    closeBar();
    openBar();
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
