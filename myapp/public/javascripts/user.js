
var new_rank;
var user;


function get_rank_path(rank) {

	return "/images/ranks/" + rank.toLowerCase() + ".png";
}

function window_change() {
	var width = window.innerWidth;
	console.log("width", width);
	if (width < 550) {
		$("#easy-header").text("Easy");
		$("#moderate-header").text("Mod.");
		$("#challenging-header").text("Chal.");
		$("#total-header").text("Tot.");		
		$("#win-header").text("W.");	
		$("#loss-header").text("L.");			
		$("#statistics-header").text("Stats");			
		$("#rank_image").width("90%");
	}
	else {
		$("#easy-header").text("Easy");
		$("#moderate-header").text("Moderate");
		$("#challenging-header").text("Challenging");
		$("#total-header").text("Total");		
		$("#win-header").text("Wins");	
		$("#loss-header").text("Losses");	
		$("#statistics-header").text("Statistics");	
		$("#rank_image").width(160);
	}


}

window.addEventListener("resize", window_change);

$(document).ready(function(){

	window_change();

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

			$.ajax({
				url : '/submit-picture',
				type : 'POST',
				data : formData,
				processData: false,  // tell jQuery not to process the data
				contentType: false,  // tell jQuery not to set contentType
				success : function(data) {
					d = new Date();
					$("#profile_image").attr("src", "/user/" + user.username + "/picture_resized?" + d.getTime());
				},
				error: function (error) {
					alert("An error occurred while uploading your file.")
				}
			});
	};



	$("#file").on("change", function (e) {
		var file = $(this)[0].files[0];
		var upload = new Upload(file);

		// maybe check size or type here with upload.getSize() and upload.getType()

		// execute upload
		upload.doUpload();
	});

	if (new_rank) {
		alert("A winner is you! Congratulations on gaining the rank of " + user.rank + ".");
	}
});