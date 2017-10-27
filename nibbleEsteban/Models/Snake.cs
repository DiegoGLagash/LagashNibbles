using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nibbles.Models
{
    public class Snake : Vector
    {
        public Snake() : base()
        {

        }

        public Snake(int id) : base()
        {
            Trail = new List<Vector>();
            Id = id;
        }

        public int Id { get; set; }
        public int? Ticks { get; set; }
        public List<Vector> Trail { get; set; }
        public int? Length { get; set; }
    }
}
