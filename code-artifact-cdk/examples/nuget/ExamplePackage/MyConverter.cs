using UltimateTemperatureLibrary;

namespace ExamplePackage
{
    public class MyConverter
    {
        public static Celsius Fahrenheit2Celsius(int f) {
            
            return (new Fahrenheit(f)).ToCelsius();
        }
    }
}
