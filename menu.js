function buttonClick(bgColor, aColor) {
	var buttons = document.getElementById("mySidebar").children
	for (var i = 0;i < buttons.length; i++){
		if (buttons[i].className.includes("button")){
			buttons[i].style.backgroundColor = bgColor
			buttons[i].style.color = aColor
		}
	} 
}

function openBar() {
	document.getElementById("mySidebar").style.width = "250px";
}

function closeBar() {
	document.getElementById("mySidebar").style.width = "0";
}