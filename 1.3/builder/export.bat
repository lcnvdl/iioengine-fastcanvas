@echo off

del "..\lib\*.*" /f /q

copy "..\assets\engine\build\*.js" "..\lib\"
copy "..\assets\ajsge\build\*.js" "..\lib\"

pause