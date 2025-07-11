using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AppointmentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AppointmentController(ApplicationDbContext context)
    {
        _context = context;
    }
    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
    {
        return await _context.Appointments.ToListAsync();
    }
    
    [Authorize(Roles = "admin")]
    [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FirstOrDefaultAsync(p => p.Id == id);
            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAppointments), new { id = appointment.Id }, appointment);
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(int id, Appointment updated)
    {
        if (id != updated.Id) return BadRequest();

        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();
        appointment.AppointmentDate = updated.AppointmentDate;
        appointment.Status = updated.Status;
        appointment.PatientId = updated.PatientId;
        appointment.DoctorId = updated.DoctorId;

        await _context.SaveChangesAsync();
        return Ok(appointment);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();
        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}