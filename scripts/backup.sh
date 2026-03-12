#!/usr/bin/env bash
set -euo pipefail

# Database backup script for Beer Cellar
# Usage: ./scripts/backup.sh [compose-file]
#   Default compose file: docker-compose.prod.yml

COMPOSE_FILE="${1:-docker-compose.prod.yml}"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/beercellar-${TIMESTAMP}.sql"

echo "Backing up database..."
docker compose -f "$COMPOSE_FILE" exec -T db \
  pg_dump -U "${POSTGRES_USER:-beercellar}" beercellar > "$BACKUP_FILE"

echo "Backup saved to: $BACKUP_FILE"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"
