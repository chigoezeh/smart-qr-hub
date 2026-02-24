#!/bin/bash

echo "================================"
echo "Smart-Link Hub - Database Setup"
echo "================================"
echo ""

echo "Checking if PostgreSQL is running..."
if ! pg_isready > /dev/null 2>&1; then
    echo "[ERROR] PostgreSQL is not running!"
    echo "Please start PostgreSQL and try again."
    exit 1
fi

echo "[OK] PostgreSQL is running"
echo ""

echo "Applying database migrations..."
echo "This will create 10 tables with indexes and foreign keys."
echo ""

npm run db:push

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Migration failed!"
    echo "Check the error message above."
    exit 1
fi

echo ""
echo "================================"
echo "[SUCCESS] Database is ready!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Make sure your .env.local has Clerk keys"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "See QUICKSTART.md for testing guide."
echo ""
