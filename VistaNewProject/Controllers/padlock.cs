using Microsoft.AspNetCore.Mvc;

namespace VistaNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PadlockController : Controller
    {
        private readonly PasswordHasherService _passwordHasherService;

        public PadlockController(PasswordHasherService passwordHasherService)
        {
            _passwordHasherService = passwordHasherService;
        }

        [HttpPost("hash")]
        public IActionResult HashPassword([FromBody] string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                return BadRequest("Password cannot be empty.");
            }

            byte[] salt = _passwordHasherService.GenerateSalt();
            string hashedPassword = _passwordHasherService.HashPassword(password, salt);

            return Ok(new { Salt = Convert.ToBase64String(salt), HashedPassword = hashedPassword });
        }
    }
}
