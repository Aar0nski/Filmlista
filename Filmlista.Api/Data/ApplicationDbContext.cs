using Microsoft.EntityFrameworkCore;
using Filmlista.Api.Models;

namespace Filmlista.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Movie> Movies { get; set; }

    public DbSet<Category> Categories { get; set; }

    public DbSet<Review> Reviews { get; set; }
}