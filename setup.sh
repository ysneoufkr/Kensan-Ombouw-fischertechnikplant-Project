set -e

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing frontend..."
cd "$BASE_DIR/frontend/Kensan"
npm install
npm run dev --host &

echo "Installing backend (dev)..."
cd "$BASE_DIR/backend"
npm install
npm run dev --host &

echo "Installing backend (api)..."
cd "$BASE_DIR/backend"
npm install
npm run api --host &

wait
