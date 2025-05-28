# Nostr前略プロフィール - Zenryaku Profile Client

This PR implements a Nostr client that replicates the functionality and design of "Zenryaku Profile" (前略プロフィール), a popular Japanese profile service from the early 2000s.

## Features Implemented

1. **Exact Design Replication**:
   - Faithfully recreated the original 2007 Zenryaku Profile design from the archived website
   - Implemented table-based layout with precise styling to match the original
   - Used original title image and styling
   - Removed vertical text column as requested

2. **Nostr Protocol Integration**:
   - Fetches Kind 0 events (profiles) with all relevant fields
   - Displays Kind 1 events (notes) as a timeline
   - Shows Kind 3 events (contacts) as a friend list with mutual follow detection
   - Parses Kind 30000/30001 events (lists) for favorite things

3. **Functionality**:
   - Search by NPUB (replacing the original Profile ID search)
   - Tab-based navigation between profile sections
   - Markdown support for profile "about" section
   - NIP-05 verification display
   - Lightning address (Zap) support

4. **Links**:
   - "新規登録！" link points to https://nstart.me/ja
   - "管理人室" link points to https://metadata.nostr.com/

## Screenshots

![Zenryaku Profile Home](/home/ubuntu/screenshots/localhost_5173_175559.png)

## Technical Details

- Built with React, TypeScript, and Vite
- Uses nostr-tools for Nostr protocol interaction
- Styled with custom CSS to match the original design
- Connects to multiple public Nostr relays for data retrieval

## Link to Devin run
https://app.devin.ai/sessions/28cd9e7d41a24b009cd927f8d546c461

## Requested by
N (shohei_mihara@proton.me)
