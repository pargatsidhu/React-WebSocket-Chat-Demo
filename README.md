# React WebSocket Chat Demo

This is a simple, real-time chat application built with React.js for the frontend and a Node.js WebSocket server for the backend. It's designed as a straightforward demonstration of full-stack communication using WebSockets, perfect for technical interviews or as a starting point for more complex projects.

## Features
- **Real-time Messaging:** Messages are sent and received instantly without page reloads.
- **Username Selection:** Users must enter a username before joining the chat.
- **Simple & Clean UI:** A responsive and intuitive chat interface.
- **Broadcast acks:** The server broadcasts messages to all connected clients.
- **Clear Separation:** The project is structured with separate directories for the client and server.

## Tech Stack
- **Frontend:**
  - React.js (with Hooks: `useState`, `useEffect`, `useRef`)
  - Standard CSS for styling
- **Backend:**
  - Node.js
  - `ws` library (a lightweight, popular WebSocket implementation)

## Project Structure
```
react-websocket-chat/
├── client/         # React App
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/         # Node.js WebSocket Server
│   ├── package.json
│   └── server.js
│
└── README.md
```

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites
- Node.js and npm (or yarn) installed.

### Installation & Running

You will need two terminal windows to run both the server and the client simultaneously.

1. **Clone the repository:**
   ```sh
   git clone <your-repository-url>
   cd react-websocket-chat
   ```

2. **Setup and run the Backend Server:**
   - Navigate to the server directory.
   - Install dependencies and start the server.
   ```sh
   cd server
   npm install
   node server.js
   ```
   The terminal should display: `Server started on port 8080...`

3. **Setup and run the Frontend Client:**
   - Open a **new terminal window**.
   - Navigate to the client directory.
   - Install dependencies and start the React app.
   ```sh
   cd client
   npm install
   npm start
   ```
   Your web browser should automatically open to `http://localhost:3000`.

4. **Start Chatting!**
   - Open two browser tabs to `http://localhost:3000`.
   - Enter a different username in each tab.
   - Send messages and watch them appear in real-time on both screens.

## How It Works

### Backend (`server.js`)
- The server uses the `ws` library to create a WebSocket server on `ws://localhost:8080`.
- When a new client connects (`wss.on('connection')`), the server logs the connection.
- When the server receives a message (`ws.on('message')`), it iterates through all connected clients and broadcasts the message to each one.

### Frontend (`App.js`)
- **State Management:** The application uses React Hooks (`useState`, `useRef`) to manage the user's login state, message history, and the current message input. The `useRef` hook is used to hold the WebSocket instance so it persists across re-renders without causing them.
- **Connection Lifecycle:** The `useEffect` hook manages the WebSocket connection.
  - It establishes a connection to `ws://localhost:8080` only after the user has "logged in".
  - It sets up event handlers (`onopen`, `onmessage`, `onclose`).
  - The `onmessage` handler parses the incoming JSON data and appends the new message to the `messages` state array, triggering a re-render to display it.
  - It returns a cleanup function to gracefully close the WebSocket connection when the component unmounts, preventing memory leaks.
- **UI:** The component conditionally renders either a login form or the main chat interface based on the `isLoggedIn` state.

## Possible Future Improvements
- Show a list of currently active users.
- Add "User is typing..." indicators.
- Store message history in a database (e.g., MongoDB or PostgreSQL).
- Implement private messaging between users.
- Add user authentication.
