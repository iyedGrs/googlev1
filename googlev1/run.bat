@echo off
REM Simple batch script to run Spring Boot with updated config

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d "%~dp0"

REM Compile first
echo Compiling...
javac -version

REM Check if classes are compiled
if not exist target\classes\com\googlev1\GoogleV1Application.class (
    echo Classes not found - you need to run: mvn compile first
    exit /b 1
)

echo.
echo ====================================
echo Starting Spring Boot Application
echo ====================================
echo.
echo Java Version:
%JAVA_HOME%\bin\java.exe -version

echo.
echo Classpath includes: target/classes + M2 repository dependencies
echo.

REM Try to run using org.springframework.boot.loader.launch.JarLauncher if available
REM Or run the main class directly if all dependencies are in classpath

%JAVA_HOME%\bin\java.exe -Dfile.encoding=UTF-8 -cp "target\classes;target\dependency\*" com.googlev1.GoogleV1Application
