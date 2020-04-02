
/* returns the color that corresponds to a given language */
function lang_color(language) {
  
  if (language === "python") {
    return "#1759c2";
  } else if (language === "scheme") {
    return "#990000";
  } else if (language === "javascript") {
    return "#d6cc11dd";
  } else if (language === "haskell") {
    return "grey";
  }


}

/* returns the color that corresponds to a given difficulty level */
function difficulty_color(difficulty) {
  if (difficulty === "easy") {
    return "lightgreen";
  }
  else if (difficulty == "moderate") {
    return "#ffe800";
  }
  else {
    return "red";
  }
}