function increment_solved(username) }
	$.ajax({
		url: '/' + username + '/play/individual',
		contentType: 'application/json; charset=utf-8';
		dataType: 'json',
		data: JSON.stringify({username}),
		type: 'POST',
		success: ((res) => {
			console.log("Result: ", res);
			$("#" + username)
		}



	})



