function lang_color(language) {
	
	if (language === "python") {
		return "#1759c2"; //"#0039e6";
	} else if (language === "scheme") {
		return "#990000";
	} else if (language === "javascript") {
		return "#d6cc11dd"; //"#cccc00";
	} else if (language === "haskell") {
		return "grey";
	}


}

function difficulty_color(difficulty) {
	if (difficulty === "easy") {
		return "lightgreen";
	}
	else if (difficulty == "moderate") {
		return "yellow";
	}
	else {
		return "red";
	}
}