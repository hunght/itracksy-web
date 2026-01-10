#!/bin/bash

# Supabase Token Setup Script
#
# This script exports the Supabase access token from .env.local
# and can optionally generate TypeScript types.
#
# Usage:
#   source ./set_supabase_token.sh           # Export token only
#   source ./set_supabase_token.sh --types   # Export token + generate types
#   ./set_supabase_token.sh                  # Same as --types (for npm scripts)

# Supabase project configuration
SUPABASE_PROJECT_ID="onrbhccgncgewwcpvzxs"
TYPES_OUTPUT="lib/supabase.ts"

# Function to export Supabase access token from .env.local
export_supabase_token() {
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        echo "Error: .env.local file not found"
        return 1
    fi

    # Extract Supabase access token from .env.local
    ACCESS_TOKEN=$(grep "SUPABASE_ACCESS_TOKEN=" .env.local | cut -d '=' -f2)

    # Validate token
    if [[ -z "$ACCESS_TOKEN" ]]; then
        echo "Error: SUPABASE_ACCESS_TOKEN not found in .env.local"
        echo "Add this line to .env.local: SUPABASE_ACCESS_TOKEN=sbp_xxxxx"
        return 1
    fi

    # Export the token to environment variables
    export SUPABASE_ACCESS_TOKEN="$ACCESS_TOKEN"
    echo "Supabase token exported successfully"
}

# Function to generate TypeScript types
generate_types() {
    echo "Generating TypeScript types from Supabase schema..."
    supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" --schema public > "$TYPES_OUTPUT"
    echo "Types written to $TYPES_OUTPUT"
}

# Export the token
export_supabase_token || exit 1

# If --types flag is passed or script is run directly (not sourced), generate types
if [[ "$1" == "--types" ]] || [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    generate_types
fi
