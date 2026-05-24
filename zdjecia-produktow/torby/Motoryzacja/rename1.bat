@echo off
setlocal enabledelayedexpansion
set cnt=1
for %%f in (*.*) do (
    if "%%f" neq "%~nx0" (
        set num=0!cnt!
        set num=!num:~-2!
        ren "%%f" MOTO"_!num!%%~xf"
        set /a cnt+=1
    )
)