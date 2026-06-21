using System.ComponentModel.DataAnnotations;

namespace CarbonWise.Api.DTOs.Users;

public class RegisterUserRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    public string? PreferredGoal { get; set; }
}