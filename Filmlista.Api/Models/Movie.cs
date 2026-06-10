namespace Filmlista.Api.Models;

public class Movie
{
    public int Id { get; set; }

    public string Title { get; set; } = "";

    public string Description { get; set; } = "";

    public int ReleaseYear { get; set; }

    public int CategoryId { get; set; }

    public Category? Category { get; set; }
}