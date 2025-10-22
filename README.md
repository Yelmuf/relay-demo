# 🎯 TODO App - React + Relay Demo

A modern, full-featured TODO application built with the latest web technologies.

![TODO App Screenshot](https://github.com/user-attachments/assets/deb0e0e0-d0db-4195-b90b-cff72687bd47)

## 🚀 Tech Stack

- **React** - Latest stable version of React with improved performance
- **React Router** - Client-side routing
- **Relay** - GraphQL client for efficient data fetching
- **Vite** - Fast build tool and dev server
- **GraphQL** - API query language
- **Express** - Backend server for GraphQL API

## ✨ Features

- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Edit existing todos (double-click or click edit button)
- ✅ Delete todos
- ✅ Separate active and completed sections
- ✅ Real-time statistics (active/completed count)
- ✅ Beautiful gradient UI design
- ✅ Responsive layout

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Yelmuf/relay-demo.git
cd relay-demo
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

Note: The `--legacy-peer-deps` flag is needed because React is relatively new and some dependencies haven't updated their peer dependency ranges yet.

3. Generate Relay artifacts:
```bash
npm run relay
```

## 🏃 Running the Application

### Development Mode

Start both the GraphQL server and Vite dev server:

```bash
npm start
```

Or run them separately:

```bash
# Terminal 1 - GraphQL Server
npm run server

# Terminal 2 - Vite Dev Server  
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- GraphQL Server: http://localhost:4000/graphql

### Production Build

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
relay-demo/
├── src/
│   ├── components/        # React components
│   │   ├── TodoList.jsx   # Main todo list with queries
│   │   ├── TodoItem.jsx   # Individual todo item with mutations
│   │   ├── TodoList.css   # Todo list styles
│   │   └── TodoItem.css   # Todo item styles
│   ├── __generated__/     # Relay generated files (auto-generated)
│   ├── App.jsx           # Main app component with routing
│   ├── App.css           # App styles
│   ├── main.jsx          # App entry point
│   └── RelayEnvironment.js # Relay environment configuration
├── server/
│   ├── schema.graphql    # GraphQL schema definition
│   └── index.js          # Express + GraphQL server
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── relay.config.js       # Relay compiler configuration
└── package.json          # Dependencies and scripts

```

## 🔧 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start GraphQL server
- `npm run relay` - Compile Relay GraphQL queries
- `npm start` - Start both servers (dev mode)

## 🎨 GraphQL Schema

The app uses a GraphQL API with the following operations:

### Queries
- `todos` - Fetch all todos
- `todo(id)` - Fetch a single todo by ID

### Mutations
- `addTodo` - Create a new todo
- `updateTodo` - Update todo text
- `toggleTodo` - Toggle todo completion status
- `deleteTodo` - Delete a todo

## 🔑 Key Concepts Demonstrated

1. **React Features** - Uses the latest React stable version
2. **Relay Data Fetching** - Efficient GraphQL queries with fragments
3. **Mutations** - Create, update, delete operations with Relay
4. **React Router** - Client-side navigation
5. **Vite Configuration** - Modern build setup with Babel plugin
6. **GraphQL Server** - Express server with graphql-http

## 📝 How It Works

1. **Relay Environment**: Configured to connect to the GraphQL server at `http://localhost:4000/graphql`
2. **GraphQL Queries**: `useLazyLoadQuery` hook fetches todos on component mount
3. **Mutations**: `useMutation` hook handles create, update, delete, and toggle operations
4. **Code Generation**: Relay compiler generates optimized code from GraphQL tags
5. **Routing**: React Router manages navigation (currently single route, extensible for more)

## 🐛 Known Limitations

- Page reloads after mutations (could be optimized with Relay's optimistic updates)
- Uses in-memory storage (data resets on server restart)
- Single route implementation (can be extended)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Team for React
- Relay Team for the powerful GraphQL client
- Vite Team for the amazing dev experience