using Filmlista.Api.Data;
using Filmlista.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Filmlista.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MoviesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetMovies()
    {
        return Ok(_context.Movies.ToList());
    }
    [HttpPost]
    public IActionResult CreateMovie(Movie movie)
    {
        _context.Movies.Add(movie);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetMovies), new { id = movie.Id }, movie);
    }
    [HttpGet("{id}")]
    public IActionResult GetMovie(int id)
    {
        var movie = _context.Movies.Find(id);

        if (movie == null)
            return NotFound();

        return Ok(movie);
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public IActionResult DeleteMovie(int id)
    {
        var movie = _context.Movies.Find(id);

        if (movie == null)
            return NotFound();

        _context.Movies.Remove(movie);
        _context.SaveChanges();

        return NoContent();
    }
    [HttpPut("{id}")]
    public IActionResult UpdateMovie(int id, Movie updatedMovie)
    {
        var movie = _context.Movies.Find(id);

        if (movie == null)
            return NotFound();

        movie.Title = updatedMovie.Title;
        movie.Description = updatedMovie.Description;
        movie.ReleaseYear = updatedMovie.ReleaseYear;
        movie.CategoryId = updatedMovie.CategoryId;

        _context.SaveChanges();

        return Ok(movie);
    }
}