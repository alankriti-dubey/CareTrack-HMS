public class Appointment
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = "Scheduled";
    public int PatientId { get; set; }

    public int DoctorId { get; set; }
    public string Description { get; set;}
}