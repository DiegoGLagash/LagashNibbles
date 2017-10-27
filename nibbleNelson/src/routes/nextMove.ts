import { NextFunction, Request, Response, Router } from "express";
import { Direction } from "../Direction";
import { Pos } from "../Pos";
import { Snake, SnakeMemento } from "../Snake";
import { SnakeInfo } from "../SnakeInfo";
import { Space, SpaceMemento } from "../Space";
import { Vector } from "../Vector";
import { BaseRoute } from "./route";

export class NextMoveRoute extends BaseRoute {

  public static create(router: Router) {
    router.post("/nextMove", (req: Request, res: Response, next: NextFunction) => {
      new NextMoveRoute().postNextMove(req, res, next);
    });
  }

  private static snakeStates: { [key: number]: SnakeInfo } = {};

  constructor() {
    super();
  }

  public postNextMove(req: Request, res: Response, next: NextFunction) {

    const snake = this.createSnake(req.body.snake);

    const space = new Space(req.body.space.topX, req.body.space.topY);
    space.map = req.body.space.map;

    const snakes = new Array<Snake>();

    for (const snakeData of req.body.snakes) {
      if (+snakeData.id !== snake.id) {
        snakes.push(this.createSnake(snakeData));
      }
    }

    let newDirection = snake.direction;

    let snakeInfo: SnakeInfo;

    if (snake.trail.length === 0) {
      snakeInfo = new SnakeInfo();

      snakeInfo.initialPos = new Pos();
      snakeInfo.initialPos.x = snake.x;
      snakeInfo.initialPos.y = snake.y;
      snakeInfo.spin = true;

      NextMoveRoute.snakeStates[snake.id] = snakeInfo;
    } else {
      snakeInfo = NextMoveRoute.snakeStates[snake.id];
    }

    if (snake.trail.length <= 1 && snakeInfo.spin) {
      if (snake.x <= 1 || snake.x >= space.topX - 2 || snake.y <= 1 || snake.y >= space.topY - 2) {
        // no aplicar estrategia de girar si arranco muy cerca de los bordes
        newDirection = this.applyBacktrackingStrategy(snake, space, snakes);
        snakeInfo.spin = false;
      } else {
        // fast path/hack: primeros dos movimientos giro siempre
        newDirection = snake.getClockwiseDirection();
      }
    } else {
      if (snakeInfo.spin) {
        // si todavia estoy aplicando la estrategia de girar
        try {
          newDirection = this.spinningStrategy(snake, snakeInfo, space);
        } catch {
          // aborto la estrategia de girar y activo la de backtracking
          snakeInfo.spin = false;
          newDirection = this.applyBacktrackingStrategy(snake, space, snakes);
        }
      } else {
        newDirection = this.applyBacktrackingStrategy(snake, space, snakes);
      }
    }

    const dstring: string = Direction[newDirection];
    const payload = {
      direction: dstring,
    };

    this.json(req, res, payload);
  }

  private createSnake(snakeData: any): Snake {
    const direction: Direction = (Direction as any)[snakeData.direction];

    const snake = new Snake(+snakeData.id);

    snake.x = +snakeData.x;
    snake.y = +snakeData.y;
    snake.direction = direction;
    snake.ticks = +snakeData.ticks;
    snake.trail = snakeData.trail;

    return snake;
  }

  private getfallbackDirection(snake: Snake, space: Space): Direction {
    let pos = snake.moveNew();

    if (pos.isValidInBounds(space) && space.map[pos.x][pos.y] === space.EMPTY) {
      return snake.direction;
    } else {
      // busco nueva dirección clockwise para no chocarme
      for (let i: number = 1; i <= 4; i++) {
        const dir = Direction[Direction[i]];

        if (snake.isOpositeDirection(dir)) {
          continue;
        }

        pos = snake.moveNewDirection(dir);

        if (!pos.isValidInBounds(space)) {
          continue;
        }

        if (space.map[pos.x][pos.y] !== space.EMPTY) {
          continue;
        }

        return dir;
      }
    }
  }

  /*
   * Estrategia defensiva que gira en circulos
   */
  private spinningStrategy(snake: Snake, snakeInfo: SnakeInfo, space: Space): Direction {
    let sideA: number;
    let sideB: number;

    // calculo distancia al punto de origen
    const deltaX = Math.abs(snakeInfo.initialPos.x - snake.x);
    const deltaY = Math.abs(snakeInfo.initialPos.y - snake.y);

    if (snake.direction === Direction.Down || snake.direction === Direction.Up) {
      sideA = deltaY;
      sideB = deltaX;
    } else {
      sideA = deltaX;
      sideB = deltaY;
    }

    if (sideA >= sideB) {
      // si el lado 'A' es mayor al 'B' entonces es momento de girar
      const pos = snake.rotateClockwise();

      if (pos.isValidInBounds(space) && space.map[pos.x][pos.y] === space.EMPTY) {
        const dir = snake.getClockwiseDirection();

        return dir;
      } else {
        return this.getfallbackDirection(snake, space);
      }
    } else {
      // caso contrario seguir para adelante
      const newPos = snake.moveNew();

      if (newPos.isValidInBounds(space) && space.map[newPos.x][newPos.y] === space.EMPTY) {
        return snake.direction;
      } else {
        // si no puedo seguir hacia adelante, abortar esta estrategia
        throw new Error("Can't spin");
      }
    }
  }

