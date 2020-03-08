import System.Environment
import UserFun
import Data.List
import System.Directory
import Control.Monad

slice begin end = take (end - begin) . drop begin

chunks n = takeWhile (not.null) . unfoldr (Just . splitAt n)
--toInt :: 
--convert "int" = 

--incr b c =
--    if b
 --       then c + 1
--        else c

--substring :: Int -> Int -> Text -> Text
--substring start end text = take (end - start) (drop start text)


--wordsWhen :: (Char -> Bool) -> String -> [String]
--wordsWhen p s =  case dropWhile p s of
--                      "" -> []
--                      s' -> w : wordsWhen p s''
--                            where (w, s'') = break p s'




--intArg a = (read a :: Integer)
--listIntArg a = map intArg (listStringArg a)

--stringArg a = a
--listStringArg a = wordsWhen (== ',') (substring 1 ((length a) - 1) a)


--floatArg a = (read a :: Float)
--listFloatArg a = map floatArg (listStringArg a)

--boolArg a = a == "true"
--listBoolArg a = map boolArg (listStringArg a)


--f func argTypes argList exp
--    do
--       let 


--intDispatch func argTypes argList exp
--    | argTypes == ["int"] = (func (intArg (argList !! 0))) == exp
 --   | argTypes == ["string"] = (func (stringArg (argList !! 0))) == exp
 --   | otherwise = False
