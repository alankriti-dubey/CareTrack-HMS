using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;

[Route("api/[controller]")]
[ApiController]

public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly SignInManager<User> _signInManager;
    private readonly TokenService _tokenService;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterModel model)
    {
        var user = new User {
            UserName = model.Email,
            Email = model.Email,
            PhoneNumber = model.FullName,
            FullName = model.FullName,
            Gender = model.Gender,
            Address = model.Address,
            Role = model.Role ?? "admin"
        };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {   
            return Ok("User Created");
        }
        return BadRequest(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var token = _tokenService.CreateToken(user);
            return Ok(new { token });
        }
        return Unauthorized("Invalid credentials");
    }
}