# Food Diary Frontend

This is the frontend web application of the food diary. You must have food diary server running in the background.

## Running the program

Either use start_services.sh that can be found a directory above or follow the next few commands.

If running locally, you must first create an `.env.local` file.

```shell
touch .env.local
echo "VITE_SERVER_HOST=http://localhost
VITE_SERVER_PORT=3000" >> .env.local
```

Finally, you can run:

```shell
npm run dev
```

## Technologies used

- React
- Vite
- Shadcn (UI Library)
- React hook form
- TailwindCss
- Jest(testing framework, only used for one test class)
