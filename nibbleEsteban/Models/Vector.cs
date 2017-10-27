using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nibbles.Models
{
    public class Vector : Pos
    {
        public string Direction { get; set; }
        public Direction Direccion { get; set; }

        public Vector() : base()
        {
        }

        public Pos MoveNew()
        {
            return MoveNewDirection(Direccion);
        }

        public bool IsOpositeDirection(Direction direction)
        {
            if (Direccion == Nibbles.Models.Direction.Up)
                return direction == Nibbles.Models.Direction.Down;
            else if (Direccion == Nibbles.Models.Direction.Right)
                return direction == Nibbles.Models.Direction.Left;
            else if (Direccion == Nibbles.Models.Direction.Down)
                return direction == Nibbles.Models.Direction.Up;
            else if (Direccion == Nibbles.Models.Direction.Left)
                return direction == Nibbles.Models.Direction.Right;

            return false;
        }

        public Pos MoveNewDirection(Direction direction)
        {
            var pos = new Pos
            {
                X = this.X,
                Y = this.Y
            };

            if (direction == Nibbles.Models.Direction.Up)
                pos.Y = this.Y - 1;
            else if (direction == Nibbles.Models.Direction.Right)
                pos.X = this.X + 1;
            else if (direction == Nibbles.Models.Direction.Down)
                pos.Y = this.Y + 1;
            else if (direction == Nibbles.Models.Direction.Left)
                pos.X = this.X - 1;

            return pos;
        }
    }
}
