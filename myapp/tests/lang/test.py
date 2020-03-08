



import sys as sys
#import importlib
import os

puzzle_name = sys.argv[1]
username = sys.argv[2]
#username = sys.argv[2]
sys.path.insert(1, os.path.join(os.getcwd(), "tests", "user", username))

#from userfile import puzzle_name as userfun
def import_from(module, name):
    module = __import__(module, fromlist=[name])
    return getattr(module, name)

userfun = import_from("UserFun", puzzle_name)
#userfun = import_from("erik", puzzle_name)

#mod = importlib.import_module(userfile)
#userfun = getattr(mod, puzzle_name)



#from erik import f




#print(puzzle_name(2))

#print(f(2))


#inputs = [1,2,3]

#outputs = [4,5,6]

type_lookup = {
	'int': int,
	'float': float,
	'str': str
}


debug = False

def convert(str_arg, typ):
	if debug:
		print("str_arg: ", str_arg)
		print("typ: ", typ)
	if typ == 'int':
		return int(str_arg)
	elif typ == 'float':
		return float(str_arg)
	elif typ == 'string':
		return str_arg
	elif typ == 'char':
		return str_arg
	elif typ == 'bool':
		return (str_arg == "true")
	elif typ == 'list-int':
		lis = str_arg.split(",")
		#print("lis", lis)
		if lis == [""]:
			return []
		else:
			return [int(x) for x in lis]
	else:
		return "unfinished"



f = open(os.path.join("tests", "puzzle", puzzle_name + ".txt"))
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
	#if globals()[puzzle_name](*argv) == ret:
	if userfun(*argv) == ret:
		passed += 1





#passed = 0
#for i in range(len(inputs)):
#	if globals()[puzzle_name](inputs[i]) == outputs[i]:
#		passed += 1


if passed == test_count:
	print("All tests passed!")
else:
	print("Number of tests passed: " + str(passed) + " out of " + str(test_count))