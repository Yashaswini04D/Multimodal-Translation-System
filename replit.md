# Overview

This is a full-stack translation application that combines a React frontend with a FastAPI backend. The frontend provides a user-friendly interface for text translation, while the backend handles translation requests using the Google Translate API through the `googletrans` library. The application supports multiple languages and provides real-time translation capabilities with automatic language detection.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React 18 with Vite as the build tool and bundler. Key architectural decisions include:

- **React with Vite**: Chosen for fast development with Hot Module Reloading (HMR) and optimized builds
- **TypeScript Support**: Configured for type safety while allowing JavaScript files (.jsx) for flexibility
- **Component-Based Structure**: Modular React components for maintainable and reusable UI elements
- **CSS Styling**: Custom CSS with modern design patterns including gradients, backdrop filters, and responsive layouts

## Backend Architecture
The backend uses FastAPI with Python, providing a RESTful API for translation services:

- **FastAPI Framework**: Selected for automatic API documentation, fast performance, and modern Python async support
- **CORS Middleware**: Configured to allow cross-origin requests from the frontend
- **Pydantic Models**: Used for request/response validation and serialization
- **Translation Service**: Integrates with Google Translate through the `googletrans` library

## Development Setup
- **Proxy Configuration**: Vite dev server proxies `/api` requests to the FastAPI backend running on port 8000
- **Hot Reloading**: Both frontend and backend support live reloading during development
- **Host Configuration**: Server configured to accept connections from any host (0.0.0.0) for Replit compatibility

## API Design
The backend exposes several endpoints:
- `GET /`: Health check endpoint
- `GET /languages`: Returns available translation languages
- `POST /translate`: Handles translation requests with automatic language detection

# External Dependencies

## Frontend Dependencies
- **React**: Core UI library for building the user interface
- **React DOM**: DOM rendering for React components
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and enhanced development experience

## Backend Dependencies
- **FastAPI**: Web framework for building the API
- **googletrans**: Python library for accessing Google Translate services
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for running the FastAPI application

## Third-Party Services
- **Google Translate API**: Accessed through the `googletrans` library for translation functionality
- **Language Detection**: Automatic source language detection provided by Google Translate