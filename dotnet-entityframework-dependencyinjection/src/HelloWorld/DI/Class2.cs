using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace HelloWorld.DI
{

  public interface IClass2 {
    public string GetMsg();
  }
  public class Class2 : IClass2 {
    public string GetMsg() {
      var name = "No one";


      using (var context = new ExperimentDBContext())
      {
        context.Database.ExecuteSqlRaw("DELETE FROM Student");
      }

      using (var context = new ExperimentDBContext())
      {
        context.Student.Add(new Student {
          Name = "Song Li"
        });

        context.SaveChanges();
      }

      using (var context = new ExperimentDBContext())
      {
        foreach(var s in context.Student) {
          s.Name = s.Name + " - " + s.ID.ToString();
        }

        context.SaveChanges();
      }

      using (var context = new ExperimentDBContext())
      {
        var model = from s in context.Student
          select s;
        name = model.ToList()[0].Name;

        // var model = context.Student.Count();
        // name = model.ToString();
          
      }

      return "This is the message from Class2 - " + name;
    }
  }
}