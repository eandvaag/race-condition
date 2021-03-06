/* client-side form validation and submission for the 'play' page */


/* ensures that number inputs are restricted to numbers of length 'maxlength' */
/* from https://stackoverflow.com/questions/18510845/maxlength-ignored-for-input-type-number-in-chrome */
$(document).ready(function(){
  $('body').on('keypress', 'input[type=number][maxlength]', function(event){

      var key = event.keyCode || event.charCode;
      var charcodestring = String.fromCharCode(event.which);
      var txtVal = $(this).val();
      var maxlength = $(this).attr('maxlength');
      var regex = new RegExp('^[0-9]+$');
      // 8 = backspace 46 = Del 13 = Enter 39 = Left 37 = right Tab = 9
      if( key == 8 || key == 46 || key == 13 || key == 37 || key == 39 || key == 9 ){
          return true;
      }
      // maxlength allready reached
      if(txtVal.length==maxlength){
          event.preventDefault();
          return false;
      }
      // pressed key have to be a number
      if( !regex.test(charcodestring) ){
          event.preventDefault();
          return false;
      }
      return true;
  });

  $('body').on('paste', 'input[type=number][maxlength]', function(event) {
      // catch copy and paste
      var ref = $(this);
      var regex = new RegExp('^[0-9]+$');
      var maxlength = ref.attr('maxlength');
      var clipboardData = event.originalEvent.clipboardData.getData('text');
      var txtVal = ref.val(); // current value
      var filteredString = '';
      var combined_input = txtVal + clipboardData; // don't forget old data

      for (var i = 0; i < combined_input.length; i++) {
          if( filteredString.length < maxlength ){
              if( regex.test(combined_input[i]) ){
                  filteredString += combined_input[i];
              }
          }
      }
      setTimeout(function(){
          ref.val('').val(filteredString)
      },100);
  });

});

/* disable input when user submits a game */
function disable_input(){
    $("input").prop("disabled", true);
    $("#usernames").prop("disabled", true);
    $("#submit_game").prop("disabled", true);

    $('#submit_game').css("opacity", 0.5);
    $("#usernames").css("opacity", 0.5);
    $("img").css("opacity", 0.5);
    $(".image_label").css("opacity", 0.5);
    $("label").css("opacity", 0.5);
    $("input").css("opacity", 0.5);

    $("#submit_game").removeClass("button-hover");
    $("#submit_game").css("cursor", "wait");
    $("#submit_game_text").css("cursor", "wait");

    $("#num_easy").attr("dis", "true");
    $("#num_moderate").attr("dis", "true");
    $("#num_challenging").attr("dis", "true");

    $("input").css("cursor", "wait");
    $(".quantity-up").css("cursor", "wait");
    $(".quantity-down").css("cursor", "wait");

    $(".image_label").css("cursor", "wait");


}

/* for re-enabling input */
function enable_input(){

    $("input").prop("disabled", false);
    $("#usernames").prop("disabled", false);
    $("#submit_game").prop("disabled", false);

    $('#submit_game').css("opacity", 1);
    $("#usernames").css("opacity", 1);
    $("img").css("opacity", 1);
    $(".image_label").css("opacity", 1);
    $("label").css("opacity", 1);
    $("input").css("opacity", 1);

    $("#submit_game").addClass("button-hover");
    $("#submit_game").css("cursor", "pointer");  
    $("#submit_game_text").css("cursor", "pointer");

    $("#num_easy").attr("dis", "false");
    $("#num_moderate").attr("dis", "false");    
    $("#num_challenging").attr("dis", "false");

    $("input").css("cursor", "text");
    $(".quantity-up").css("cursor", "pointer");
    $(".quantity-down").css("cursor", "pointer");

    $(".image_label").css("cursor", "pointer");
}

