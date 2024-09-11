#!/usr/bin/env bash
set -x
set -eo pipefail

# Only create .env.local IFF it doesn't exists.
if [ ! -f "./frontend/.env.local" ]; then
    touch ./frontend/.env.local && echo -e "VITE_SERVER_HOST=http://localhost\nVITE_SERVER_PORT=3000" >> ./frontend/.env.local
fi
cd ./frontend && npm i && npm run dev &
FRONTEND_PID=$!
cd ./server && npm i  && npm run dev &
SERVER_PID=$!

# Assume port is 3000. Might allow configuring the port.
until $(curl --output /dev/null --silent --head --fail 'http://localhost:3000/v1/health'); do
  >&2 echo "Server isn't available yet - sleeping"
  sleep 1
done

until $(curl --output /dev/null --silent --head --fail 'http://localhost:5173'); do
  >&2 echo "Frontend isn't available yet - sleeping"
  sleep 1
done

>&2 echo "All services are up!"
>&2 echo "Frontend should be: http://localhost:5173"
>&2 echo "Server should be: http://localhost:3000"
wait

kill $SERVER_PID
kill $FRONTEND_PID