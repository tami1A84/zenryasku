# Nostr Zenryaku Profile Client

This PR implements a Nostr client that replicates the functionality of "Zenryaku Profile" (a Japanese mobile profile service) locally.

## Features Implemented

- **Profile Display (Kind 0)**: Shows user profiles with name, picture, banner, about text (with Markdown support), NIP-05 verification, and website links
- **Friend Lists (Kind 3)**: Displays followed users as "friends" with mutual follow detection
- **Favorite Things Lists (Kind 30000/30001)**: Shows structured lists of favorite items
- **Recent Updates (Kind 1)**: Displays recent notes/tweets from the user
- **Zap Support**: Button for Lightning payments via lud16 field

## Technical Implementation

- React with TypeScript
- Tailwind CSS for styling
- nostr-tools for Nostr protocol interaction
- Vite for build tooling
- ESLint for code quality

## Screenshots

![App Screenshot](/home/ubuntu/repos/zenryasku/screenshot.png)

## Link to Devin run
https://app.devin.ai/sessions/28cd9e7d41a24b009cd927f8d546c461

## Requested by
N (shohei_mihara@proton.me)
