


/*
import sys as sys
#import importlib

puzzle_name = sys.argv[1]
#username = sys.argv[2]


#mod = importlib.import_module(username)
#fun = getattr(mod, puzzle_name)



#from erik import f
*/

//const lineReader = require('line-reader');

const path = require('path');

//console.log("got here");
puzzle_name = process.argv[2];
username = process.argv[3];

//console.log("puzzle_name", puzzle_name);

//console.log("username", username);

//userfile = username + ".js";

//let { fib } = await import(userfile);
//console.log(process.cwd());
const m = require(path.join("..", "user", username, "UserFun"));
let userfun = m[puzzle_name];
//console.log(userfun(3));
//console.log(m[puzzle_name](3));
//fnparams = [1];
//var userfun = window[puzzle_name];
//if (typeof userfun === "function") userfun.apply(null, 1);

//console.log(fib(23));
/*
type_lookup = {
	'int': int,
	'float': float,
	'str': str
}
*/

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
//const readline = require('readline');
/*
lineReader.open("tests/" + puzzle_name + ".txt", function(reader) {
	let num_tests = reader.nextLine();
	console.log(num_tests);
})
*/
const lineByLine = require('n-readlines');

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
	

/*
fs.readFile("tests/" + puzzle_name + ".txt", 'utf8', function read(err, data) {
	if (err) {
		console.log(err);
	}
	//content = data;
	console.log(data);
	//return content;
});
*/

/*
f = open("tests/" + puzzle_name + ".txt")
test_count = int(f.readline().rstrip())
arg_count = int(f.readline().rstrip())
argt = []
for j in range(arg_count):
	argt.append(f.readline().rstrip())

ret_type = f.readline().rstrip()

#outfile = open(puzzle_name + "_outputs.txt")
if debug:
	print(argt)

passed = 0
for i in range(test_count):
	if debug:
		print()
		print("TEST ", i)


	f.readline()
	argv = []
	for j in range(arg_count):
		argv.append(convert(f.readline().rstrip(), argt[j]))
	ret = convert(f.readline().rstrip(), ret_type)
	if debug:
		print("arguments:", argv)
		print("expected: ", ret)
	if globals()[puzzle_name](*argv) == ret:
		passed += 1





#passed = 0
#for i in range(len(inputs)):
#	if globals()[puzzle_name](inputs[i]) == outputs[i]:
#		passed += 1


if passed == test_count:
	print("All tests passed!")
else:
	print("Number of tests passed: " + str(passed) + " out of " + str(test_count))
	*/