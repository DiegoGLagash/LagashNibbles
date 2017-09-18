//import * as Enumerable from 'linq';
const Enumerable = require('linq');

import {Pos} from './Pos';
import {Vector} from './Vector';
import {Snake} from './Snake';
import {Space} from './Space';
import {ISnakeBehavior} from './ISnakeBehavior';
import {Direction} from './Direction';
import {SpaceArea} from './SpaceArea';

export class Nibbles {
    SPACE_X : number  = 30;
    
    SPACE_Y : number = 30;

    ticks : number = 0;

    space: Space;

    snakes: Array<Snake>;

    loser: Snake;

    loser2: Snake;

    hit: boolean;

    hitTarget: number;

    inUpdate: boolean;

    constructor(spacex: number, spacey: number) {
        this.SPACE_X = spacex;
        this.SPACE_Y = spacey;
    }

    shuffle<T>(array: Array<T>) : Array<T> {
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

    randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    clearSnakes() {
        this.snakes = new Array<Snake>();
    }

    addSnake(id: number, name:string, color: string, behavior: ISnakeBehavior) {
        if(this.snakes == null) {
            this.snakes = new Array<Snake>();
        }
        let snake = new Snake(id);
        if(name != null && name != ""){
            snake.name = name;
        }
        snake.color = color;
        snake.behavior = behavior;
        this.snakes.push(snake);
    }

    init() {
        // Reset space
        this.space = new Space(this.SPACE_X, this.SPACE_Y);

        // Divide areas en regiones, para que cada snake aparezca separada de otra
        let spaceAreas = new Array<SpaceArea>();
        let area = new SpaceArea(this.space.topX, this.space.topY);
        spaceAreas.push(area);
        for(let i = 2 ; i <= this.snakes.length; i++ ) {
            let listq = Enumerable.from(spaceAreas);
            area = listq.orderByDescending( t => { return t.x * t.y; } ).first();
            let areaIndex = spaceAreas.findIndex( (val: SpaceArea) => {
                return ((val.x * val.y) === (area.x * area.y));
            });
            spaceAreas.splice(areaIndex,1);

            let x = area.x;
            let y = area.y;
            if( x >= y ) {
                x = Math.floor(x / 2);
            }else if ( x < y ) {
                y = Math.floor(y / 2);
            }
            spaceAreas.push(new SpaceArea(x, y));
            spaceAreas.push(new SpaceArea(x, y));
        }

        // Transpone areas al space
        let curX = 0, curY = 0;
        for(let i = 0; i < spaceAreas.length; i++) {
            if( curX + spaceAreas[i].x > this.space.topX) {
                curX = 0;
                curY += spaceAreas[i-1].y;
            }else if( curY + spaceAreas[i].y > this.space.topY) {
                curY = 0;
                curX += spaceAreas[i-1].x;
            }
            let topX = curX + spaceAreas[i].x;
            let topY = curY + spaceAreas[i].y;

            // Setea las cordenadas en SpaceArea
            spaceAreas[i].spaceX = curX; 
            spaceAreas[i].spaceY = curY;
            spaceAreas[i].spaceTopX = topX; 
            spaceAreas[i].spaceTopY = topY;

            curX += spaceAreas[i].x;
        }

        // Reordeno el array para que cambie la posición de cada snake
        spaceAreas = this.shuffle(spaceAreas);
        
        // Ubica al snake dentro de las areas
        for(let i: number = 0; i < this.snakes.length; i++) {
            let snake = this.snakes[i];
            let spaceArea = spaceAreas[i];
            snake.x = this.randomIntFromInterval(spaceArea.spaceX+1, spaceArea.spaceTopX-1);
            snake.y = this.randomIntFromInterval(spaceArea.spaceY+1, spaceArea.spaceTopY-1);
            snake.direction = Direction[Direction[this.randomIntFromInterval(1,4)]];

            // Guardo la cabeza en el mapa
            this.space.map[snake.x][snake.y] = snake.id;            
        }

        // Reset execution flags
        this.loser = null;
        this.loser2 = null;
        this.hit = false;
    }

    update() {
        let debug: boolean = false;
        // Avaoid execution if already waiting answers
        if(this.inUpdate) {
            return;
        }
        this.inUpdate = true;
        let idx: number = 0;
        if(!this.hit) {
            this.ticks++;
            let directions: Array<Promise<Direction>> = new Array<Promise<Direction>>();

            let newList = this.shuffle(this.snakes);
            for(let i: number = 0; i < newList.length; i++) {
                let snake = newList[i];
                snake.ticks = this.ticks;
                directions.push(snake.behavior.changeDirection(snake, this.space, this.snakes));
            }
            
            Promise.all(directions)
                .then((res) => {
                    for(let i: number = 0; i < newList.length; i++) {
                        let snake = newList[i];
                        let newDir: Direction = res[i];
                        
                        // If opposite direction, keep same
                        if(!snake.isOpositeDirection(newDir)) {
                            snake.changeDirection(newDir);
                        }
                        if(snake.willHitNextStep(this.space)) {
                            this.loser = snake;
                            idx = snake.willHitNextStepInfo(this.space);
                            this.hit = true;
                            this.hitTarget = idx;
                            if(idx !== -1 && idx !== this.loser.id) {
                                let newPos = this.loser.moveNewDirection(this.loser.direction);
                                let otherHit = this.snakes.find( (s) => { return s.id === idx; });
                                if(otherHit.x === newPos.x &&
                                   otherHit.y === newPos.y) {
                                    this.loser2 = otherHit;
                                }
                            }
                            break;
                        }
                        snake.step();
                        this.space.map[snake.x][snake.y] = snake.id;
                        if(this.ticks % this.space.REDUCE_STEP == 0) {
                            let initial = snake.getTailPosition();
                            snake.reduceLength(1);
                            this.space.map[initial.x][initial.y] = this.space.EMPTY;
                        }
                    }
                    this.inUpdate = false;
                });
        }
    }
}