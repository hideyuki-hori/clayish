# Clayish

![](/ss.png)

Clayish is a real-time, collaborative web application where users can manipulate a clay-like object together. Built with Cloudflare Workers, Hono, and SolidJS, it demonstrates the power of WebSocket communication in a serverless environment.

## Acknowledgements

- Thanks to [minami](https://www.instagram.com/minamocat.work/) for the cute color scheme
- Inspired by various real-time collaborative applications and games

## Features

- Real-time collaboration: Multiple users can interact with the clay object simultaneously
- Four interactive tools:
  - Rotate the object
  - Pull the clay
  - Push the clay
  - Change color and brush size
- WebSocket communication for instant updates across all connected clients
- Serverless architecture using Cloudflare Workers and Durable Objects

## Technologies Used

- **Backend**: 
  - Cloudflare Workers
  - Hono framework
  - Durable Objects for WebSocket management
- **Frontend**:
  - SolidJS
  - RxJS for reactive programming
  - solid-styled-components for styling

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`


## License

This project is licensed under the MIT License.
