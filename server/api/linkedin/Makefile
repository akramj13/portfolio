
.PHONY: venv install clean run dev

venv:
	python3 -m venv .venv

install:
	python3 -m pip install -r requirements.txt

run:
	python3 main.py

dev:
	uvicorn main:app --reload --host 0.0.0.0 --port 8000

clean:
	rm -rf __pycache__ .venv build dist *.egg-info