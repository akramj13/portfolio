
.PHONY: venv install clean run dev build docker-run docker-stop

venv:
	python3 -m venv .venv

install:
	python3 -m pip install -r requirements.txt

run:
	python3 main.py

dev:
	uvicorn main:app --reload --host 0.0.0.0 --port 8000

build:
	docker build -t linkedin-api .

docker-run:
	docker run -d --name linkedin-api -p 8000:8000 --env-file .env linkedin-api

docker-stop:
	docker stop linkedin-api || true
	docker rm linkedin-api || true

clean:
	rm -rf __pycache__ .venv build dist *.egg-info
	make docker-stop