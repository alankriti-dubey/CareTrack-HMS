using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;



namespace HMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        public PatientController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            return await _context.Patients.Include(p => p.User).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }


        [HttpPost]
        public async Task<ActionResult<Patient>> AddPatient(Patient patient)
        {
            var existingUser = await _userManager.FindByEmailAsync(patient.User.Email);
            if (existingUser != null)
            {
                return BadRequest("User with this email already exists");
            }

            var user = new User
            {
                UserName = patient.User.UserName,
                Email = patient.User.Email,
                PhoneNumber = patient.Phone,
                Gender = patient.Gender,
                Address = patient.Address,
                FullName = patient.FullName,
                Role = "patient",
            };

            var result = await _userManager.CreateAsync(user, "Default@123");

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            patient.User = user;
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, Patient patient)
        {
            if (id != patient.Id)
            {
                return BadRequest();
            }

            var existingPatient = await _context.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);

            if (existingPatient == null)
            {
                return NotFound();
            }

            existingPatient.FullName = patient.FullName;
            existingPatient.Gender = patient.Gender;
            existingPatient.DOB = patient.DOB;
            existingPatient.Phone = patient.Phone;
            existingPatient.Address = patient.Address;

            if (patient.User != null)
            {
                var userFromDb = await _context.Users.FindAsync(patient.User.Id);
                if (userFromDb == null)
                {
                    return BadRequest("User not found");
                }
                existingPatient.User = userFromDb;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "Update Failed. Please try again..." + ex.Message);
            }
            return Ok(existingPatient);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}