import * as jQuery from 'jquery';
import * as url from 'url';
import {ISnakeBehavior} from './ISnakeBehavior';
import {Space} from './Space';
import {Snake} from './Snake';
import {Direction} from './Direction';

export class HttpBehavior implements ISnakeBehavior {
    endpoint: string;

    constructor(endpoint: string) {
        let purl = url.parse(endpoint);
        this.endpoint = endpoint;
    }

    changeDirection(snake: Snake, space: Space, snakes: Array<Snake>) : Promise<Direction> {
        return new Promise((resolve,reject) => {
            let payloadSnake: object = {
                "id": snake.id,
                "x": snake.x,
                "y": snake.y,
                "direction": <string>Direction[snake.direction],
                "length": snake.length,
                "ticks": snake.ticks,
                "trail": snake.trail,
            };
            let payloadSnakes: Array<object> = [];
            snakes.forEach( function( s ) {
                payloadSnakes.push({
                    "id": s.id,
                    "x": s.x,
                    "y": s.y,
                    "direction": <string>Direction[s.direction],
                    "length": s.length,
                    "ticks": s.ticks,
                    "trail": s.trail,
                });
            } );
            let payload: object = {
                "snake": payloadSnake,
                "space": {
                    "topX": space.topX,
                    "topY": space.topY,
                    "map": space.map,
                    "step": space.REDUCE_STEP
                },
                "snakes": payloadSnakes
            }
            jQuery.ajax({
                url: this.endpoint,
                data: JSON.stringify(payload),
                dataType: 'json',
                contentType: 'application/json',
                type: 'POST',
                timeout: 2000,
                success: function (result) {
                    let newDir: Direction = (<any>Direction)[result.direction];
                    if (result.isOk === false) console.log(result);
                    return resolve(newDir);
                },
                error: function() {
                    return resolve(0);
                }
            });
        });
    }
}
