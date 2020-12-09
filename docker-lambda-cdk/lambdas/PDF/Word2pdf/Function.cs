using System;
using System.Threading.Tasks;
using Amazon.Lambda.Core;


[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
namespace Word2pdf
{

  public class LambdaPayload {
    public string Payload { get; set; }
  }
  public class Function
  {
    private byte[] ConvertToPdf(string input) {
      string result = null;

      var input_bytes = System.Convert.FromBase64String(input);
      var input_stream = new System.IO.MemoryStream(input_bytes);
      var output_stream = new System.IO.MemoryStream();

      var pdfdoc = new Spire.Doc.Document(input_stream, Spire.Doc.FileFormat.Auto);
      pdfdoc.SaveToStream(output_stream, Spire.Doc.FileFormat.PDF);

      return output_stream.ToArray();
    }

    private void Upload2S3(byte[] pdf) {

    }

    public LambdaPayload FunctionHandler(LambdaPayload input, ILambdaContext context)
    {
      var input_payload = input.Payload;
      
      var payload = new LambdaPayload();
      var pdf = ConvertToPdf(input_payload);

      Upload2S3(pdf)

      var payload = new LambdaPayload();
      payload.Payload = "Success";
      return payload;
    }

  }
}
