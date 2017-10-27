import {Pos} from './Pos';
import {Direction} from './Direction';

export class Vector extends Pos {
    direction: Direction;

    constructor() {
        super();
    }

    moveNew() : Vector {
        return this.moveNewDirection(this.direction);
    }

    static isOpositeDirection(adirection: Direction, direction: Direction) : boolean {
        if(adirection === Direction.Up) {
            return direction === Direction.Down;
        } else if(adirection === Direction.Right) {
            return direction === Direction.Left;
        } else if(adirection === Direction.Down) {
            return direction === Direction.Up;
        } else if(adirection === Direction.Left) {
            return direction === Direction.Right;
        }
    }

    isOpositeDirection(direction: Direction) : boolean {
        return Vector.isOpositeDirection(this.direction, direction);
    }

    moveNewDirection(direction: Direction) : Vector {
        let newVec = new Vector();
        newVec.x = this.x;
        newVec.y = this.y;
        if(direction === Direction.Up) {
            newVec.moveUp();
        } else if(direction === Direction.Right) {
            newVec.moveRight();
        } else if(direction === Direction.Down) {
            newVec.moveDown();
        } else if(direction === Direction.Left) {
            newVec.moveLeft();
        }
        newVec.direction = direction;
        return newVec;
    }

    createFromPos(pos: Pos) : Vector {
        let newVec = new Vector();
        newVec.x = pos.x;
        newVec.y = pos.y;
        return newVec;
    }
}
