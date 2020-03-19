const path = require('path');

puzzle_name = process.argv[2];
username = process.argv[3];


const m = require(path.join("..", "user", username, "UserFun"));
let userfun = m[puzzle_name];


debug = false;

function convert(str_arg, typ) {
	if (debug) {
		print("str_arg: ", str_arg)
		print("typ: ", typ)
	}
	if (typ == 'int')
		return parseInt(str_arg);
	else if (typ == 'float')
		return parseFloat(str_arg);
	else if (typ == 'string')
		return str_arg;
	else if (typ == 'char')
		return str_arg;
	else if (typ == 'bool')
		return (str_arg == "true");
	else if (typ == 'list-int') {
		lis = str_arg.split(",");
		for (var i = 0; i < lis.length; i++) {
			lis[i] = parseInt(lis[i]);
		}
		return lis;
	}
	else {
		return "unfinished";
	}

}


var fs = require('fs');

const lineByLine = require('/usr/src/app/node_modules/n-readlines');

const liner = new lineByLine(path.join("tests", "puzzle", puzzle_name + ".txt"));

let line;

let test_count = parseInt(liner.next().toString('ascii'));
let arg_count = parseInt(liner.next().toString('ascii'));

let argt = [];

for (var i = 0; i < arg_count; i++) {
	argt.push(liner.next().toString('ascii'));
}

let ret_type = liner.next().toString('ascii');


let passed = 0;
for (var i = 0; i < test_count; i++) {

	liner.next();

	let argv = [];
	for (var j = 0; j < arg_count; j++) {
		argv.push(convert(liner.next().toString('ascii'), argt[j]));
	}
	let ret = convert(liner.next().toString('ascii'), ret_type);

	if ((userfun(...argv)) === ret) {
		passed++;
	}

}

if (passed == test_count) {
	console.log("All tests passed!");
}
else {
	console.log("Number of tests passed:", passed, "out of", test_count);
}