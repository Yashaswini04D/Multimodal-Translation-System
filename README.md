
This project is a full-stack translation system that supports both text and audio translation into regional languages. The application has a React (Vite) frontend for user interaction and a FastAPI backend to handle API requests.

## 🚀 Features
* **Text Translation**: Enter text and translate it into regional languages using Google Translate.
* **Audio Translation**: Speak into the app; speech is converted to text and translated into the target language.
* **Automatic Language Detection**: Detects the source language automatically before translation.

## 🛠 Tech Stack & Libraries

### 🔹 Frontend (React + Vite)
* **React** → Core UI library
* **Vite** → Fast bundler & dev server with HMR
* **JavaScript** → Type-safe development
* **CSS** → Styling and responsive layouts
* **Web Speech API (Browser)** → Captures speech and converts it into text (for audio input)

### 🔹 Backend (FastAPI + Python)
* **FastAPI** → Framework for creating REST APIs
* **googletrans==4.0.0-rc1** → Free Python library for Google Translate integration
* **Uvicorn** → ASGI server to run the backend

**check this out here**- https://multimodal-translation-system.vercel.app
