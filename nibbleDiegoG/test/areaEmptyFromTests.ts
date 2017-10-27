import { Space } from '../src/Space';
import { Pos } from '../src/Pos';
import { expect } from 'chai';
import 'mocha';

describe('create a Space', () => {
  it('should create a 10x10 space', () => {
    const space = new Space(10, 10);
    expect(space.topX).to.equal(10);
    expect(space.topY).to.equal(10);
  });
});

describe('calculate a free area with obstacles', () => {
  it('in a 10x10 space, single dot top left, it should return 98', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 4, pos.y = 3;
    space.map[4][4] = 1;
    space.map[0][0] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(98);
  });
  it('in a 10x10 space, two dots top left, it should return 97', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 4, pos.y = 3;
    space.map[4][4] = 1;
    space.map[0][0] = 1;
    space.map[1][0] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(97);
  });
  it('in a 10x10 space, trhree dots top left, it should return 95', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 4, pos.y = 3;
    space.map[4][4] = 1;
    space.map[0][1] = 1;
    space.map[1][1] = 1;
    space.map[1][0] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(95);
  });
  it('in a 10x10 space, trhree dots top left, trhree dots bottom right, it should return 91', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 4, pos.y = 3;
    space.map[4][4] = 1;
    space.map[0][1] = 1;
    space.map[1][1] = 1;
    space.map[1][0] = 1;
    space.map[8][8] = 1;
    space.map[8][9] = 1;
    space.map[9][8] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(91);
  });
  it('in a 5x5 space, one straight line at center, it should return 9', () => {
    const space = new Space(5, 5);
    let pos = new Pos();
    pos.x = 4, pos.y = 3;
    space.map[4][4] = 1;
    space.map[0][2] = 1;
    space.map[1][2] = 1;
    space.map[2][2] = 1;
    space.map[3][2] = 1;
    space.map[4][2] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(9);
  });
  it('in a 5x5 space, two straight lines at center, it should return 3', () => {
    const space = new Space(5, 5);
    let pos = new Pos();
    pos.x = 4, pos.y = 3;
    space.map[4][4] = 1;

    space.map[0][2] = 1;
    space.map[1][2] = 1;
    space.map[2][2] = 1;
    space.map[3][2] = 1;
    space.map[4][2] = 1;

    space.map[2][0] = 1;
    space.map[2][1] = 1;
    space.map[2][2] = 1;
    space.map[2][3] = 1;
    space.map[2][4] = 1;

    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(3);
  });
});

describe('calculate a free area', () => {
  it('in a 3x3 space, it should return 8', () => {
    const space = new Space(3, 3);
    let pos = new Pos();
    pos.x = 1, pos.y = 1;
    space.map[1][0] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(8);
  });

  it('in a 5x5 space, it should return 24', () => {
    const space = new Space(5, 5);
    let pos = new Pos();
    pos.x = 2, pos.y = 2;
    space.map[2][1] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(24);
  });
  it('in a 10x10 space, positioned in center, it should return 99', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 4, pos.y = 4;
    space.map[4][3] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(99);
  });
  it('in a 10x10 space, positioned out of center, it should return 99', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 1, pos.y = 1;
    space.map[1][0] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(99);
  });
  it('in a 10x10 space, positioned bottom border, it should return 99', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 4, pos.y = 9;
    space.map[4][8] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(99);
  });
  it('in a 10x10 space, positioned left border, it should return 99', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 0, pos.y = 4;
    space.map[0][3] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(99);
  });
  it('in a 10x10 space, positioned right border, it should return 99', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 9, pos.y = 4;
    space.map[9][3] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(99);
  });
  it('in a 10x10 space, positioned top border, it should return 99', () => {
    const space = new Space(10, 10);
    let pos = new Pos();
    pos.x = 4, pos.y = 0;
    space.map[4][1] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(99);
  });
  it('in a 10x5 space, it should return 49', () => {
    const space = new Space(10, 5);
    let pos = new Pos();
    pos.x = 4, pos.y = 2;
    space.map[3][2] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(49);
  });
  it('in a 5x10 space, it should return 49', () => {
    const space = new Space(10, 5);
    let pos = new Pos();
    pos.x = 4, pos.y = 2;
    space.map[3][2] = 1;
    let area = space.areaEmptyFrom(pos);
    expect(area).to.equal(49);
  });
});
