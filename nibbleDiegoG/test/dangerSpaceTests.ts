import { Direction } from '../src/Direction';
import { Space } from '../src/Space';
import { Pos } from '../src/Pos';
import {Snake} from "../src/Snake";
import { expect } from 'chai';
import 'mocha';

describe('calculate danger space', () => {
  it('in a 5x5 space, single snake up', () => {
    const space = new Space(5, 5);
    space.map[2][2] = 1;

    let snake = new Snake(1);
    snake.direction = Direction.Up;
    snake.x = 2;
    snake.y = 2;

    let danger = space.calculateDangerSpace(new Array<Snake>(snake),2);
    expect(danger[2][2]).to.equal(1);
    expect(danger[1][2]).to.equal(1/3);
    expect(danger[2][1]).to.equal(1/3);
    expect(danger[3][2]).to.equal(1/3);
  });

  it('in a 5x5 space, single snake corner up', () => {
    const space = new Space(5, 5);
    space.map[0][0] = 1;

    let snake = new Snake(1);
    snake.direction = Direction.Down;
    snake.x = 0;
    snake.y = 0;

    let danger = space.calculateDangerSpace(new Array<Snake>(snake),2);
    expect(danger[0][0]).to.equal(1);
    expect(danger[0][1]).to.equal(1/3);
    expect(danger[1][0]).to.equal(1/3);
    expect(danger[1][1]).to.equal(1/3/3);
  });
  
  it('in a 5x5 space, two snakes up/down', () => {
    const space = new Space(5, 5);
    space.map[0][0] = 1;
    space.map[4][4] = 2;

    let snake1 = new Snake(1);
    snake1.direction = Direction.Down;
    snake1.x = 0;
    snake1.y = 0;

    let snake2 = new Snake(2);
    snake2.direction = Direction.Up;
    snake2.x = 4;
    snake2.y = 4;

    let danger = space.calculateDangerSpace(new Array<Snake>(snake1, snake2),3);
    expect(danger[0][0]).to.equal(1);
    expect(danger[0][1]).to.equal(1/3);
    expect(danger[1][0]).to.equal(1/3);
    expect(danger[1][1]).to.equal(1/3/3);

    expect(danger[4][4]).to.equal(1);
    expect(danger[4][3]).to.equal(1/3);
    expect(danger[3][4]).to.equal(1/3);
    expect(danger[3][3]).to.equal(1/3/3);
  });

  it('in a 10x10 space, two snakes up/down', () => {
    const space = new Space(10, 10);
    space.map[0][0] = 1;
    space.map[9][9] = 2;

    let snake1 = new Snake(1);
    snake1.direction = Direction.Down;
    snake1.x = 0;
    snake1.y = 0;

    let snake2 = new Snake(2);
    snake2.direction = Direction.Up;
    snake2.x = 9;
    snake2.y = 9;

    let danger = space.calculateDangerSpace(new Array<Snake>(snake1, snake2),3);
    expect(danger[0][0]).to.equal(1);
    expect(danger[0][1]).to.equal(1/3);
    expect(danger[1][0]).to.equal(1/3);
    expect(danger[1][1]).to.equal(1/3/3);

    expect(danger[9][9]).to.equal(1);
    expect(danger[9][8]).to.equal(1/3);
    expect(danger[8][9]).to.equal(1/3);
    expect(danger[8][8]).to.equal(1/3/3);
  });
});

