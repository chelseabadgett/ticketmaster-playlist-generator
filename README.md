# Ticketmaster Playlist Generator

![image](https://github.com/user-attachments/assets/a4a7ee98-8619-45b0-bcd4-86611e303212)

## Overview

This is a web application that grabs the current authenticated user's top listened to songs on Spotify, the user's local Ticketmaster shows and recommends personalized songs that match the listeners music taste for concerts nearby.

## Pre-requisites

To run this application you will need:

- A [Node.js LTS](https://nodejs.org/en/) environment or later.
- A Spotify account.
- A [Spotify Developer Account](https://developer.spotify.com/)
- In Spotify Developer Dashboard
  1. Click `Create App`
  2. Add `http://localhost:5173` as a Redirect Uri
  3. Fill out all other fields as you see fit
  4. Click `Save`
  5. Copy the `Client ID` from the App Settings for the next step
- A [Ticketmaster Developer Account](https://developer-acct.ticketmaster.com/)
- In Ticketmaster Developer Account
  1. Click `Add a New Application`
  2. Add `http://localhost:5173` as a Redirect Uri
  3. Fill out all other fields as you see fit
  4. Click `Create Application`
- Create `.env file in the root directory with contents:
  ```
  VITE_SPOTIFY_CLIENT_ID=<YOUR SPOTIFY CLIENT ID>
  VITE_TICKETMASTER_API_KEY=<YOUR TICKETMASTER CONSUMER KEY>
  ```

## Usage

1. Clone the repository
2. Run
   ```bash
   npm install
   npm run dev
   ```

## References

Follows this [repo](https://github.com/spotify/web-api-examples/tree/999766d548700de77f15b294df8b96587f313cd0/get_user_profile) to setup Spotify User Authentication.