--    | argTypes == ["int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1))) == exp)
--    | argTypes == ["int", "int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1)) (intArg (argList !! 2))) == exp)
--    | argTypes == ["int", "int", "int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1)) (intArg (argList !! 2)) (intArg (argList !! 3))) == exp)
--    | argTypes == ["string"] = ((func (stringArg (argList !! 0))) == exp)
--    | argTypes == ["string", "string"] = ((func (stringArg (argList !! 0)) (stringArg (argList !! 1))) == exp)
--    | argTypes == ["string", "string", "string"] = ((func (stringArg (argList !! 0)) (stringArg (argList !! 1)) (stringArg (argList !! 2))) == exp)
--    | argTypes == ["string", "string", "string", "string"] = ((func (stringArg (argList !! 0)) (stringArg (argList !! 1)) (stringArg (argList !! 2)) (stringArg (argList !! 3))) == exp)
--    | argTypes == ["bool"] = ((func (boolArg (argList !! 0))) == exp)
--    | argTypes == ["bool", "bool"] = ((func (boolArg (argList !! 0)) (boolArg (argList !! 1))) == exp)
--    | argTypes == ["bool", "bool", "bool"] = ((func (boolArg (argList !! 0)) (boolArg (argList !! 1)) (boolArg (argList !! 2))) == exp)
--    | argTypes == ["bool", "bool", "bool", "bool"] = ((func (boolArg (argList !! 0)) (boolArg (argList !! 1)) (boolArg (argList !! 2)) (boolArg (argList !! 3))) == exp)
--    | otherwise = False


--    --| argTypes == ["int"] = ((func (intArg (argList !! 0))) == exp)

--    --| argTypes == ["int", "string"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1))) == exp)
--    --| argTypes == ["int", "int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1)) (intArg (argList !! 2))) == exp)
--    --| argTypes == ["int", "int", "int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1)) (intArg (argList !! 2)) (intArg (argList !! 3))) == exp)
--    --| argTypes == ["int"] = ((func (intArg (argList !! 0))) == exp)
--    --| argTypes == ["int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1))) == exp)
--    --| argTypes == ["int", "int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1)) (intArg (argList !! 2))) == exp)
--    --| argTypes == ["int", "int", "int", "int"] = ((func (intArg (argList !! 0)) (intArg (argList !! 1)) (intArg (argList !! 2)) (intArg (argList !! 3))) == exp)

--    --do
--    --    let ret = func arg
--    --    ret == exp

--dispatch func argTypes retType argList exp
--    | retType == "int" = intDispatch func argTypes argList (intArg exp)
 --   | otherwise = False


--callFunc func argCount argList
--    | argCount == 0 = func
--    | argCount == 1 = func (argList !! 0)
--    | argCount == 2 = func (argList !! 0) (argList !! 1)
--    | argCount == 3 = func (argList !! 0) (argList !! 1) (argList !! 2)
--    | argCount == 4 = func (argList !! 0) (argList !! 1) (argList !! 2) (argList !! 3)
--    | argCount == 5 = func (argList !! 0) (argList !! 1) (argList !! 2) (argList !! 3) (argList !! 4)

--getArgList argCount argTypes testLines = slice 1 (1 + argCount) testLines
getRetVal argCount testLines = (testLines !! (1 + argCount))

--runTest argCount argTypes retType testLines = 
--    if dispatch UserFun.userFun argTypes retType (getArgList argCount argTypes testLines) (getRetVal argCount testLines)
--        then 1
--        else 0
--runTest2 argCount testLines = 
--    do
--        putStrLn "running test"
--        putStrLn (testLines !! 1)


runTest argCount testLines
    | argCount == 0 = UserFun.userFun " " " " " " " " (getRetVal argCount testLines)
    | argCount == 1 = UserFun.userFun (testLines !! 1) " " " " " " (getRetVal argCount testLines)
    | argCount == 2 = UserFun.userFun (testLines !! 1) (testLines !! 2) " " " " (getRetVal argCount testLines)
    | argCount == 3 = UserFun.userFun (testLines !! 1) (testLines !! 2) (testLines !! 3) " " (getRetVal argCount testLines)
    | argCount == 4 = UserFun.userFun (testLines !! 1) (testLines !! 2) (testLines !! 3) (testLines !! 4) (getRetVal argCount testLines)
    | otherwise = error "Invalid number of arguments"
 -- do
  --  let argList = slice 1 (1 + argCount) testLines
  --  let retVal = (testLines !! (1 + argCount))
   -- print argList
  --  print retVal
  --  dispatch UserFun.userFun argTypes retType argList retVal

main = do
    args <- getArgs
    --print =<< getCurrentDirectory
    let puzzlePath = intercalate "/" ["tests", "puzzle", (args !! 0) ++ ".txt"]
    --print puzzlePath
    puzzleFile <- readFile puzzlePath
    let puzzleLines = lines puzzleFile
    let testCount = read (puzzleLines !! 0) :: Int
    let argCount = read (puzzleLines !! 1) :: Int
    let argTypes = slice 2 (2 + argCount) puzzleLines
    let retType = (puzzleLines !! (2 + argCount))
    let testSlice = drop (3 + argCount) puzzleLines
    let tests = chunks (2 + argCount) testSlice

    --print argTypes
    --print retType

    --let passed = 0
    --let numPassed = foldr (+) 0 (map (runTest argCount argTypes retType) tests) 
    let numPassed = foldr (+) 0 (map (runTest argCount) tests) 
    --foldr (+) 0 (map (runTest argCount) tests) 
    --print numPassed

    if numPassed == testCount
        then putStrLn "All tests passed!"
        else putStrLn ("Number of tests passed: " ++ (show numPassed) ++ " out of " ++ (show testCount))

    --forM_  tests $ \test -> do
    --    let argList = slice 1 (1 + argCount) test
    --    let retVal = (test !! (1 + argCount))
    --    print argList
    --    print retVal
    --    let passed = dispatch UserFun.userFun argTypes retType argList retVal

        --passed : lst
        --lst = passed : lst
        --print passed
        --putStrLn "next"
        --if passed
        --    then do
         --       passed : lst
         --       putStrLn "Yay passed!" 
          --  else putStrLn "No, failed!"
           -- then putStrLn "Yay passed!" 
            --else putStrLn "No, failed!"

        --let argZero = (test !! 1)
        --putStrLn argZero


    --print testCount
    --print argCount

    --putStrLn retType
    --print passed

--print (lines !! 0)
    --print
    --let output = UserFun.userFun 8
   -- putStrLn "All tests passed!"