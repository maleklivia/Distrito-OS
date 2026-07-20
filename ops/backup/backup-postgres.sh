#!/bin/sh
set -eu

: "${POSTGRES_DB:?}"
: "${POSTGRES_USER:?}"
: "${BACKUP_DIR:=/backups}"

timestamp="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
destination="$BACKUP_DIR/petisbar-$timestamp.dump"
mkdir -p "$BACKUP_DIR"
pg_dump --format=custom --compress=9 --no-owner --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --file="$destination"
find "$BACKUP_DIR" -type f -name 'petisbar-*.dump' -mtime +30 -delete
echo "Backup criado: $destination"
