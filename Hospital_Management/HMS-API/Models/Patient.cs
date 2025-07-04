using System.ComponentModel.DataAnnotations;
public class Patient
{
    [Key]
    public int Id { get; set; }
    public required string Gender { get; set; }
    public DateTime DOB { get; set; }
    public required string Phone { get; set; }
    public required string Address { get; set; }
    public required User User { get; set; }
}