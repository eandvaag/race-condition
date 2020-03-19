import sys as sys
import os

puzzle_name = sys.argv[1]
username = sys.argv[2]

sys.path.insert(1, os.path.join(os.getcwd(), "tests", "user", username))


def import_from(module, name):
    module = __import__(module, fromlist=[name])
    return getattr(module, name)

userfun = import_from("UserFun", puzzle_name)

def convert(str_arg, typ):
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


passed = 0
for i in range(test_count):

	f.readline()
	argv = []
	for j in range(arg_count):
		argv.append(convert(f.readline().rstrip(), argt[j]))
	ret = convert(f.readline().rstrip(), ret_type)

	if userfun(*argv) == ret:
		passed += 1


if passed == test_count:
	print("All tests passed!")
else:
	print("Number of tests passed: " + str(passed) + " out of " + str(test_count))