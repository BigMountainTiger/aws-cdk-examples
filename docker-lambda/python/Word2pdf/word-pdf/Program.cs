// apt-get install -y libgdiplus
// apt-cache --no-all-versions show libgdiplus | grep '^Size: '

// dotnet nuget locals all --list
// dotnet nuget locals all --clear

using System;

namespace word_pdf
{
    class Program
    {
        static void Main(string[] args)
        {
            // var word_file = args[0];
            // var pdf_file = args[1];

            var word_file = "./result/result.docx";
            var pdf_file = "./result/result.pdf";

            Console.WriteLine(word_file);
            Console.WriteLine(pdf_file);

            var watch = System.Diagnostics.Stopwatch.StartNew();

            Spire.Doc.Document pdfdoc = new Spire.Doc.Document(word_file, Spire.Doc.FileFormat.Auto);
            pdfdoc.SaveToFile(pdf_file, Spire.Doc.FileFormat.PDF);

            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;

            Console.WriteLine($"Completed in {elapsedMs / 1000} seconds {elapsedMs % 1000} milliseconds");
        }
    }
}
