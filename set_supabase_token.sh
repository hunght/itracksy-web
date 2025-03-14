#!/bin/bash

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
        echo "Error: Supabase access token not found in .env.local"
        return 1
    fi

    # Export the token to environment variables
    export SUPABASE_ACCESS_TOKEN="$ACCESS_TOKEN"
    supabase gen types typescript --project-id onrbhccgncgewwcpvzxs --schema public > lib/supabase.ts
}

# Call the function
export_supabase_token