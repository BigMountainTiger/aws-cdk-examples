ARG DEP_DIR="docker-dependencies"

FROM ubuntu:20.04

ARG DEP_DIR

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y wget
COPY ${DEP_DIR}/packages-microsoft-prod.deb ./packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN apt-get update

RUN apt-get install -y libgdiplus
RUN apt-get install -y dotnet-runtime-5.0

RUN apt-get install -y python3
RUN apt-get install -y python3-pip

RUN pip3 install --upgrade pip
RUN pip3 install awslambdaric

RUN apt-get autoremove -y

WORKDIR /var/task/

COPY ${DEP_DIR}/aws-lambda-rie /usr/bin/aws-lambda-rie
RUN chmod 755 /usr/bin/aws-lambda-rie

COPY ${DEP_DIR}/entry.sh /

COPY app/reqirement.txt .
RUN pip3 install -r reqirement.txt

COPY app/app.py .
COPY app/docx_merge.py .
COPY app/testdata.py .
COPY app/util.py .
COPY app/word_pdf.py .

# ADD app/work ./work/

RUN mkdir /tmp/result/
ADD word-pdf/bin/Debug/net5.0/publish/ word-pdf/

COPY invoicetemplate.docx .
RUN chmod 755 invoicetemplate.docx

ENTRYPOINT [ "/entry.sh" ]
CMD [ "app.lambdaHandler" ]


