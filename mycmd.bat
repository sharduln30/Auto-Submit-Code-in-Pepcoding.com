cls
set /a x=0
:start
node pep.js credentials.json metadata.json "Online Java Foundation"
set /a x+=1
echo %x%
goto start