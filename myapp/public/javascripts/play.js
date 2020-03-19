

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
    //$('#code_panel').css("opacity", 0.5);
}

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

}

function start_play(user, usernames) {
    // Get the modal
  var join_modal = document.getElementById("join_modal");

  // Get the button that opens the modal
  var join_btn = document.getElementById("join_game");

  // Get the <span> element that closes the modal
  var join_span = document.getElementsByClassName("close")[0];

  var create_span = document.getElementsByClassName("close")[1];



  var create_modal = document.getElementById("create_modal");

  var create_btn = document.getElementById("create_game");


  var submit_btn = document.getElementById("submit_game");

  console.log(usernames);


  /* remove the user's name from list of usernames */
  const index = usernames.indexOf(user.username);
  if (index > -1) {
    usernames.splice(index, 1);
  }

  //$('#autocomplete').autocomplete().disable();
  
  $("#usernames").autocomplete({
    source: function(request, response) {
      var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
          response( $.grep( usernames, function( item ){
              return matcher.test( item );
        }) );
      }
  });

  //var span1 = document.getElementById("join_close");

  //console.log(span);
  //console.log(span1);


  var socket;
  var current_games;

  create_btn.onclick = function() {
    create_modal.style.display = "block";
    enable_input();

    socket = io();
    socket.emit("start_create", user);

    $(":checkbox").prop("checked", true);
    $("#num_easy").val(1);
    $("#num_moderate").val(1);
    $("#num_challenging").val(1);
    $("#usernames").val("");
    $("#error_message").hide();
    $("#create_loader").hide();
  }

  // When the user clicks on the button, open the modal
  join_btn.onclick = function() {

    join_modal.style.display = "block";
  //$("#invitation").hide();

    console.log(user);

    socket = io();

    socket.emit("join", user);

    socket.on("invitations", function(games) {

      $("#invitation_list").empty();
      let current_games = games;
      for (var i = 0; i < games.length; i++) {
        /*
        $('#invitation_list').append('<li><a onclick=socket.emit("accept", ' + games[i] + 
          '); window.location.href="/play/' + games[i].id + '">' + games[i].creator + '</a></li>');
          */

        $('#invitation_list').append('<li><a id="game_' + i + '">' + current_games[i].creator + '</a></li>');
        $("#game_" + i).click(function() {
          console.log($(this).attr('id').split("_")[1]);
          socket.emit("accept", current_games[$(this).attr('id').split("_")[1]]);
          window.location.href = "/play/" + current_games[$(this).attr('id').split("_")[1]].id;
        })
      }
      console.log(games);
    });

    socket.on("invitation_update", function() {
      socket.emit("get_invitations", user);
    });

    /* on click .. notify games[i].creator and then redirect to game */

  }

  // When the user clicks on <span> (x), close the modal
  join_span.onclick = function() {
    console.log("clicked join x")
    socket.emit("quit");

    join_modal.style.display = "none";

  }

  create_span.onclick = function() {
    console.log("clicked create x")
    socket.emit("quit");
    create_modal.style.display = "none";

  }



  submit_btn.onclick = function() {


    $("#error_message").hide();
    $("#create_loader").hide();

    console.log("you clicked me");
    if (!($('#create_modal input[type=checkbox]:checked').length)) {
      $("#error_message").text("You must select at least one language.");
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


          console.log(langs);

          disable_input();


          socket.emit("create_game", game_info);
        }
      });
    }

    socket.on("created", function() {
      $("#create_loader").show();
      $("#sent_message").html("<b>Game has been created! Waiting for " + $("#usernames").val() + " to join!</b>");
    });

    socket.on("game_accepted", function(game) {
      console.log("my game was accepted!");
      window.location.href = "/play/" + game.id;
    });

  }


  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {

    if ((event.target == join_modal) || (event.target == create_modal)) {
      socket.emit("quit");

      join_modal.style.display = "none";
      create_modal.style.display = "none";
    }
/*
    else if (event.target == create_modal) {
      socket.emit("quit");

      create_modal.style.display = "none";

    }
    */
  }
}