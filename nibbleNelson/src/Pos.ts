import {Space} from "./Space";

export class Pos {
    public x: number;
    public y: number;

    public isValid(): boolean {
        return (this.x >= 0) && (this.y >= 0);
    }

    public isValidInBounds(space: Space): boolean {
        return this.isValid() && (this.x < space.topX) && (this.y < space.topY);
    }
}
