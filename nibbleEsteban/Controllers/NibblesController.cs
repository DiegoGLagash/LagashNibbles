using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Nibbles.Models;

namespace Nibbles.Controllers
{
    public class NibblesController : Controller
    {
        private Snake Snake { get; set; }
        private Space Space { get; set; }
        private List<Snake> Snakes { get; set; }

        private int AvailableMovesUp { get; set; }
        private int AvailableMovesDown { get; set; }
        private int AvailableMovesLeft { get; set; }
        private int AvailableMovesRight { get; set; }

        private bool LockingWayUp { get; set; }
        private bool LockingWayDown { get; set; }
        private bool LockingWayLeft { get; set; }
        private bool LockingWayRight { get; set; }

        // POST api/values
        [HttpPost("{Request}")]
        [Route("/NextMove")]
        public async Task<Response> MoveNext([FromBody] Request request)
        {
            Snake = request.Snake;
            Space = request.Space;
            Snakes = request.Snakes;

            if (string.IsNullOrEmpty(request.Snake.Direction))
            {
                if (Snake.X > 0 && Snake.Y > 0 && Snake.X > Space.TopX - 1 && Snake.Y > Space.TopY - 1)
                    return new Response() { Direction = Direction.Up.ToString() };
                if (Snake.X == 0)
                    return new Response() { Direction = Direction.Right.ToString() };
                if (Snake.Y == 0)
                    return new Response() { Direction = Direction.Down.ToString() };
                if (Snake.X == Space.TopX - 1)
                    return new Response() { Direction = Direction.Left.ToString() };
                if (Snake.Y == Space.TopY - 1)
                    return new Response() { Direction = Direction.Up.ToString() };
            }

            Snake.Direccion = (Direction)Enum.Parse(typeof(Direction), request.Snake.Direction);

            var tasks = new List<Task>
            {
                Task.Run(() => VerifyDirectionUp()),
                Task.Run(() => VerifyDirectionLeft()),
                Task.Run(() => VerifyDirectionDown()),
                Task.Run(() => VerifyDirectionRight())
            };

            await Task.WhenAll(tasks);


            if (Snake.Direccion == Direction.Down && AvailableMovesDown > 1 && !LockingWayDown)
                return new Response() { Direction = Direction.Down.ToString() };
            if (Snake.Direccion == Direction.Left && AvailableMovesLeft > 1 && !LockingWayLeft)
                return new Response() { Direction = Direction.Left.ToString() };
            if (Snake.Direccion == Direction.Up && AvailableMovesUp > 1 && !LockingWayUp)
                return new Response() { Direction = Direction.Up.ToString() };
            if (Snake.Direccion == Direction.Right && AvailableMovesRight > 1 && !LockingWayRight)
                return new Response() { Direction = Direction.Right.ToString() };

            return new Response() { Direction = GetNewDirection().ToString() };
        }

        private Direction GetNewDirection()
        {
            var newDirection = Snake.Direccion;

            if (!Snake.IsOpositeDirection(Direction.Down) && IsMaxValue(AvailableMovesDown, AvailableMovesLeft, AvailableMovesUp, AvailableMovesRight))
                newDirection = Direction.Down;

            if (!Snake.IsOpositeDirection(Direction.Left) && IsMaxValue(AvailableMovesLeft, AvailableMovesDown, AvailableMovesUp, AvailableMovesRight))
                newDirection = Direction.Left;

            if (!Snake.IsOpositeDirection(Direction.Up) && IsMaxValue(AvailableMovesUp, AvailableMovesDown, AvailableMovesLeft, AvailableMovesRight))
                newDirection = Direction.Up;

            if (!Snake.IsOpositeDirection(Direction.Right) && IsMaxValue(AvailableMovesRight, AvailableMovesDown, AvailableMovesLeft, AvailableMovesUp))
                newDirection = Direction.Right;

            switch (newDirection)
            {
                case Direction.Down:
                    if (LockingWayDown)
                        if (AvailableMovesLeft > 0 || AvailableMovesUp > 0 || AvailableMovesRight > 0)
                        {
                            AvailableMovesDown = -1;
                            newDirection = GetNewDirection();
                        }
                    break;
                case Direction.Left:
                    if (LockingWayLeft)
                        if (AvailableMovesDown > 0 || AvailableMovesUp > 0 || AvailableMovesRight > 0)
                        {
                            AvailableMovesLeft = -1;
                            newDirection = GetNewDirection();
                        }
                    break;
                case Direction.Up:
                    if (LockingWayUp)
                        if (AvailableMovesLeft > 0 || AvailableMovesDown > 0 || AvailableMovesRight > 0)
                        {
                            AvailableMovesUp = -1;
                            newDirection = GetNewDirection();
                        }
                    break;
                case Direction.Right:
                    if (LockingWayRight)
                        if (AvailableMovesLeft > 0 || AvailableMovesUp > 0 || AvailableMovesDown > 0)
                        {
                            AvailableMovesRight = -1;
                            newDirection = GetNewDirection();
                        }
                    break;
            }

            return newDirection;
        }

        private bool IsMaxValue(int value, int compare1, int compare2, int compare3)
        {
            return (value >= compare1 && value >= compare2 && value >= compare3);
        }

