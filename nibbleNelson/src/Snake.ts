import { Direction } from "./Direction";
import { Space } from "./Space";
import { Vector } from "./Vector";

export class Snake extends Vector {
    public id: number;
    public ticks: number;
    public trail: Vector[];
    public length: number;

    constructor(id: number) {
        super();
        this.trail = new Array<Vector>();
        this.id = id;
    }

    public createMemento(): SnakeMemento {
        return new SnakeMemento(this.x, this.y, this.direction);
    }

    public restoreState(memento: SnakeMemento) {
        this.x = memento.posX;
        this.y = memento.posY;
        this.direction = memento.direction;
    }
}

export class SnakeMemento {

    public posX: number;

    public posY: number;

    public direction: Direction;

    constructor(posX: number, posY: number, direction: Direction) {
        this.posX = posX;
        this.posY = posY;
        this.direction = direction;
    }
}
