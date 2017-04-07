(function () {
    "use strict";

    window.addEventListener("load", onInit);
    // ------------------------------------------------------------ event handlers
    function onInit() {
        console.log(">> initializing");



        // get reference to canvas
        canvas = document.getElementById("stage");
        // set canvas to as wide/high as the browser window
        canvas.width = 600;
        canvas.height = 600;
        // create stage object
        stage = new createjs.Stage(canvas);

        // construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.addEventListener("onAllAssetsLoaded", onSetup);
        // load the assets
        assetManager.loadAssets(manifest);

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
        // Ticker For the Event Ticker
        createjs.Ticker.addEventListener("tick", tickEvent);
    }

    function onSetup() {
        console.log(">> setup");
        // kill event listener
        stage.removeEventListener("onAllAssetsLoaded", onSetup);

        // construct game objects
        background = assetManager.getSprite("assets");
        background.gotoAndStop("background");
        stage.addChild(background);

        // Called before the game starts
        introCaption = assetManager.getSprite("assets");
        introCaption.gotoAndStop("introCaption");
        introCaption.x = 50;
        introCaption.y = 50;
        stage.addChild(introCaption);
        
        //mouseDown = new MouseDown(stage, assetManager);

        // Called when the game is over
        gameOverCaption = assetManager.getSprite("assets");
        gameOverCaption.gotoAndStop("gameOverCaption");
        gameOverCaption.x = 50;
        gameOverCaption.y = 50;



        //Add timer
        timerText = new createjs.Text("Time: " + gameTime.toString(), "26px Arial", "#FFF");
        // get the x and the y position for the time text
        timerText.x = 400;
        timerText.y = 10;

        //Add score
        scoreText = new createjs.Text("Kills: " + score.toString(), "26px Arial", "#FFF");
        scoreText.x = 10;
        scoreText.y = 10;

        // Create the 
        createGhost();
        
        background.addEventListener("click", onStartGame);
    }

    function onStartGame(e) {
        background.removeEventListener("click", onStartGame);
        stage.removeChild(introCaption);
        var gameTimer = setInterval(updateTime, 1000);
        window.onmousedown = handleMouseDown;
        stage.addChild(timerText);
        stage.addChild(scoreText);
        stage.addChild(snakeLiving);

    }
    
    function onGameEnd(){
        // Remove the following
        // Snake Animation
        stage.removeChild(snakeLiving);
        // Timer Text
        stage.removeChild(timerText);
        // Score Text
        stage.removeChild(scoreText);
        // Call The Game Over Caption
        stage.addChild(gameOverCaption);
        
        createjs.Ticker.removeEventListener("tick",tickEvent);
        
    }
    
    function onTick(e) {
        // TESTING FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // update the stage!
        stage.update();
    }

    function updateTime() {
        gameTime += 1;
        if (gameTime > 30) {
            // remove the ghost when the timer is over
            onGameEnd();
            clearInterval(gameTime);

        }
        else {
            timerText.text = "Time: " + gameTime
        }
    }

    function createGhost() {
        snakeLiving = assetManager.getSprite("assets");
        snakeLiving.regX = 50;
        snakeLiving.regY = 50;
        snakeLiving.x = ghostXPos;
        snakeLiving.y = ghostYPos;
        snakeLiving.gotoAndPlay("snakeAlive");
        stage.addChild(snakeLiving);
        console.log("loading");

    }

    function tickEvent() {

        // X AXIS OPERATIONS:

        // Guarantee that the enemy is within the game boundaries
        if (ghostXPos < _width && ghostXPos > 0) {
            // Move the enemy by its speed
            ghostXPos += ghostXSpeed;

        } else {
            // Invert the direction in which the enemy moves
            ghostXSpeed = ghostXSpeed * (-1);
            // Move the enemy by its speed
            ghostXPos += ghostXSpeed;

        }

        // Y AXIS OPERATIONS:

        // Guarantee that the enemy is within the game boundaries
        if (ghostYPos < _height && ghostYPos > 0) {
            // Move the enemy by its speed
            ghostYPos += ghostYSpeed;
        } else {
            // Invert the direction in which the enemy moves
            ghostYSpeed = ghostYSpeed * (-1);
            // Move the enemy by its speed
            ghostYPos += ghostYSpeed;
        }
        // Move the sprite according to the enemy
        snakeLiving.x = ghostXPos;
        snakeLiving.y = ghostYPos;

    }

    function handleMouseDown(event) {
        //Increasing speed of the enemy
        ghostXSpeed *= 1.05;
        ghostYSpeed *= 1.06;

        //Obtain shot position
        var shotX = Math.round(event.clientX);
        var shotY = Math.round(event.clientY);
        var spriteX = Math.round(snakeLiving.x);
        var spriteY = Math.round(snakeLiving.y);

        //Computes the X and Y distance using the absolute value
        var distX = Math.abs(shotX - spriteX);
        var distY = Math.abs(shotY - spriteY);

        //If you hit the body or head then its a hit but the wings is a miss.
        if (distX < 30 && distY < 55) {
            //If the snake is hit, remove the sprite 
            stage.removeChild(snakeLiving);
            // Add 50 Points for the kill
            score += 50;
            console.log("Hit!");
            // Update the score text
            scoreText.text = "Kills: " + score.toString();

            // Increase speed
            ghostYSpeed *= 1.25;
            ghostXSpeed *= 1.3;

            // Create a new enemy
            var timeToCreate = Math.floor((Math.random() * 3500) + 1);
            setTimeout(createGhost, timeToCreate);

        } else {
            // Miss
            
            // Decrease the score by 10
            score -= 10;
            console.log("You Missed!");
            // Update score text
            scoreText.text = "Kills: " + score.toString();
        }
    }

})(); 
