import {Space} from './Space';

export class Pos {
    x: number;
    y: number;

    constructor() {
    }

    isValid() : boolean
    {
        return (this.x >= 0) && (this.y >= 0);
    }

    isValidInBounds(space: Space) : boolean
    {
        return this.isValid() && (this.x < space.topX) && (this.y < space.topY);
    }

    moveUp() {
        this.y--;
    }

    moveUpNew() : Pos {
        let p = this.clone();
        p.moveUp();
        return p;
    }

    moveDown() {
        this.y++;
    }

    moveDownNew() : Pos {
        let p = this.clone();
        p.moveDown();
        return p;
    }

    moveRight() {
        this.x++
    }

    moveRightNew() : Pos {
        let p = this.clone();
        p.moveRight();
        return p;
    }

    moveLeft() {
        this.x--;
    }

    moveLeftNew() {
        let p = this.clone();
        p.moveLeft();
        return p;
    }

    clone() {
        let pos = new Pos();
        pos.x = this.x;
        pos.y = this.y;
        return pos;
    }
}