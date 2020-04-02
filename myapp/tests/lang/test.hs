import System.Environment
import UserFun
import Data.List
import System.Directory
import Control.Monad


-- Test Harness for Haskell


slice begin end = take (end - begin) . drop begin

chunks n = takeWhile (not.null) . unfoldr (Just . splitAt n)

getRetVal argCount testLines = (testLines !! (1 + argCount))

runTest argCount testLines
    | argCount == 0 = UserFun.userFun " " " " " " " " (getRetVal argCount testLines)
    | argCount == 1 = UserFun.userFun (testLines !! 1) " " " " " " (getRetVal argCount testLines)
    | argCount == 2 = UserFun.userFun (testLines !! 1) (testLines !! 2) " " " " (getRetVal argCount testLines)
    | argCount == 3 = UserFun.userFun (testLines !! 1) (testLines !! 2) (testLines !! 3) " " (getRetVal argCount testLines)
    | argCount == 4 = UserFun.userFun (testLines !! 1) (testLines !! 2) (testLines !! 3) (testLines !! 4) (getRetVal argCount testLines)
    | otherwise = error "Invalid number of arguments"

main = do
    args <- getArgs

    let puzzlePath = intercalate "/" ["tests", "puzzle", (args !! 0) ++ ".txt"]

    puzzleFile <- readFile puzzlePath
    let puzzleLines = lines puzzleFile
    let testCount = read (puzzleLines !! 0) :: Int
    let argCount = read (puzzleLines !! 1) :: Int
    let argTypes = slice 2 (2 + argCount) puzzleLines
    let retType = (puzzleLines !! (2 + argCount))
    let testSlice = drop (3 + argCount) puzzleLines
    let tests = chunks (2 + argCount) testSlice


    let numPassed = foldr (+) 0 (map (runTest argCount) tests) 

    if numPassed == testCount
        then putStrLn "All tests passed!"
        else putStrLn ("Number of tests passed: " ++ (show numPassed) ++ " out of " ++ (show testCount))