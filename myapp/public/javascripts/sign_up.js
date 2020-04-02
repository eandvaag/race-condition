/* for submitting sign-up information to server */


$(document).ready(function(){

  $("#error_message").hide();

  $('form').submit(function(e){
    e.preventDefault();

    $.post($(location).attr('href'),
    {
      username: $("#username").val(),
      password: $("#password").val()
    },
    
    function(response,status){

      if (response.error) {
        $("#error_message").text("Sorry, an error occurred during the creation of your account.");
        $("#error_message").show();
        $("#spacing").hide();
      }
      else if (response.bad_username) {
        $("#error_message").text("The username you entered is invalid. Use only alphanumeric characters and underscores. A minimum of 4 characters is required.");
        $("#error_message").show();
        $("#spacing").hide();
      }
      else if (response.bad_password) {
        $("#error_message").text("The password you entered is invalid. A password must contain at one number and one special character. A minimum of 8 characters is required.");
        $("#error_message").show();
        $("#spacing").hide();
      }
      else if (response.username_taken) {
        $("#error_message").text("The username you entered is already in use.");
        $("#error_message").show();
        $("#spacing").hide();
      }
      else {
        window.location.href = response.redirect;
      }
    });
  });
});