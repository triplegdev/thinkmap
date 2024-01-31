FROM python:3.9.18-alpine3.18

RUN apk add --no-cache bash

RUN apk add build-base

RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .

# Add wait-for-it script
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Wait for the PostgreSQL service to be ready before running the commands
CMD ["sh", "-c", "wait-for-it postgres:5432 -- flask db upgrade && flask seed all && gunicorn -b 0.0.0.0:8000 app:app"]
