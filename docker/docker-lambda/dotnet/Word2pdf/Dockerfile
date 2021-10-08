# https://aws.amazon.com/blogs/developer/net-5-aws-lambda-support-with-container-images
# https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/

FROM public.ecr.aws/lambda/dotnet:5.0

WORKDIR /var/task

RUN yum install -y amazon-linux-extras 
RUN amazon-linux-extras install epel -y
RUN yum install -y libgdiplus

COPY "publish"  .

# ENTRYPOINT [ "ls",  "publish" ]
CMD ["Word2pdf::Word2pdf.Function::FunctionHandler"]