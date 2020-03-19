

var cur_puzzles;


function disable_input(){
		myCodeMirror.setOption('readOnly', "nocursor");
		$("#run_button").attr("disabled", true);
		$("#language").prop("disabled", true);
		$('.CodeMirror').css("opacity", 0.5);
		$('#code_panel').css("opacity", 0.5);
}

function enable_input(){
	myCodeMirror.setOption('readOnly', false);
	$("#run_button").attr("disabled", false);
	$("#language").prop("disabled", false);
	$('.CodeMirror').css("opacity", 1);
	$('#code_panel').css("opacity", 1); 

}

function puzzle_update() {
	var new_puzzle = $("#puzzle").val();

	$("#description").html(cur_puzzles[$("#puzzle").val()].description);

}

function language_update()  {

	var new_lang = $("#language").val().toLowerCase();

	myCodeMirror.setOption("mode", new_lang);


	myCodeMirror.setValue("");
	myOutput.setValue("");
	//$('p').remove(".stats")
	//myCodeMirror.style.border = "2px solid " + lang_color(new_lang);
	$('.CodeMirror').css("border", "2px solid " + lang_color(new_lang));
	$(".codebar-item").css("border", "2px solid " + lang_color(new_lang));
	$(".puzzle-item").css("border", "2px solid " + lang_color(new_lang));
	//$('#code_panel').css("border", "2px solid " + lang_color(new_lang));
	//$('#puzzle_panel').css("border", "2px solid " + lang_color(new_lang));
	//document.getElementById("codeeditor").style.border = "2px solid " + lang_color(new_lang);
	document.getElementById("logo").src = "/images/" + new_lang + ".svg";

}

function populate_puzzle_select() {
	let puzzle_options = "";
	for (var i in cur_puzzles) {
		puzzle_options += "<option value='" + i + "'>" + i + "</option>";
	}
	/*
	}
	for (var i = 0; i < Object.keys(cur_puzzles).length; i++) {
		puzzle_options += "<option value='" + cur_puzzles[i].name + "'>" + cur_puzzles[i].name + "</option>";
	}*/
	/*$("select[name='puzzle_select']").append($(puzzle_options));*/
	$("#puzzle").children().remove().end().append($(puzzle_options));

}

function puzzle_percent(name) {

	//for (var i = 0; i < cur_puzzles.length; i++) {
  //  if (cur_puzzles[i].name === name) {
  console.log("puzzle percent", cur_puzzles[name]);
 // console.log(cur_puzzles)
  //console.log(cur_puzzles[name][difficulty]);
	if (cur_puzzles[name].difficulty === "easy") {
		console.log("returning", 1 / points_needed);
		return 100 * (1 / points_needed);
	}
	else if (cur_puzzles[name].difficulty === "moderate") {
		return 100 * (3 / points_needed);
	}
	else {
		return 100 * (5 / points_needed);
	}
}
$(document).ready(function(){

	

	let puzzles = easy_puzzles.concat(moderate_puzzles.concat(challenging_puzzles));

	cur_puzzles = {}
	for (var i = 0; i < puzzles.length; i++) {
		cur_puzzles[puzzles[i].name] = puzzles[i];
	}

	let langs = game.languages.split(",");
	let lang_options = "";
	for (var i = 0; i < langs.length; i++) {
		lang_options += "<option value='" + langs[i] + "'>" + langs[i] + "</option>";
	}

	$("#language").append($(lang_options));

	populate_puzzle_select();

	myCodeMirror = CodeMirror.fromTextArea(document.getElementById("codeeditor"), {
											lineNumbers: true,
											mode: "python",
											theme: "dracula"
	});

	myOutput = CodeMirror.fromTextArea(document.getElementById("codeoutput"), {
											theme: "base16-dark",
											mode: "plain",
											readOnly: "nocursor"
	});

	language_update();
	puzzle_update();

	$("#language").change(function(){
		language_update();
	});

	$("#puzzle").change(function(){
		puzzle_update();
	});


  $("#run_button").click(function(){
    disable_input();

		//myCodeMirror.theme = "base16-dark";
		console.log("clicked");
		//console.log($("#codeeditor").val());
		console.log($("#language").val());
		$.post($(location).attr('href'),
		{
			puzzle_name: $("#puzzle").val(),
			user_fun: myCodeMirror.getValue(),
			lang: $("#language").val()
		},
		
		function(data,status){

			if (data.redirect) {
				window.location.href = data.redirect;
			} else {

				if (data.timeout) {
					enable_input();
					myOutput.setValue("Your program was terminated.\nIt took too long to run. Sorry!")
				}
				else if (data.stderr !== "") {
					enable_input();
					myOutput.setValue(data.stderr);
				}
				else if (data.error) {
					enable_input();
					myOutput.setValue(data.stdout)
				}
				else if (data.passed_all) {
				//if (data.res === "All tests passed!\n") {
					console.log("this happened");
					console.log("your time is:", data.time);
					console.log("solution length is:", data.length);
					//$("#submit_button").show();
					//$("#edit_button").show();
					solution_time = data.time;
					solution_length = data.length;
					//alert(data.res + "\nRuntime: " + data.time.replace(/^\s+|\s+$/g, '') + " seconds\n\nSolution length: " + data.length + " characters")
					myOutput.setValue(data.stdout + "\nRuntime: " + data.time.replace(/^\s+|\s+$/g, '') + " seconds\n\nSolution length: " + data.length + " characters");


					update_per(user.username, puzzle_percent($("#puzzle").val()));

					myCodeMirror.setValue("");

					/* update puzzle list */
					delete cur_puzzles[$("#puzzle").val()];
					populate_puzzle_select();

					if (cur_puzzles.length == 0) {
						
					}
					else {
						enable_input();
					}

				}
				else {
					/* ??? */
					enable_input();
					myOutput.setValue(data.stdout)
				}
			}
		});
		
	});


	function update_per(username, added_per) {
	//$(".progress-per").each(function() {
	$("#progress_" + username).each(function() {
	  var $this = $(this);
	  var per = $this.attr("per").substring(0, $this.attr("per").length - 1);;
	  //$this.css("width", per + "%");
	  console.log("per", per);
	  console.log("added_per", added_per);
	  let new_per = parseFloat(per) + parseFloat(added_per);
	  $this.css("width", new_per + "%");
	  $({ animatedValue: per }).animate(
	    { animatedValue: new_per },
	    
	    {
	      duration: 1000,
	      step: function() {
	        $this.attr("per", Math.floor(this.animatedValue) + "%");
	      },
	      complete: function() {
	        $this.attr("per", Math.floor(this.animatedValue) + "%");
	      }
	    }
	    );
	});
	}
/*
$(".progress-per").each(function() {
  var $this = $(this);
  var per = $this.attr("per");
  $this.css("width", per + "%");
  $({ animatedValue: 0 }).animate(
    { animatedValue: per },
    
    {
      duration: 1000,
      step: function() {
        $this.attr("per", Math.floor(this.animatedValue) + "%");
      },
      complete: function() {
        $this.attr("per", Math.floor(this.animatedValue) + "%");
      }
    }

    
  );
	});
*/

});