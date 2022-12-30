# PROJECT BIRDNEST

Reaktor pre-assignment

### Live

App is live [here](https://birdnest-nine.vercel.app/)

API service that tracks the violations from the Reaktor API can be found [here](https://github.com/rikubrandt/birdback).

The API service's updater goes to sleep after no user has connected to the API for 10 minutes.

# Structure

Frontend is built using Next.js and uses the `useSWR` method to revalidate the data from the API every second to check if the data has changed.
Backend is a simple Node.js application that checks the Reaktor API every second and updates the `Map()` to keep track of recent violations and serves that for people connecting through the frontend.

# Critique

- Solution is more a hacking together a script than a production ready application.
- Data doesn't update after 10 minutes of inactivity. (This is mainly because of freetiers.)
- Could've added a database for the data.
- UI is as basic as it can get.
