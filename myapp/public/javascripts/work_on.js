
var myCodeMirror;
var myOutput;
var solution_time;
var solution_length;



function dropdown_update()  {


  var new_lang = $("#language").val().toLowerCase();

  myCodeMirror.setOption("mode", new_lang);


  myCodeMirror.setValue("");
  myOutput.setValue("");
  $("#time_stats").html("");
  $("#length_stats").html("");
  $('.CodeMirror').css("border", "2px solid " + lang_color(new_lang));
  $('#code_panel').css("border", "2px solid " + lang_color(new_lang));
  $('#stats').css("border", "2px solid " + lang_color(new_lang));

  document.getElementById("logo").src = "/images/" + new_lang + ".svg";

  for (var i = 0; i < solutions.length; i++) {
    if (solutions[i].language == new_lang) {
      myCodeMirror.setValue(solutions[i].solution);
      $("#time_stats").html("<strong>My saved time:<br></strong>" + solutions[i].time + " seconds");
      $("#length_stats").html("<strong>My saved length:<br></strong>" + solutions[i].length + " characters");
    }
  }
}


function disable_input(){
    myCodeMirror.setOption('readOnly', "nocursor");
    $("#run_button").attr("disabled", true);
    $("#language").prop("disabled", true);
    $('.CodeMirror').css("opacity", 0.5);
    $('#code_panel').css("opacity", 0.5);
    $('#stats').css("opacity", 0.5);
    $("#run_button").removeClass("round-button-hover");
    $("#run_button").css("cursor", "default");
}

function enable_input(){
  myCodeMirror.setOption('readOnly', false);
  $("#run_button").attr("disabled", false);
  $("#language").prop("disabled", false);
  $('.CodeMirror').css("opacity", 1);
  $('#code_panel').css("opacity", 1); 
  $('#stats').css("opacity", 1);
  $("#run_button").addClass("round-button-hover");
  $("#run_button").css("cursor", "pointer");  

}

$(document).ready(function(){

  $("#difficulty").css("color", difficulty_color(puzzle.difficulty));


  /* hide submit button */
  $("#submit_button").hide();
  $("#edit_button").hide();

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

  dropdown_update();

  $('#language').change(function(){
    dropdown_update();
  });

  $("#submit_button").click(function(){

    $.post($(location).attr('href') + '/submit',
    {
      solution: myCodeMirror.getValue(),
      time: parseFloat(solution_time),
      length: parseInt(solution_length),
      language: $('#language').val().toLowerCase()
    },
    function(data, status) {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        alert("Solution Saved!");
        /* update copy of solutions */
        solutions = data.solutions;
        dropdown_update();

        enable_input();
        $("#submit_button").hide();
        $("#edit_button").hide();
      }
    });
  });

  
  $("#edit_button").click(function(){
    enable_input();
    $("#submit_button").hide();
    $("#edit_button").hide();
  });
  

  $("#run_button").click(function(){
    disable_input();

    $.post($(location).attr('href'),
    {
      puzzle_name: puzzle.name,
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

          $('.CodeMirror').each(function(index) {
            if (index == 1) {
              $(this).css("opacity", 1);
            }
          });

          $("#submit_button").show();
          $("#edit_button").show();
          solution_time = data.time;
          solution_length = data.length;
          myOutput.setValue(data.stdout + "\nRuntime: " + data.time.replace(/^\s+|\s+$/g, '') + " seconds\n\nSolution length: " + data.length + " characters");

        }
        else {
          /* ??? */
          enable_input();
          myOutput.setValue(data.stdout)
        }
      }
    });
    
  });
});