using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class DoctorController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public DoctorController(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }


    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
    {
        return await _context.Doctors.Include(d => d.User).ToListAsync();
    }

    [Authorize(Roles = "admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<Doctor>> GetDoctor(int id)
    {
        var doctor = await _context.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        return doctor;
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<Doctor>> AddDoctor(Doctor doctor)
    {
        var existingUser = await _userManager.FindByEmailAsync(doctor.User.Email);
        if (existingUser != null) return BadRequest("User with this email is already present");
        var user = new User
        {
            UserName = doctor.User.UserName,
            Email = doctor.User.Email,
            FullName = doctor.User.FullName,
            PhoneNumber = doctor.Phone,
            Role = "doctor"
        };
        var result = await _userManager.CreateAsync(user, "Default@123");
        if (!result.Succeeded) return BadRequest(result.Errors);
        await _userManager.AddToRoleAsync(user, "doctor");
        doctor.User = user;
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctor(int id, Doctor doctor)
    {
        if (id != doctor.Id) return BadRequest();
        var existing = await _context.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        if (existing == null) return NotFound();


        existing.User.FullName = doctor.User.FullName;
        existing.Gender = doctor.Gender;
        existing.DOB = doctor.DOB;
        existing.Specialization = doctor.Specialization;
        existing.Phone = doctor.Phone;
        existing.Address = doctor.Address;

        if (doctor.User != null && !string.IsNullOrWhiteSpace(doctor.User.Email))
        {
            var user = await _context.Users.FindAsync(doctor.User.Id);
            if (user == null) return BadRequest("User not found");
            existing.User = user;
        }

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]

    public async Task<IActionResult> DeleteDoctor(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor == null) return NotFound();

        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}