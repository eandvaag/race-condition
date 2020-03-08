function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

const form = document.forms["sign_up"];

form.addEventListener('submit', validate, false);

function validate(e) {
	if (hasWhiteSpace(form.username.value) || hasWhiteSpace(form.password.value)) {
		console.log(form.username);
		console.log(form.password);
		e.preventDefault();
		alert("Whitespace is not allowed in the username and password.")
	}
}