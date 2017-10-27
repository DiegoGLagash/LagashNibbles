using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nibbles.Models
{
    public class Pos
    {
        public int X { get; set; }
        public int Y { get; set; }


        public Pos()
        {
        }

        public bool IsValid()
        {
            return (X >= 0) && (Y >= 0);
        }

        public bool IsValidInBounds(Space space)
        {
            return IsValid() && (X < space.TopX) && (Y < space.TopY);
        }
    }
}
