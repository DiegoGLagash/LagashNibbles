using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nibbles.Models
{
    public class Space
    {
        public Space()
        {
        }

        public Space(int x, int y)
        {
            TopX = x;
            TopY = y;
            Map = new int?[TopX,TopY];
            for (var i = 0; i < x; i++)
            {
                for (var j = 0; j < y; j++)
                {
                    this.Map[i,j] = this.EMPTY;
                }
            }
        }

        public int TopX { get; set; }
        public int TopY { get; set; }
        public int?[,] Map { get; set; }
        public int EMPTY = 0;
    }
}
