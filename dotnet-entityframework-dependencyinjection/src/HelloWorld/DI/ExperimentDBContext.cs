using Microsoft.EntityFrameworkCore;

namespace HelloWorld.DI
{
  public class Student
  {
    public int? ID { get; set; }
    public string Name { get; set; }
  }

  public class ExperimentDBContext : DbContext {
    public DbSet<Student> Student { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      var constr = "Server=database-sql-server.ckvomoeauj3q.us-east-1.rds.amazonaws.com;"
        + "Database=experiment_db;"
        + "User Id=admin;"
        + "Password=Pass1234";

      optionsBuilder.UseSqlServer(constr);
    }
  }
}