        private async Task VerifyDirectionUp()
        {
            if (Snake.IsOpositeDirection(Direction.Up))
            {
                AvailableMovesUp = -1;
                return;
            }

            AvailableMovesUp = 0;
            LockingWayUp = false;

            if (Snake.Y == 0)
                return;

            var posY = Snake.Y;

            var posX = Snake.X;
            var posX_plus = posX;
            var posX_less = posX;

            if (posX != 0)
                posX_less = posX - 1;

            if (posX != Space.TopX - 1)
                posX_plus = posX + 1;

            int availableMoves = 0;
            LockingWayUp = await Task.Run(() => Search(out availableMoves, true, false, Space.TopY, posY, posX, posX_less, posX_plus, Direction.Right, Direction.Left));

            AvailableMovesUp = availableMoves;
        }

        private async Task VerifyDirectionLeft()
        {
            if (Snake.IsOpositeDirection(Direction.Left))
            {
                AvailableMovesLeft = -1; return;
            }

            AvailableMovesLeft = 0;
            LockingWayLeft = false;

            if (Snake.X == 0)
                return;

            var posX = Snake.X;

            var posY = Snake.Y;
            var posY_plus = posY;
            var posY_less = posY;

            if (posY != 0)
                posY_less = posY - 1;

            if (posY != Space.TopY - 1)
                posY_plus = posY + 1;

            int availableMoves = 0;
            LockingWayLeft = await Task.Run(() => Search(out availableMoves, false, false, Space.TopX, posX, posY, posY_less, posY_plus, Direction.Down, Direction.Up));

            AvailableMovesLeft = availableMoves;
        }

        private async Task VerifyDirectionDown()
        {
            if (Snake.IsOpositeDirection(Direction.Down))
            {
                AvailableMovesDown = -1;
                return;
            }

            AvailableMovesDown = 0;
            LockingWayDown = false;

            if (Snake.Y == Space.TopY)
                return;

            var posY = Snake.Y;

            var posX = Snake.X;
            var posX_plus = posX;
            var posX_less = posX;

            if (posX != 0)
                posX_less = posX - 1;

            if (posX != Space.TopX - 1)
                posX_plus = posX + 1;

            int availableMoves = 0;
            LockingWayDown = await Task.Run(() => Search(out availableMoves, true, true, Space.TopY, posY, posX, posX_less, posX_plus, Direction.Right, Direction.Left));

            AvailableMovesDown = availableMoves;
        }

        private async Task VerifyDirectionRight()
        {
            if (Snake.IsOpositeDirection(Direction.Right))
            {
                AvailableMovesRight = -1;
                return;
            }

            AvailableMovesRight = 0;
            LockingWayRight = false;

            if (Snake.X == Space.TopX)
                return;

            var posX = Snake.X;

            var posY = Snake.Y;
            var posY_plus = posY;
            var posY_less = posY;

            if (posY != 0)
                posY_less = posY - 1;

            if (posY != Space.TopY - 1)
                posY_plus = posY + 1;

            int availableMoves = 0;
            LockingWayRight = await Task.Run(() => Search(out availableMoves, false, true, Space.TopX, posX, posY, posY_less, posY_plus, Direction.Down, Direction.Up));

            AvailableMovesRight = availableMoves;
        }

        private bool Search(out int availableMoves, bool x, bool checkPlus, int topValue, int variable, int pos, int pos_less, int pos_plus, Direction direction_less, Direction direction_plus)
        {
            availableMoves = 0;

            var found = false;

            if (checkPlus)
                variable++;
            else
                variable--;

            var whiteSpacesLess = 0;
            var whiteSpacesPlus = 0;

            while (!found && variable > -1 && variable < topValue)
            {
                var previous = x ? Space.Map[pos_less, variable] : Space.Map[variable, pos_less];
                var actual = x ? Space.Map[pos, variable] : Space.Map[variable, pos];
                var next = x ? Space.Map[pos_plus, variable] : Space.Map[variable, pos_plus];

                if (previous != 0)
                {
                    if (Snakes.Any(s => s.Id == previous && s.X == (x ? pos_less : variable) && s.Y == (x ? variable : pos_less) && s.Direction == direction_less.ToString()))
                    {
                        found = true;
                        continue;
                    }
                }
                else if (pos != pos_less)
                    whiteSpacesLess++;

                if (next != 0)
                {
                    if (Snakes.Any(s => s.Id == previous && s.X == (x ? pos_plus : variable) && s.Y == (x ? variable : pos_plus) && s.Direction == direction_plus.ToString()))
                    {
                        found = true;
                        continue;
                    }
                }
                else if (pos != pos_plus)
                    whiteSpacesPlus++;

                if (actual == 0)
                    availableMoves++;
                else
                    found = true;

                if (checkPlus)
                    variable++;
                else
                    variable--;
            }

            //bool lockingWay_less;
            //if (pos == pos_less)
            //    lockingWay_less = true;
            //else
            //    lockingWay_less = whiteSpacesLess == AvailableMovesUp;

            //bool lockingWay_plus;
            //if (pos == pos_plus)
            //    lockingWay_plus = true;
            //else
            //    lockingWay_plus = whiteSpacesPlus == AvailableMovesUp;

            return whiteSpacesLess == 0 && whiteSpacesPlus == 0;
        }
    }
}
