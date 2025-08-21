#!/bin/bash

echo "🚀 Game Server Stress Testing Suite"
echo "===================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:5000/api/stats/general > /dev/null 2>&1; then
    echo "❌ Server is not running on localhost:5000"
    echo "Please start the server first with: npm run dev"
    exit 1
fi

echo "✅ Server detected on localhost:5000"
echo ""

# Menu selection
echo "Select stress test to run:"
echo "1) Simple Load Test (50 users, 20 requests each - ~2 minutes)"
echo "2) Database Stress Test (30 concurrent operations - ~3 minutes)" 
echo "3) Full Stress Test (150 virtual players, 10 minutes)"
echo "4) Quick Health Check (10 users, 5 requests each - ~30 seconds)"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🏃‍♂️ Running Simple Load Test..."
        node simple-stress-test.js
        ;;
    2)
        echo "🗄️ Running Database Stress Test..."
        node database-stress-test.js
        ;;
    3)
        echo "🚀 Running Full Stress Test (This will take 10 minutes)..."
        echo "⚠️  Warning: This test creates 150 virtual players and may impact server performance"
        read -p "Are you sure you want to continue? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            node stress-test.js
        else
            echo "Test cancelled."
        fi
        ;;
    4)
        echo "🏥 Running Quick Health Check..."
        # Quick version with reduced load
        CONCURRENT_USERS=10 REQUESTS_PER_USER=5 node simple-stress-test.js
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Stress testing completed!"
echo ""
echo "📊 Tips for interpreting results:"
echo "   • Success rate >99%: Excellent stability"  
echo "   • Response time <200ms: Excellent performance"
echo "   • Response time <500ms: Good performance"
echo "   • Operations/second >50: Good throughput"
echo ""
echo "🔧 If you see issues, check:"
echo "   • Server logs for errors"
echo "   • Database connection pool settings"
echo "   • Memory usage during test"
echo "   • CPU utilization"