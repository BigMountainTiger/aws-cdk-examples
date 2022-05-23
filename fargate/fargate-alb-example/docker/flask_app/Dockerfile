FROM ubuntu:20.04

RUN apt-get update
RUN apt-get install python3.9 -y
RUN apt-get install python3-pip -y
RUN python3.9 -m pip install flask

EXPOSE 8080

WORKDIR /app

COPY app.py .

ENTRYPOINT [ "python3.9",  "app.py" ]
CMD []
