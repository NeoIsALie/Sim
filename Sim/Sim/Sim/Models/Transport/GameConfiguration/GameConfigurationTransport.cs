using System.Collections.Generic;
using System.Linq;

namespace Sim.Models.Transport.GameConfigurationTransport
{
    public class GameConfigurationTransport
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<Point> Points { get; set; }

        public GameConfigurationTransport()
        {
        }

        public GameConfigurationTransport(GameConfiguration gameConfiguration)
        {
            Id = gameConfiguration.Id;
            Name = gameConfiguration.ConfigName;
            Points = gameConfiguration.PointsLocation.Select(p => new Point(p.X, p.Y));
        }
    }
}
