#!/bin/bash

# Usage:
#   ./db_backup.sh get       → Create a backup (e.g., backup_2025-10-29_20-00.sql.gz)
#   ./db_backup.sh apply     → Restore from latest backup or a specific file

CONTAINER_NAME="database"      # must match docker-compose container name
DB_USER="postgres"
DB_NAME="appdb"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Helper for logging
log() {
  echo -e "\033[1;32m[$(date '+%H:%M:%S')]\033[0m $1"
}

# ---------------------------
# Create Backup
# ---------------------------
create_backup() {
  log "Creating backup from container '${CONTAINER_NAME}'..."
  docker exec -t ${CONTAINER_NAME} pg_dump -U ${DB_USER} ${DB_NAME} | gzip > "${BACKUP_FILE}"
  
  if [ $? -eq 0 ]; then
    log "✅ Backup created successfully: ${BACKUP_FILE}"
  else
    log "❌ Backup failed!"
    exit 1
  fi
}

# ---------------------------
# Restore Backup (Safe)
# ---------------------------
restore_backup() {
  local FILE_TO_RESTORE="$1"

  # If no file specified, use latest
  if [ -z "$FILE_TO_RESTORE" ]; then
    FILE_TO_RESTORE=$(ls -t ${BACKUP_DIR}/*.sql.gz 2>/dev/null | head -n 1)
  fi

  if [ ! -f "$FILE_TO_RESTORE" ]; then
    log "❌ No backup file found to restore."
    exit 1
  fi

  log "⚠️  Dropping and recreating database '${DB_NAME}' before restore..."
  docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${DB_NAME}';" >/dev/null 2>&1
  docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -c "DROP DATABASE IF EXISTS ${DB_NAME};"
  docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -c "CREATE DATABASE ${DB_NAME};"

  # Wait for Postgres to finish recovery
  log "⏳ Waiting for Postgres to become ready..."
  until docker exec ${CONTAINER_NAME} pg_isready -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; do
    sleep 1
  done
  log "✅ Postgres is ready, starting restore..."

  gunzip -c "$FILE_TO_RESTORE" | docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME}
  if [ $? -eq 0 ]; then
    log "✅ Database restored successfully from ${FILE_TO_RESTORE}"
  else
    log "❌ Restore failed!"
    exit 1
  fi
}

# ---------------------------
# CLI
# ---------------------------
case "$1" in
  get)
    create_backup
    ;;
  apply)
    restore_backup "$2"
    ;;
  *)
    echo "Usage:"
    echo "  $0 get                → Create a backup"
    echo "  $0 apply [file]       → Restore from latest or specific file"
    exit 1
    ;;
esac