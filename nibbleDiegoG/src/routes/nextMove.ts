import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Direction } from "../Direction";
import { Pos } from "../Pos";
import { Vector } from "../Vector";
import { Snake } from "../Snake";
import { Space } from "../Space";


/**
 * /nextMove route
 *
 * @class User
 */
export class NextMoveRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {

    //add post route
    router.post("/nextMove", (req: Request, res: Response, next: NextFunction) => {
      new NextMoveRoute().postNextMove(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The home page route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public postNextMove(req: Request, res: Response, next: NextFunction) {
    
    let snake = new Snake(+req.body.snake.id);
    snake.x = +req.body.snake.x;
    snake.y = +req.body.snake.y;
    let direction: Direction = (<any>Direction)[req.body.snake.direction];
    snake.direction = direction;
    snake.ticks = +req.body.snake.ticks;
    snake.trail = req.body.snake.trail;
    let snakes = req.body.snakes;
    let topX = +req.body.space.topX;
    let topY = +req.body.space.topY;
    let space = new Space(topX, topY);
    space.map = req.body.space.map;

    let dangerSpace = space.calculateDangerSpace(snakes, snake.id);

    let newDirs = [];
    if(snake.x < (topX/2)) {
      newDirs.push( {
        direction: Direction.Right,
        pos: snake.moveRightNew(),
        val: 0, area: 0, rank: 0,
      });
      newDirs.push( {
        direction: Direction.Left,
        pos: snake.moveLeftNew(),
        val: 0, area: 0, rank: 0,
      });
    }else if(snake.x >= (topX/2)){
      newDirs.push( {
        direction: Direction.Left,
        pos: snake.moveLeftNew(),
        val: 0, area: 0, rank: 0,
      });
      newDirs.push( {
        direction: Direction.Right,
        pos: snake.moveRightNew(),
        val: 0, area: 0, rank: 0,
      });
    }

    if(snake.y < (topY/2)) { 
      newDirs.push( {
        direction: Direction.Down,
        pos: snake.moveDownNew(),
        val: 0, area: 0, rank: 0,
      });
      newDirs.push( {
        direction: Direction.Up,
        pos: snake.moveUpNew(),
        val: 0, area: 0, rank: 0,
      });
    }else if(snake.y >= (topY/2)){
      newDirs.push( {
        direction: Direction.Up,
        pos: snake.moveUpNew(),
        val: 0, area: 0, rank: 0,
      });
      newDirs.push( {
        direction: Direction.Down,
        pos: snake.moveDownNew(),
        val: 0, area: 0, rank: 0,
      });
    }        

    let newPos2 = [];
    for(let d in newDirs){
      let newDir = newDirs[d];
      if(Vector.isOpositeDirection(snake.direction, newDir.direction))
        continue;
      if(!newDir.pos.isValidInBounds(space))
        continue;
      if(space.map[newDir.pos.x][newDir.pos.y] != 0)
        continue;
      newDir.val = dangerSpace[newDir.pos.x][newDir.pos.y];
      newDir.area = 1 - (space.areaEmptyFrom(newDir.pos) / (space.topX * space.topY));
      newDir.rank = Math.sqrt(Math.pow(newDir.val, 2) + Math.pow(newDir.area, 2));
      newPos2.push(newDir);
    }

    let minDir = { rank: 1, direction: 1 };
    for(let d in newPos2){
      let newDir = newPos2[d];
      if(newDir.rank < minDir.rank) {
        minDir = newDir;
      }
    }

    let payload: Object = {
      direction: Direction[minDir.direction],
//      direction: minDir.direction,
    };
    
    //render json
    this.json(req, res, payload);
  }

  randomIntFromInterval(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
  }
  
}