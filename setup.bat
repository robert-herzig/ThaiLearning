@echo off
echo === Thai Anki Deck Setup ===
echo.

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error installing dependencies. Please check:
    echo    1. Python is installed and in PATH
    echo    2. You have internet connection
    echo    3. Run as administrator if needed
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

echo 🎌 Generating Thai Anki deck...
python generate_thai_deck.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error generating deck. Please check the output above.
    pause
    exit /b 1
)

echo.
echo 🎉 Thai Anki deck created successfully!
echo.
echo 📋 Next steps:
echo    1. Install Anki from https://apps.ankiweb.net/
echo    2. Import Thai_Language_Complete.apkg into Anki
echo    3. Start learning Thai! สวัสดี (sàwàtdii) = Hello
echo.
pause
