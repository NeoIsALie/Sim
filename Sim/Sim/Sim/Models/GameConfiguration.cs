using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NpgsqlTypes;

namespace Sim.Models
{
    public class GameConfiguration
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set;}

        [Required]
        public NpgsqlPolygon PointsLocation { get; set; }

        [Required]
        public int Count { get; set; }

        [Required]
        public string ConfigName { get; set; }

        public virtual IEnumerable<Room> Rooms { get; set; }
    }
}