# Establish tool - Vue.js

A modern Vue.js application for YY-Establish service

## Features

- **Modern Vue.js 3** with Composition API
- **Tailwind CSS** for beautiful, responsive design
- **Pinia** for state management
- **Lazy loading** for optimal performance
- **JSON syntax highlighting** with Prism.js
- **Advanced filtering** by step type
- **Real-time search** with debouncing
- **Accordion interface** for log details
- **Docker support** for easy deployment

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone and navigate to the project
cd myna_viewer_vue

# Start the application
docker compose up --build

# Access the application
open http://localhost
```

### Manual Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Using Docker Compose

```bash
# Quick start
./start.sh

# Or manually
docker compose up --build
```

## Project Structure

```
src/
├── components/          # Vue components
│   ├── Header.vue      # Top navigation header
│   ├── Sidebar.vue     # Left sidebar with controls
│   └── LogViewer.vue   # Main log display component
├── stores/             # Pinia stores
│   └── logStore.js     # Log data management
├── views/              # Vue views
│   └── Home.vue        # Home page
├── router/             # Vue Router
│   └── index.js        # Route configuration
├── utils/              # Utility functions
├── main.js             # Application entry point
└── style.css           # Global styles
```

## Usage

1. **Paste Log Data**: Copy your log data into the textarea in the sidebar
2. **Parse**: Click "Parse" or press Enter to process the logs
3. **Filter**: Use the step filter to show specific types of requests
4. **Search**: Use the search box to find specific logs
5. **Sort**: Choose sorting criteria and direction
6. **View Details**: Click on any log entry to see detailed information

## Performance Features

- **Lazy Loading**: Accordion content loads only when opened
- **Virtual Scrolling**: Only renders first 50 items initially
- **Debounced Search**: Prevents excessive re-rendering
- **Efficient Parsing**: Optimized CSV parsing algorithm

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint code
npm run lint

# Build for production
npm run build
```

## Docker

The application includes Docker support for easy deployment:

- **Development**: `docker-compose up` (with hot reload)
- **Production**: Build and deploy the built application

## Technologies Used

- Vue.js 3
- Vite
- Tailwind CSS
- Pinia
- Prism.js
- Docker
- Nginx
