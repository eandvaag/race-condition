


$(document).ready(function(){

  var Upload = function (file) {
      this.file = file;
  };

  Upload.prototype.getType = function() {
      return this.file.type;
  };
  Upload.prototype.getSize = function() {
      return this.file.size;
  };
  Upload.prototype.getName = function() {
      return this.file.name;
  };
  Upload.prototype.doUpload = function () {
      var that = this;
      var formData = new FormData();

      // add assoc key values, this will be posts values
      formData.append("file", this.file, this.getName());
      formData.append("upload_file", true);

      console.log(formData);
      $.ajax({
       url : '/submit-picture',
       type : 'POST',
       data : formData,
       processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
       success : function(data) {
           console.log(data);
           alert(data);
       }
      });
      /*
      $.post("/submit-picture", {
        form: formData
      },
      function(response, status) {
        if (response.success) {
          console.log("succesfully uploaded file");
        }
        else {
          console.log("error occurred");
        }
      });*/
      /*

      $.ajax({
          type: "POST",
          url: "/submit-picture",

          
          xhr: function () {
              var myXhr = $.ajaxSettings.xhr();
              if (myXhr.upload) {
                  myXhr.upload.addEventListener('progress', that.progressHandling, false);
              }
              return myXhr;
          },
          success: function (data) {
              console.log("successfully added picture");
          },
          error: function (error) {
              console.log("error during upload");// handle error
          },
          async: true,
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000
      });
      */
  };



  $("#file").on("change", function (e) {
    var file = $(this)[0].files[0];
    console.log(file);
    var upload = new Upload(file);

    // maybe check size or type here with upload.getSize() and upload.getType()

    // execute upload
    upload.doUpload();
  });

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
        $("#error_message").text("The password you entered is invalid. A password must contain at least one letter, one number, and one special character. A minimum of 8 characters is required.");
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