
class Vector extends Pos {
    direction: Direction;

    constructor() {
        super();
    }

    move() {
        let pos = this.moveNew();
        this.x = pos.x;
        this.y = pos.y;
    }

    moveNew() : Pos {
        return this.moveNewDirection(this.direction);
    }

    moveNewDirection(direction: Direction) : Pos {
        let pos = new Pos();
        pos.x = this.x;
        pos.y = this.y;
        if(direction == Direction.Up) {
            pos.y = this.y-1;
        } else if(direction == Direction.Right) {
            pos.x = this.x+1;
        } else if(direction == Direction.Down) {
            pos.y = this.y+1;
        } else if(direction == Direction.Left) {
            pos.x = this.x-1;
        }
        return pos;
    }

}
