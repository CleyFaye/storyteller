@echo off
cd ..\boilerplate
call npm pack
cd ..\storyteller
call npm install -D ..\boilerplate\cley_faye-boilerplate-0.1.1.tgz
powershell -command "Get-ChildItem node_modules -Include .cache -Recurse | Remove-Item -Recurse"