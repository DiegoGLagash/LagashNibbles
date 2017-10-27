import {Direction} from "./Direction";
import {Pos} from "./Pos";

export class Vector extends Pos {
    public direction: Direction;

    constructor() {
        super();
    }

    public moveNew(): Pos {
        return this.moveNewDirection(this.direction);
    }

    public isOpositeDirection(direction: Direction): boolean {
        if (this.direction === Direction.Up) {
            return direction === Direction.Down;
        } else if (this.direction === Direction.Right) {
            return direction === Direction.Left;
        } else if (this.direction === Direction.Down) {
            return direction === Direction.Up;
        } else if (this.direction === Direction.Left) {
            return direction === Direction.Right;
        }
    }
    public moveNewDirection(direction: Direction): Pos {
        const pos = new Pos();

        pos.x = this.x;
        pos.y = this.y;

        if (direction === Direction.Up) {
            pos.y -= 1;
        } else if (direction === Direction.Right) {
            pos.x += 1;
        } else if (direction === Direction.Down) {
            pos.y += 1;
        } else if (direction === Direction.Left) {
            pos.x -= 1;
        }

        return pos;
    }

    public rotateClockwise(): Pos {
        return this.moveNewDirection(this.getClockwiseDirection());
    }

    public getClockwiseDirection(): Direction {
        switch (this.direction) {
            case Direction.Up:
                return Direction.Right;
            case Direction.Right:
                return Direction.Down;
            case Direction.Down:
                return Direction.Left;
            case Direction.Left:
                return Direction.Up;
        }
    }
}
