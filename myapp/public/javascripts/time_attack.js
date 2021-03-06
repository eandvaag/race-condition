/* client-side javascript for the time-attack game */


var unlocked_puzzles;       /* puzzles solved by the user for the first time ever */
var new_lang_solutions;     /* puzzles solved by the user in a novel language */
var cur_puzzles;            /* remaining puzzles to solve */
var solved_puzzles;         /* puzzles that have been solved */
var all_puzzles;            /* all puzzles to solve */

var myCodeMirror;
var myOutput;

var seconds_remaining;      /* time remaining in the game, in seconds */

var interval_id;

/* user wishes to play another game */
function play_again() {
    $.post("/play/time-attack", {
    num_easy: game.num_easy,
    num_moderate: game.num_moderate,
    num_challenging: game.num_challenging,
    time_easy: game.time_easy,
    time_moderate: game.time_moderate,
    time_challenging: game.time_challenging
  },
  function(response,status) {
    if (response.redirect) {
      window.location.href = response.redirect;
    }
    else if (response.game_id) {
      window.location.href = '/play/time-attack/' + response.game_id;
      
    }
  });

}

/* decrements the counter, checks if counter is zero */
function tick() {

  var min = Math.floor(seconds_remaining / 60);
  var sec = seconds_remaining - (min * 60);

  if (min < 10) {
    min = "0" + min;
  }

  if (sec < 10) {
    sec = "0" + sec;
  }

  var message = min.toString() + ":" + sec;

  $("#timer").val("");
  $("#timer").text(message);

  if (seconds_remaining === 10) {
    $("#timer").css("color", "red");
  }

  if (seconds_remaining === 0) {
    disable_input();
    clearInterval(interval_id);
    $("#timer").css("color", "white");
    $("#timer").val("");
    $("#timer").text("--:--");
    $.post($(location).attr('href') + '/complete',
    {},   
    function(data,status){
      game_end("Time's Up!");
    });
  }

  seconds_remaining--;

}


$(document).ready(function(){

  $("#gameover").hide();
  $("#unlocked").hide();
  $("#new_lang").hide();
  $("#lobby").hide();
  $("#rematch").hide();
  $("#rematch_req").hide();


  seconds_remaining = (game.num_easy * game.time_easy) + 
                      (game.num_moderate * game.time_moderate) + 
                      (game.num_challenging * game.time_challenging);

  tick();
  interval_id = setInterval(tick, 1000);


  unlocked_puzzles = [];
  new_lang_solutions = [];

  cur_puzzles = {};
  solved_puzzles = [];
  all_puzzles = {};
  for (var i = 0; i < puzzles.length; i++) {
    cur_puzzles[puzzles[i].name] = puzzles[i];
    all_puzzles[puzzles[i].name] = puzzles[i];
  }
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
          solution_time = data.time;
          solution_length = data.length;
          myOutput.setValue(data.stdout + "\nRuntime: " + data.time.replace(/^\s+|\s+$/g, '') + " seconds\n\nSolution length: " + data.length + " characters");

          delete cur_puzzles[$("#puzzle").val()];

          solved_puzzles.push({
            puzzle_name: $("#puzzle").val(),
            solution: myCodeMirror.getValue(),
            language: $("#language").val().toLowerCase(),
            time: parseFloat(data.time),
            length: parseInt(data.length)
          });

          if (Object.keys(cur_puzzles).length == 0) {

            /* set game status to completed */
            update_per_bar(user.username, new_per(user.username, puzzle_percent($("#puzzle").val())));
            update_per_text(user.username, new_per(user.username, puzzle_percent($("#puzzle").val())));
            update_per_val(user.username, new_per(user.username, puzzle_percent($("#puzzle").val())));
            populate_puzzle_select();
            clearInterval(interval_id);

            $("#timer").css("color", "white");
            $("#timer").val("");
            $("#timer").text("--:--");
            $.post($(location).attr('href') + '/complete',
            {},
            
            function(data,status){
              game_end("Congratulations!");
            });
          }
          else {
            update_per_bar(user.username, new_per(user.username, puzzle_percent($("#puzzle").val())));
            update_per_text(user.username, new_per(user.username, puzzle_percent($("#puzzle").val())));
            update_per_val(user.username, new_per(user.username, puzzle_percent($("#puzzle").val())));
            myCodeMirror.setValue("");
            /* update puzzle list */
            
            populate_puzzle_select();
            puzzle_update();
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
});