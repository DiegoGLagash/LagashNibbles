
export class Space {
    public topX: number;
    public topY: number;
    public map: number[][];
    public EMPTY: number = 0;

    constructor(x: number, y: number) {
        this.topX = x;
        this.topY = y;
        this.map = [];
        for (let i: number = 0; i < x; i++) {
            this.map[i] = [];
            for (let j: number = 0; j < y; j++) {
                this.map[i][j] = this.EMPTY;
            }
        }
    }

    public clone(): Space {
        const clone = new Space(this.topX, this.topY);

        for (let i = 0; i < this.topX; i++) {
            for (let j = 0; j < this.topY; j++) {
                clone.map[i][j] = this.map[i][j];
            }
        }

        return clone;
    }

    public createMemento(): SpaceMemento {
        const mapState: number[][] = new Array<number[]>();

        for (let i = 0; i < this.map.length; i++) {
            mapState.push(new Array<number>());

            for (let j = 0; j < this.map[i].length; j++) {
                mapState[i].push(this.map[i][j]);
            }
        }

        return new SpaceMemento(mapState);
    }

    public restoreState(memento: SpaceMemento) {
        for (let i = 0; i < memento.map.length; i++) {
            for (let j = 0; j < memento.map[i].length; j++) {
                this.map[i][j] = memento.map[i][j];
            }
        }
    }
}

export class SpaceMemento {
    public map: number[][];

    constructor(map: number[][]) {
        this.map = map;
    }
}
