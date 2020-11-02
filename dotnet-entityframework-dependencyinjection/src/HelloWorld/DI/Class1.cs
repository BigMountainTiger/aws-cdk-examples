namespace HelloWorld.DI
{

  public interface IClass1 {
    public string GetMsg();
  }
  public class Class1 : IClass1 {
    private IClass2 class2;
    public Class1(IClass2 class2) {
      this.class2 = class2;
    }
    public string GetMsg() {
      return this.class2.GetMsg();
    }
  }
}