# LinkedIn Profile Scraper FastAPI

A FastAPI application that scrapes LinkedIn profile data like experience sections.

## Setup

1. Copy the environment template and fill in your LinkedIn credentials:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your LinkedIn credentials:

   - `PROFILE_URL`: Your LinkedIn profile URL
   - `LINKEDIN_EMAIL`: Your LinkedIn email
   - `LINKEDIN_PASSWORD`: Your LinkedIn password
   - `API_TOKEN`: Whatever you want the secure token for this API to be.

3. Install dependencies:

   ```bash
   make install
   ```

4. Install Playwright browsers:
   ```bash
   playwright install
   ```

## Running the Application

### Docker (Recommended)

1. Build the Docker image:

   ```bash
   make build
   ```

2. Run the container:

   ```bash
   make docker-run
   ```

3. Stop the container:
   ```bash
   make docker-stop
   ```

The API will be available at `http://localhost:8000`

### Local Development

#### Development mode (with auto-reload):

```bash
make dev
```

#### Production mode:

```bash
make run
```

Note: For local development, you'll also need to install Playwright browsers:

```bash
playwright install
```

## API Endpoints

- `GET /` - Health check endpoint
- `GET /education` - Get education section from LinkedIn profile
- `GET /experience` - Get experience section from LinkedIn profile

## API Documentation

Once the server is running, you can access:

- Interactive API docs: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`

## Usage Example

```bash
# Get education data
curl http://localhost:8000/education

# Get experience data
curl http://localhost:8000/experience
```

## Note

This application uses web scraping to extract LinkedIn data. Make sure you comply with LinkedIn's Terms of Service and use this responsibly.
