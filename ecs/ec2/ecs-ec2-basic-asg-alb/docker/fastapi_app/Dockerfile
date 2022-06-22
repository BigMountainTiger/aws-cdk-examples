FROM ubuntu:22.10

RUN apt-get update
RUN apt-get install python3.10 -y
RUN apt-get install python3-pip -y
RUN python3.10 -m pip install fastapi
RUN python3.10 -m pip install uvicorn
RUN python3.10 -m pip install codeguru_profiler_agent

EXPOSE 8000

WORKDIR /app

COPY main.py .

ENTRYPOINT [ "uvicorn",  "main:app", "--host", "0.0.0.0" ]
CMD []

