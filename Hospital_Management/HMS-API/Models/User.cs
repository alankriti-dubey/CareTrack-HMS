using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
    public required string FullName { get; set; }
    public string Role { get; set; } = "Patient";
}