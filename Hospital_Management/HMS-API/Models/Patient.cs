public class Patient
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Gender { get; set; }
    public DateTime DOB { get; set; }
    public required string Phone { get; set; }
    public required string Address { get; set; }
    public required User User { get; set; }
}