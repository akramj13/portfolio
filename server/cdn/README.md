# Portfolio CDN Service

A lightweight CDN service using Nginx to serve static assets for the portfolio website with Docker volumes for better portability and performance.

## Features

- **Fast Static Asset Delivery**: Optimized Nginx configuration for serving images and files
- **Docker Volumes**: Uses Docker volumes instead of bind mounts for better performance
- **Compression**: Gzip compression enabled for better performance
- **Caching**: Proper cache headers for optimal browser caching
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Checks**: Built-in health monitoring
- **Security Headers**: Basic security headers for protection
- **File Management**: Built-in tools for uploading, listing, and managing files

## Architecture

The CDN uses Docker volumes to store static files, providing:

- Better performance than bind mounts
- Platform independence
- Easier backup and restore capabilities
- Isolated file storage

## Endpoints

- **Health Check**: `GET /health` - Returns service status
- **Project Images**: `GET /projects/{filename}` - Serves project images
- **Static Assets**: `GET /{path}` - Serves other static files

## Usage

### Start the CDN Service

```bash
# Start CDN with initialization
docker-compose up -d cdn_init cdn

# Or use the management script
./server/cdn/manage.sh start
```

### Stop the CDN Service

```bash
# Stop CDN
docker-compose stop cdn

# Or use the management script
./server/cdn/manage.sh stop
```

### File Management

```bash
# Upload a file to CDN
./server/cdn/manage.sh upload ./path/to/image.jpg

# List all files in CDN
./server/cdn/manage.sh list

# Check CDN status
./server/cdn/manage.sh status

# View CDN logs
./server/cdn/manage.sh logs

# Clean all files from CDN
./server/cdn/manage.sh clean

# Backup CDN files
./server/cdn/manage.sh backup ./my-backup.tar.gz

# Restore CDN files
./server/cdn/manage.sh restore ./my-backup.tar.gz
```

## Docker Volumes

The service uses these Docker volumes:

- `portfolio_cdn_static_files` - Stores the actual static files
- `portfolio_cdn_config` - Stores Nginx configuration

## Configuration

The CDN is configured to:

- Run on port `3001`
- Serve files from Docker volume `cdn_static_files`
- Cache images for 1 month
- Cache other files for 1 hour
- Enable gzip compression
- Add security headers

## Integration with Portfolio

The portfolio application automatically uploads files to the CDN volume using the `CDNUploader` utility class.

### CDN Uploader Usage

```typescript
import CDNUploader from "@/lib/cdn-uploader";

const cdnUploader = new CDNUploader();

// Upload a file
const cdnUrl = await cdnUploader.uploadFile(fileBuffer, fileName, "projects");

// Delete a file
await cdnUploader.deleteFile(fileName, "projects");

// List files
const files = await cdnUploader.listFiles("projects");

// Check CDN health
const isHealthy = await cdnUploader.isHealthy();
```

### Environment Variables

Add to your `.env` file:

```env
CDN_URL=http://localhost:3001
```

For production:

```env
CDN_URL=https://cdn.yourdomain.com
```

## Production Deployment

For production, consider:

- Using a proper CDN service (CloudFront, Cloudflare, etc.)
- Adding SSL/TLS certificates
- Setting up proper domain and DNS
- Implementing image optimization
- Adding more robust caching strategies
- Setting up volume backups

## File Structure

```
server/cdn/
├── nginx.conf      # Nginx configuration
├── manage.sh       # Management script
└── README.md       # This file
```

## Troubleshooting

### CDN not starting

- Check if port 3001 is available
- Ensure Docker is running
- Check Docker Compose logs: `docker-compose logs cdn`
- Verify initialization container ran: `docker-compose logs cdn_init`

### Files not serving

- Verify files exist in volume: `./server/cdn/manage.sh list`
- Check file permissions
- Test health endpoint: `curl http://localhost:3001/health`

### Performance issues

- Monitor nginx access logs: `./server/cdn/manage.sh logs`
- Check gzip compression is working
- Verify cache headers are set correctly

### Volume Management

- Backup volumes regularly: `./server/cdn/manage.sh backup`
- Monitor volume size: `docker system df`
- Clean up unused volumes: `docker volume prune`
