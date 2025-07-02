using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
    public required string FullName { get; set; }
    public required string Role { get; set; }
    public required string Gender { get; set; }
    public required string Address { get; set; }
}