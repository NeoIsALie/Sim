using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace Sim.Controllers
{
    public class MainController : ControllerBase
    {
        private readonly IHostingEnvironment _env;

        public MainController(IHostingEnvironment env)
        {
            _env = env;
        }

        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(_env.WebRootPath, "Sim", "index.html"), "text/html");
        }
    }
}
