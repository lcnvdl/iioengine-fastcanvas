@echo off
cd jscompiler

@echo iioEngine
del "..\..\core\iioengine.min.js"
java -jar compiler.jar --js="..\..\core\iioengine.js" --js_output_file="..\..\core\iioengine.min.js"

pause