  private applyBacktrackingStrategy(snake: Snake, space: Space, snakes: Snake[]): Direction {
    const trail = new Array<{ pos: Pos, dir: Direction }>();
    const pathLength = 25;

    try {
      const result = this.backtrackingStrategy(
        snake,
        new Array<SnakeMemento>(),
        snakes.map(other => ({ snake: other, states: new Array<SnakeMemento>() })),
        space,
        new Array<SpaceMemento>(),
        pathLength,
        trail);

      if (result) {
        return trail[0].dir;
      } else {
        return this.getfallbackDirection(snake, space);
      }
    } catch {
      if (trail.length > 0) {
        return trail[0].dir;
      } else {
        return this.getfallbackDirection(snake, space);
      }
    }
  }

  /*
   * Estrategia que intenta encontrar un camino de longitud @pathLength
   * simulando el movimiento de los demás jugadores con una estrategia simple.
   * Se aplica un algoritmo de backtracking para explorar el espacio de la
   * solución, tratando de encontrar un camino que garantice sobrevivir una
   * cierta cantidad de movimientos adicionales (@pathLength).
   * El camino (total o parcial) encontrado se devuelve en el último parámetro
   * @trail.
   */
  private backtrackingStrategy(
    snake: Snake,
    states: SnakeMemento[],
    otherSnakes: Array<{ snake: Snake, states: SnakeMemento[] }>,
    space: Space,
    spaceState: SpaceMemento[],
    pathLength: number,
    trail: Array<{ pos: Pos, dir: Direction }>): boolean {

    // condición de salida de la recursividad
    if (pathLength === 0) {
      return true;
    }

    let i: number = 1;

    for (i; i <= 4; i++) {
      // busco un movimiento válido para mi snake
      const dir = Direction[Direction[i]];

      if (snake.isOpositeDirection(dir)) {
        continue;
      }

      const pos = snake.moveNewDirection(dir);

      if (!pos.isValidInBounds(space)) {
        continue;
      }

      if (space.map[pos.x][pos.y] !== space.EMPTY) {
        continue;
      }

      // es un movimiento válido, tomo un snapshot del estado actual del juego
      // guardo el estado de mi snake
      states.push(snake.createMemento());

      // guardo el estado de los otros jugadores
      otherSnakes.forEach(other => {
        other.states.push(other.snake.createMemento());
      });

      // guardo el estado del tablero
      spaceState.push(space.createMemento());

      // aplico el movimiento
      snake.x = pos.x;
      snake.y = pos.y;
      snake.direction = dir;
      space.map[pos.x][pos.y] = snake.id;

      try {
        // busco un movimiento válido para los otros jugadores (estrategia simple)
        this.moveOthers(otherSnakes, space);

        // guardo el movimiento candidato
        trail.push({ pos, dir });

        // continuo explorando el espacio de la solución, ahora con pathLength - 1
        if (this.backtrackingStrategy(snake, states, otherSnakes, space, spaceState, pathLength - 1, trail)) {
          // si llega hasta aca, logré encontrar una solución,
          // salgo del loop y empiezo a rebobinar la pila de llamadas
          break;
        }

        // si llega hasta acá entonces este movimiento no era válido
        // devuelvo el juego a su estado anterior e intento nuevamente
        // en la siguiente iteración del loop
        snake.restoreState(states.pop());

        otherSnakes.forEach(other => {
          other.snake.restoreState(other.states.pop());
        });

        space.restoreState(spaceState.pop());

        // remuevo este movimiento candidato de la lista de resultados
        trail.pop();
      } catch (error) {
        // *** No Usado ***
        // otro jugador chocó, aborto la estrategia
        // la solución encontrada hasta el momento queda en @trail
        snake.restoreState(states.pop());
        otherSnakes.forEach(other => {
          other.snake.restoreState(other.states.pop());
        });
        space.restoreState(spaceState.pop());

        throw error;
        // *** No Usado ***
      }
    }

    if (i === 5) {
      // no se encontró una solución con el estado actual
      return false;
    } else {
      // se encontró una solución
      return true;
    }
  }

  private moveOthers(
    otherSnakes: Array<{ snake: Snake, states: SnakeMemento[] }>,
    space: Space) {

    for (const snakeState of otherSnakes) {
      const snake = snakeState.snake;

      let pos = snake.moveNew();

      if (pos.isValidInBounds(space) && space.map[pos.x][pos.y] === space.EMPTY) {
        snake.x = pos.x;
        snake.y = pos.y;
        space.map[pos.x][pos.y] = snake.id;
      } else {
        let i: number = 1;

        for (i; i <= 4; i++) {
          const dir = Direction[Direction[i]];

          if (snake.isOpositeDirection(dir)) {
            continue;
          }

          pos = snake.moveNewDirection(dir);

          if (!pos.isValidInBounds(space)) {
            continue;
          }

          if (space.map[pos.x][pos.y] !== space.EMPTY) {
            continue;
          }

          snake.x = pos.x;
          snake.y = pos.y;
          snake.direction = dir;
          space.map[pos.x][pos.y] = snake.id;

          break;
        }
      }

      // if (i === 5) {
      //   // este jugador podría chocar antes que yo, aborto la búsqueda
      //   throw new Error("Other snake died!");
      // }
    }
  }
}
