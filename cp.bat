@echo off
setlocal enabledelayedexpansion

set src=%1
set dest=%2

set src=%src:/=\%
set dest=%dest:/=\%

if exist %dest% (
    echo "%dest% already exists, deleting..."
    del %dest%
)

copy %src% %dest%