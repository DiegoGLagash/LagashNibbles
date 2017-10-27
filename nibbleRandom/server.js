const express = require('express');
const bodyParser = require('body-parser');
const logger = require("morgan");
const errorHandler = require("errorhandler");

const app = express();

app.use(bodyParser.json());

app.use(logger("dev"));

//allow CORS calls
app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

		// intercept OPTIONS method
		if ('OPTIONS' == req.method) {
			res.send(200);
		}
		else {
			next();
		}
});

//error handling
app.use(errorHandler());

let dirArray = ["Up", "Right", "Left", "Down"];

app.post('/nextMove', (req, res) => {
	let pos = {
		x: req.body.snake.x,
		y: req.body.snake.y
	};

	if(req.body.snake.ticks % 4 == 0) {
		dirArray = shuffle(dirArray);		
	}
	//Busco nueva dirección 
	for(let i = 0; i < 4; i++) {
		let newDir = dirArray[i];

		//No puede ser la dirección opuesta
		if(req.body.snake.direction == "Up" && newDir == "Down") {
			continue;
		} else if(req.body.snake.direction == "Right" && newDir == "Left") {
			continue;
		} else if(req.body.snake.direction == "Down" && newDir == "Up") {
			continue;
		} else if(req.body.snake.direction == "Left" && newDir == "Right") {
			continue;
		}

		let pos = {
			x: req.body.snake.x,
			y: req.body.snake.y
		};
		if(newDir == "Up") {
			pos.y = req.body.snake.y - 1;
		} else if(newDir == "Right") {
			pos.x = req.body.snake.x + 1;
		} else if(newDir == "Down") {
			pos.y = req.body.snake.y + 1;
		} else if(newDir == "Left") {
			pos.x = req.body.snake.x - 1;
		}
		if((pos.x >= 0) && 
			(pos.y >= 0) &&
			(pos.x < req.body.space.topX) && 
			(pos.y < req.body.space.topY) &&
			(req.body.space.map[pos.x][pos.y] == 0)) {
				res.json({ direction: newDir });
				return;
		}
	}
	res.json({ direction: req.body.snake.direction });
});

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function shuffle(array){
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

const httpPort = normalizePort(process.env.PORT || 9000);

app.listen(httpPort, () => {
 console.log("Listening on " + httpPort);
});
