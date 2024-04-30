FROM python:3.11.9-bookworm

RUN apt-get update \
  && apt-get -y install libpq-dev gcc \
  && pip install psycopg2 \
  && pip install boto3

COPY requirements.txt app/requirements.txt

RUN pip install --no-cache-dir -r app/requirements.txt

COPY pipeline /app/pipeline

WORKDIR /app

# Prevents output not being shown while running the pipeline.
ENV PYTHONUNBUFFERED=1

CMD [ "python3", "-m", "pipeline"]