using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nibbles.Models
{
    public class Request
    {
        public Snake Snake { get; set; }
        public Space Space { get; set; }
        public List<Snake> Snakes { get; set; }
    }
}
