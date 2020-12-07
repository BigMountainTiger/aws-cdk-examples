ARG DEP_DIR="docker-dependencies"

FROM amazon/aws-lambda-python:3.8
ARG DEP_DIR

RUN yum install -y which

COPY ${DEP_DIR}/packages-microsoft-prod.rpm .
RUN rpm -Uvh packages-microsoft-prod.rpm
RUN yum install -y dotnet-runtime-5.0

RUN pip install --upgrade pip
RUN pip install awslambdaric

WORKDIR /app/

COPY ${DEP_DIR}/aws-lambda-rie /usr/bin/aws-lambda-rie
RUN chmod 755 /usr/bin/aws-lambda-rie

COPY ${DEP_DIR}/entry.sh /
COPY app/* .

ENTRYPOINT [ "/entry.sh" ]
CMD [ "app.lambdaHandler" ]