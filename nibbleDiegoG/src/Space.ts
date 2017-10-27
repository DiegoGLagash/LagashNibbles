import {Direction} from './Direction';
import {Pos} from './Pos';
import {Vector} from "./Vector";
import {Snake} from "./Snake";

export class Space {
    topX: number;
    topY: number;
    
    map: number[][];
    EMPTY: number = 0;

    constructor(x: number, y:number) {
        this.topX = x;
        this.topY = y;
        this.map = [];
        for(let i:number = 0; i < x; i++) {
            this.map[i] = [];
            for(let j: number = 0; j< y; j++) {
                this.map[i][j] = this.EMPTY;
            }
        }
    }

    fillEmptySpace(fill: Array<Array<number>>, curPos: Pos) : number {
        if(!curPos.isValidInBounds(this))
            return 0;
        if(fill[curPos.x][curPos.y] == 1)
            return 0;
        if(this.map[curPos.x][curPos.y] != 0)
            return 0;
        fill[curPos.x][curPos.y] = 1;
        let area = 1;
        area += this.fillEmptySpace(fill, curPos.moveUpNew());
        area += this.fillEmptySpace(fill, curPos.moveDownNew());
        area += this.fillEmptySpace(fill, curPos.moveLeftNew());
        area += this.fillEmptySpace(fill, curPos.moveRightNew());
        return area;
    }

    areaEmptyFrom(curPos: Pos) : number {
        let fill = [];
        for(let i:number = 0; i < this.topX; i++) {
            fill[i] = [];
            for(let j: number = 0; j < this.topY; j++) {
                fill[i][j] = this.EMPTY;
            }
        }
        return this.fillEmptySpace(fill, curPos);
    }

    fillDangerSpace(fill: Array<Array<number>>, snakeId: number, curPos: Pos, curDir: Direction, prob: number) {
        if(prob < 0.1) return;
        if(!curPos.isValidInBounds(this))
            return;
        if(fill[curPos.x][curPos.y] != 0)
            return;
        if(this.map[curPos.x][curPos.y] != 0 && this.map[curPos.x][curPos.y] != snakeId)
            return;

        fill[curPos.x][curPos.y] = prob;

        if(!Vector.isOpositeDirection(curDir, Direction.Up)) {
            this.fillDangerSpace(fill, snakeId, curPos.moveUpNew(), Direction.Up, prob/3);
        }
        if(!Vector.isOpositeDirection(curDir, Direction.Down)) {
            this.fillDangerSpace(fill, snakeId, curPos.moveDownNew(), Direction.Down, prob/3);
        }
        if(!Vector.isOpositeDirection(curDir, Direction.Left)) {
            this.fillDangerSpace(fill, snakeId, curPos.moveLeftNew(), Direction.Left, prob/3);
        }
        if(!Vector.isOpositeDirection(curDir, Direction.Right)) {
            this.fillDangerSpace(fill, snakeId, curPos.moveRightNew(), Direction.Right, prob/3);
        }
    }

    calculateDangerSpace(snakes: Array<Snake>, snakeId: number) : Array<Array<number>> {
        let fill = [];
        for(let i:number = 0; i < this.topX; i++) {
            fill[i] = [];
            for(let j: number = 0; j < this.topY; j++) {
                fill[i][j] = this.EMPTY;
            }
        }
        
        for(let s = 0; s < snakes.length; s++){
            let snake = snakes[s];
            if(snake.id == snakeId)
                continue;
            let pos = new Pos();
            pos.x = snake.x;
            pos.y = snake.y;
            this.fillDangerSpace(fill, snake.id, pos, snake.direction, 1);
        }

        // Marca alrededor de cada snake como zona peligrosa
        for(let i:number = 0; i < this.topX; i++) {
            for(let j: number = 0; j < this.topY; j++) {
                if(this.map[i][j] != 0){
                    if(fill[i][j] == 0)
                        fill[i][j] == 1;

                    if(((j+1)<this.topY) && fill[i][j+1] == 0)
                         fill[i][j+1] == 1/3;
                    if(((j-1)>=0) && fill[i][j-1] == 0)
                        fill[i][j-1] == 1/3;

                    if(((j-1)>=0) && ((i+1)<this.topX) && fill[i+1][j-1] == 0)
                        fill[i+1][j-1] == 1/3;
                    if(((j+1)<this.topY) && ((i-1)>=0) && fill[i-1][j+1] == 0)
                        fill[i-1][j+1] == 1/3;
                    if(((j+1)<this.topY) && ((i+1)<this.topX) && fill[i+1][j+1] == 0)
                        fill[i+1][j+1] == 1/3;
                    if(((j-1)>=0) && ((i-1)>=0) && fill[i-1][j-1] == 0)
                        fill[i-1][j-1] == 1/3;

                    if(((i+1)<this.topX) && fill[i+1][j] == 0)
                        fill[i+1][j] == 1/3;
                    if(((i-1)>=0) && fill[i-1][j] == 0)
                        fill[i-1][j] == 1/3;
                }
            }
        }
        // Marca los bordes como zonas peligrosas
        for(let i:number = 0; i < this.topX; i++) {
            if(fill[i][0] == 0)
                fill[i][0] = 1/3;
            if(fill[i][1] == 0)
                fill[i][1] = 1/3/3;

            if(fill[i][this.topY-1] == 0)
                fill[i][this.topY-1] = 1/3;
            if(fill[i][this.topY-2] == 0)
                fill[i][this.topY-2] = 1/3/3;
        }
        for(let j:number = 0; j < this.topY; j++) {
            if(fill[0][j] == 0)
                fill[0][j] = 1/3;
            if(fill[1][j] == 0)
                fill[1][j] = 1/3/3;

            if(fill[this.topX-1][j] == 0)
                fill[this.topX-1][j] = 1/3;
            if(fill[this.topX-2][j] == 0)
                fill[this.topX-2][j] = 1/3/3;
        }

        return fill;
    }
}