function start_play(user, usernames) {

  var time_modal = document.getElementById("time_modal");

  var time_btn = document.getElementById("time_game");

  var time_span = document.getElementsByClassName("close")[0];

  var join_modal = document.getElementById("join_modal");

  var join_btn = document.getElementById("join_game");

  var join_span = document.getElementsByClassName("close")[1];

  var create_span = document.getElementsByClassName("close")[2];

  var create_modal = document.getElementById("create_modal");

  var create_btn = document.getElementById("create_game");

  var submit_time_btn = document.getElementById("submit_time_game");

  var submit_btn = document.getElementById("submit_game");


  /* remove the user's name from list of usernames */
  const index = usernames.indexOf(user.username);
  if (index > -1) {
    usernames.splice(index, 1);
  }
  
  $("#usernames").autocomplete({
    source: function(request, response) {
      var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
          response( $.grep( usernames, function( item ){
              return matcher.test( item );
        }) );
      }
  });

  var socket;
  var current_games;

  /* display modal for time-attack mode */
  time_btn.onclick = function() {
    enable_input();
    $("#footer").css("opacity", 0.4);
    $("#num_easy_time").val(1);
    $("#num_moderate_time").val(0);
    $("#num_challenging_time").val(0);
    $("#error_message_time").hide();
    time_modal.style.display = "block";

  }

  /* display modal for creating a game */
  create_btn.onclick = function() {
    $("#footer").css("opacity", 0.4)
    create_modal.style.display = "block";
    enable_input();

    socket = io();
    socket.emit("start_create", user);

    $(":checkbox").prop("checked", true);
    $("#num_easy").val(1);
    $("#num_moderate").val(0);
    $("#num_challenging").val(0);
    $("#usernames").val("");
    $("#error_message").hide();
    $("#create_loader").hide();
  }

  /* display modal for joining a game */
  join_btn.onclick = function() {

    $("#footer").css("opacity", 0.4);
    join_modal.style.display = "block";

    socket = io();

    socket.emit("join", user);

    socket.on("invitations", function(games) {

      $("#invitation_list").empty();
      let current_games = games;
      for (var i = 0; i < games.length; i++) {

        $("#invitation_list").append('<br><button style="text-align:center; width:280px" class="button-hover" id="game_' + i + '">' + 
          '<span>' + current_games[i].creator + '</span></button>');

        $("#game_" + i).click(function() {
          socket.emit("accept", current_games[$(this).attr('id').split("_")[1]]);
          window.location.href = "/play/" + current_games[$(this).attr('id').split("_")[1]].id;
        })
      }
    });

    socket.on("invitation_update", function() {
      socket.emit("get_invitations", user);
    });

  }

  /* close the time-attack modal */
  time_span.onclick = function() {
    time_modal.style.display = "none";
    $("#footer").css("opacity", 1);
  }


  /* close the join game modal */
  join_span.onclick = function() {
    socket.emit("quit");

    join_modal.style.display = "none";
    $("#footer").css("opacity", 1);

  }

  /* close the create game modal */
  create_span.onclick = function() {
    socket.emit("quit");
    create_modal.style.display = "none";
    $("#footer").css("opacity", 1);

  }


  /* user submits a time-attack game */
  submit_time_game.onclick = function() {
    if 
      (((((($("#num_easy_time").val() < 0) ||  $("#num_easy_time").val() > 5) ||
        $("#num_moderate_time").val() < 0) ||  $("#num_moderate_time").val() > 5) ||
        $("#num_challenging_time").val() < 0) ||  $("#num_challenging_time").val() > 5) {
      $("#error_message_time").text("The number of puzzles in each category must be between 0 and 5 (inclusive).");
      $("#error_message_time").show();
    }
    else if ((($("#num_easy_time").val() == 0) && ($("#num_moderate_time").val() == 0)) && 
             ($("#num_challenging_time").val() == 0)) {
      $("#error_message_time").text("A game requires at least one puzzle.");
      $("#error_message_time").show();
    }
    else {
      
      $.post("/play/time-attack", {
        num_easy: $("#num_easy_time").val(),
        num_moderate: $("#num_moderate_time").val(),
        num_challenging: $("#num_challenging_time").val()
      },
      function(response,status) {
        if (response.redirect) {
          window.location.href = response.redirect;
        }
        else if (response.not_num || response.bad_num) {
          $("#error_message_time").text("The number of puzzles in each category must be between 0 and 5 (inclusive).");
          $("#error_message_time").show();          
        }
        else if (response.all_zero) {
          $("#error_message_time").text("A game requires at least one puzzle.");
          $("#error_message_time").show();              
        }
        else if (response.game_id) {
          window.location.href = '/play/time-attack/' + response.game_id;
          
        }
        else {
          $("#error_message_time").text("An error occurred during the creation of your game.");
          $("#error_message_time").show();
        }
      });
    }
  }

  /* user submits a created game */
  submit_btn.onclick = function() {


    $("#error_message").hide();
    $("#create_loader").hide();

    let pattern = new RegExp('/^(0|[1-9]+[0-9]*)$/');

    if (!($('#create_modal input[type=checkbox]:checked').length)) {
      $("#error_message").text("You must select at least one language.");
      $("#error_message").show();
    }
    else if 
      (((((($("#num_easy").val() < 0) ||  $("#num_easy").val() > 5) ||
        $("#num_moderate").val() < 0) ||  $("#num_moderate").val() > 5) ||
        $("#num_challenging").val() < 0) ||  $("#num_challenging").val() > 5) {
      $("#error_message").text("The number of puzzles in each category must be between 0 and 5 (inclusive).");
      $("#error_message").show();
    }
    else if ((($("#num_easy").val() == 0) && ($("#num_moderate").val() == 0)) && 
             ($("#num_challenging").val() == 0)) {
      $("#error_message").text("A game requires at least one puzzle.");
      $("#error_message").show();
    }
    else if ($("#usernames").val() === "") {
      $("#error_message").text("You need to invite someone to the game!");
      $("#error_message").show();
    }
    else if ($("#usernames").val() === user.username) {
      $("#error_message").text("You cannot invite yourself to the game!");
      $("#error_message").show();
    }
    else {

      $.post('verify-user', 
      {
        username: $("#usernames").val()
      },
      function(response, status) {
        if (response.not_found) {
          $("#error_message").text("Sorry, we could not find a user with that name.");
          $("#error_message").show();
        }
        else { 
          let langs = "";
          $(':checkbox').each(function() {
            if (this.checked) {
              langs += (langs == "" ? ($(this).val()) : "," + ($(this).val()));
            }
            
          });
          let game_info = {
            "languages": langs,
            "num_easy": $("#num_easy").val(),
            "num_moderate": $("#num_moderate").val(),
            "num_challenging": $("#num_challenging").val(),
            "creator": user.username,
            "invitee": $("#usernames").val()
          };

          disable_input();


          socket.emit("create_game", game_info);
        }
      });
    }

    socket.on("invalid", function() {
      $("#error_message").text("Sorry, an error occurred during the creation of your game.");
      $("#error_message").show();
    });

    socket.on("created", function() {
      $("#create_loader").show();
      $("#sent_message").html("<b>Game has been created! Waiting for " + $("#usernames").val() + " to join!</b>");
    });

    socket.on("game_accepted", function(game) {
      window.location.href = "/play/" + game.id;
    });

  }

  /* hide the modal when user clicks outside of the modal area */
  window.onclick = function(event) {

    if ((event.target == join_modal) || (event.target == create_modal)) {
      socket.emit("quit");

      join_modal.style.display = "none";
      create_modal.style.display = "none";
      $("#footer").css("opacity", 1);

    }
    if ((event.target == time_modal)) {
      time_modal.style.display = "none";
      $("#footer").css("opacity", 1);
    }
  }
}