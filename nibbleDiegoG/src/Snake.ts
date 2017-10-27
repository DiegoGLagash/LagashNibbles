import {Vector} from './Vector';
import {Space} from './Space';
import {Direction} from './Direction';

export class Snake extends Vector {
    id: number;
    ticks: number;
    trail: Array<Vector>;
    length: number;

    constructor(id: number) {
        super();
        this.trail = new Array<Vector>();
        this.id = id;
    }
}
