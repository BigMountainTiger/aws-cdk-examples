using System;
using ExamplePackage;

namespace ExampleClient
{
    class Program
    {
        static void Main(string[] args)
        {
            var fahrenheit = 95;
            var msg = $"Fahrenheit {fahrenheit} degree is Celsius "
                + $"{MyConverter.Fahrenheit2Celsius(95).Value.ToString("F2")} degree";

            Console.WriteLine(msg);
        }
    }
}
