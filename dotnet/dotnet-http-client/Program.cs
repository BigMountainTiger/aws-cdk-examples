using System;
using System.Collections.Generic;
using System.Security.Cryptography; 
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Net.Http;

namespace dotnet_example
{
    class Program
    {
        static string QString(Dictionary<string, string> data) {

            StringBuilder sb = new StringBuilder();
            foreach(var entry in data)
            {
                if (sb.Length != 0) {
                    sb.Append("&");
                }
                sb.Append($"{entry.Key}={HttpUtility.UrlEncode(entry.Value)}");
            }
            return sb.ToString();

        }

        static string sha256_hash(string value)
        {
            StringBuilder Sb = new StringBuilder();
            using (var hash = SHA256.Create()) {
                foreach (Byte b in hash.ComputeHash(Encoding.UTF8.GetBytes(value)))
                    Sb.Append(b.ToString("x2"));
            }

            return Sb.ToString();
        }

        static async Task TestHttp() {

            HttpClient client = new HttpClient();
            var response = await client.GetAsync("http://www.google.com/");
            response.EnsureSuccessStatusCode();

            string responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseBody);
        }

        static async Task Test() {
            await TestHttp();

            Console.WriteLine();
            Console.WriteLine(sha256_hash("It is OK"));

            var data = new Dictionary<string, string>();
            data.Add("A1", "This is A1");
            data.Add("A2", "This is A2");

            Console.WriteLine();
            Console.WriteLine(QString(data));

        }

        static void Main(string[] args) {
            Test().GetAwaiter().GetResult();

        }
    }
}

