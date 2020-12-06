FROM amazon/aws-lambda-python:3.8

RUN yum install -y which
RUN pip install --upgrade pip
RUN pip install awslambdaric

WORKDIR /app/



COPY aws-lambda-rie /usr/bin/aws-lambda-rie
RUN chmod 755 /usr/bin/aws-lambda-rie

COPY entry.sh /
COPY app/* .

ENTRYPOINT [ "/entry.sh" ]
CMD [ "app.lambdaHandler" ]