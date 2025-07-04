using System.ComponentModel.DataAnnotations;

public class Doctor
{
    [Key]
    public int Id { get; set; }
    public string Gender { get; set; }
    public DateTime DOB { get; set; }
    public string Specialization { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string UserId { get; set; }

    public User User { get; set; }
}