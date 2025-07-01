public class RegisterModel
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FullName { get; set; }
    public required string Gender { get; set; }
    public required string Phone { get; set; }
    public required string Address { get; set; }
    public required string UserName { get; set; }
    public DateTime DOB { get; set; }
    public string? Role { get; set; } = "Patient";
}