#!/bin/bash

# CDN Management Script for Portfolio
# This script helps manage the lightweight CDN service

case "$1" in
    start)
        echo "Starting CDN service..."
        docker compose up -d cdn_init cdn
        echo "CDN service started on http://localhost:3001"
        ;;
    stop)
        echo "Stopping CDN service..."
        docker compose stop cdn
        echo "CDN service stopped"
        ;;
    restart)
        echo "Restarting CDN service..."
        docker compose restart cdn
        echo "CDN service restarted"
        ;;
    logs)
        echo "Showing CDN logs..."
        docker compose logs -f cdn
        ;;
    status)
        echo "Checking CDN status..."
        curl -f http://localhost:3001/health && echo "CDN is healthy" || echo "CDN is not responding"
        ;;
    test)
        echo "Testing CDN endpoints..."
        echo "Health check:"
        curl -s http://localhost:3001/health
        echo -e "\nListing files in CDN volume:"
        docker run --rm -v portfolio_cdn_data:/data alpine ls -la /data/ 2>/dev/null || echo "No files found in CDN volume"
        ;;
    upload)
        if [ -z "$2" ]; then
            echo "Usage: $0 upload <local-file-path>"
            echo "Example: $0 upload ./public/projects/image.jpg"
            exit 1
        fi
        if [ ! -f "$2" ]; then
            echo "Error: File '$2' does not exist"
            exit 1
        fi
        filename=$(basename "$2")
        echo "Uploading $filename to CDN volume..."
        docker run --rm -v "$(pwd):/host" -v portfolio_cdn_data:/cdn alpine cp "/host/$2" "/cdn/$filename"
        echo "File uploaded successfully: http://localhost:3001/$filename"
        ;;
    list)
        echo "Files in CDN volume:"
        docker run --rm -v portfolio_cdn_data:/data alpine ls -la /data/
        ;;
    clean)
        echo "WARNING: This will delete all files in the CDN volume!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker run --rm -v portfolio_cdn_data:/data alpine sh -c "rm -rf /data/* && echo 'CDN volume cleaned'"
        else
            echo "Operation cancelled"
        fi
        ;;
    backup)
        if [ -z "$2" ]; then
            backup_path="$(pwd)/cdn_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
        else
            # Convert to absolute path if relative
            if [[ "$2" = /* ]]; then
                backup_path="$2"
            else
                backup_path="$(pwd)/$2"
            fi
        fi
        
        # Get the directory and filename separately
        backup_dir="$(dirname "$backup_path")"
        backup_name="$(basename "$backup_path")"
        
        # Ensure backup directory exists
        mkdir -p "$backup_dir"
        
        echo "Backing up CDN volume to $backup_path..."
        docker run --rm -v portfolio_cdn_data:/data -v "$backup_dir:/backup" alpine tar -czf "/backup/$backup_name" -C /data .
        echo "Backup created: $backup_path"
        ;;
    restore)
        if [ -z "$2" ]; then
            echo "Usage: $0 restore <backup-file-path>"
            exit 1
        fi
        
        # Convert to absolute path if relative
        if [[ "$2" = /* ]]; then
            backup_file="$2"
        else
            backup_file="$(pwd)/$2"
        fi
        
        if [ ! -f "$backup_file" ]; then
            echo "Error: Backup file '$backup_file' does not exist"
            exit 1
        fi
        
        # Get the directory and filename separately
        backup_dir="$(dirname "$backup_file")"
        backup_name="$(basename "$backup_file")"
        
        echo "Restoring CDN volume from $backup_file..."
        docker run --rm -v portfolio_cdn_data:/data -v "$backup_dir:/backup:ro" alpine tar -xzf "/backup/$backup_name" -C /data
        echo "Restore completed successfully"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|test|upload|list|clean|backup|restore}"
        echo ""
        echo "Commands:"
        echo "  start              - Start the CDN service"
        echo "  stop               - Stop the CDN service"
        echo "  restart            - Restart the CDN service"
        echo "  logs               - Show CDN logs"
        echo "  status             - Check if CDN is healthy"
        echo "  test               - Test CDN endpoints and show files"
        echo "  upload <file>      - Upload a file to CDN volume"
        echo "  list               - List all files in CDN volume"
        echo "  clean              - Remove all files from CDN volume"
        echo "  backup [path]      - Backup CDN volume to tar.gz file"
        echo "  restore <path>     - Restore CDN volume from backup file"
        exit 1
        ;;
esac

exit 0