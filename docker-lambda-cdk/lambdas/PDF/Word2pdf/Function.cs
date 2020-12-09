using System;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
namespace Word2pdf
{

  public class LambdaPayload {
    public string Payload { get; set; }
  }

  public class Function
  {
    private byte[] ConvertToPdf(string input) {

      var input_bytes = System.Convert.FromBase64String(input);
      var input_stream = new System.IO.MemoryStream(input_bytes);
      var output_stream = new System.IO.MemoryStream();

      var pdfdoc = new Spire.Doc.Document(input_stream, Spire.Doc.FileFormat.Auto);
      pdfdoc.SaveToStream(output_stream, Spire.Doc.FileFormat.PDF);

      return output_stream.ToArray();
    }

    private string Upload2S3(byte[] pdf) {

      var bucketName = "logs.huge.head.li";

      using (var client = new AmazonS3Client())
      {
        var key = $"P-{DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss-fff")}.pdf";
        using (var newMemoryStream = new System.IO.MemoryStream(pdf))
        {
          var uploadRequest = new TransferUtilityUploadRequest
          {
            InputStream = newMemoryStream,
            Key = key,
            BucketName = bucketName
          };

          var util = new TransferUtility(client);
          util.Upload(uploadRequest);
        }

        var preSignedUrlRequest = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddMinutes(5)
        };

        var url = client.GetPreSignedURL(preSignedUrlRequest);

        return url;

      }
    }

    public LambdaPayload FunctionHandler(LambdaPayload input, ILambdaContext context)
    {
      var input_payload = input.Payload;
      var pdf = ConvertToPdf(input_payload);
      var url = Upload2S3(pdf);

      return new LambdaPayload{
        Payload = url
      };
    }

  }
}
