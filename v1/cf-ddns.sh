#!/bin/bash

# Load configuration from .env.cf
if [ -f ".env.cf" ]; then
    source .env.cf
else
    echo "Error: .env.cf file not found"
    exit 1
fi

# Check if required variables are set
if [ -z "$ZONE_ID" ] || [ -z "$RECORD_ID" ] || [ -z "$API_TOKEN" ] || [ -z "$DOMAIN" ]; then
    echo "Error: Missing required environment variables in .env.cf"
    echo "Required: ZONE_ID, RECORD_ID, API_TOKEN, DOMAIN"
    exit 1
fi

# Get public IP
CURRENT_IP=$(curl -s https://ipv4.icanhazip.com)

# Get the current DNS record IP
DNS_IP=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | grep -oP '(?<="content":")[^"]+')

if [ "$CURRENT_IP" != "$DNS_IP" ]; then
  echo "Updating IP from $DNS_IP to $CURRENT_IP"
  curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"A\",\"name\":\"$DOMAIN\",\"content\":\"$CURRENT_IP\",\"ttl\":300,\"proxied\":true}"
else
  echo "No IP change. Current IP is $CURRENT_IP"
fi