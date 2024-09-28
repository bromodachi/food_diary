# Basic Food Diary

A simple web-based application that records a user's food diary.
Users can keep track of what food they eat for the following:

- Breakfast
- Lunch
- Dinner
- Snack
- Drinks

We've separated each component into their respective domain: frontend and server.
The reason mainly is to allow each component to be running on their instance(aiming for a microservice).
The frontend uses react + vite to call the backend API. It's very simple and mostly aimed at
desktops. However, it is possible to view it on a mobile device but not optimized for it.

The backend uses Node.js with the express framework. The repository uses an in-memory
data structure to record all user entries. So if you were to shut down the server, all entries would be lost.
We didn't implement any bearer tokens or user registration so the user ID is currently fixed to ID 1.

This is supposed to be a simple web application but can easily be expanded to be a full-fledged app.
It's to simply demonstrate fetching & displaying, storing, updating, and deleting data.

Please view the respective component's readme for more information.

## Starting each service.

Go to the respective directory and run the following:
```shell
cd frontend  && npm i && npm run dev
```

```shell
cd server  && npm i && npm run dev
```

Or use `start_services.sh`. However, this assumes ports 5137 and 3000 are free.
If not, please kill the services that are using those ports.
We can easily support passing custom ports but decided not to do so at this time.

The port for the server will be 3000. The frontend will most likely be ` http://localhost:5173/`.
```shell
./start_services.sh
```

The script will inform you when both services are up.
You should see something like:

```shell
All services are up!
Frontend should be: http://localhost:5173
Server should be: http://localhost:3000
```