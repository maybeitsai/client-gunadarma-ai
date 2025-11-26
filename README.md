# Chatbot Universitas Gunadarma

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-black?logo=bun)](https://bun.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

A modern chatbot web application designed to help students, staff, and visitors access academic and campus-related information from Universitas Gunadarma. Built with React, TypeScript, and powered by AI.

## ✨ Features

- **ChatGPT-like Interface** — Clean, intuitive chat experience with smooth message flow
- **Dark/Light Theme** — Toggle between themes for comfortable viewing in any environment
- **Conversation History** — Save and manage your chat sessions locally
- **Search Conversations** — Quickly find past conversations with search functionality
- **Markdown Support** — Rich text rendering for formatted responses
- **Source References** — AI responses include helpful links to official sources
- **Loading Indicators** — Visual feedback during message processing
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices

## 📸 Screenshots

> _Screenshots coming soon_

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Package Manager:** Bun
- **Styling:** TailwindCSS + shadcn/ui components
- **Icons:** Lucide React
- **Architecture:** Feature-based / Domain-Driven Design
- **State Management:** Custom React hooks
- **Theming:** Context API with localStorage persistence

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Backend API server running (default: `http://localhost:8000`)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/maybeitsai/client-gunadarma-ai.git
cd client-gunadarma-ai
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
bun run build
```

The production-ready files will be generated in the `dist/` directory.

## 📁 Project Structure

```
frontend-react/
├── public/              # Static assets
├── src/
│   ├── features/        # Feature-based modules
│   │   ├── chat/        # Chat feature (components, hooks, services)
│   │   └── documents/   # Documents feature
│   ├── pages/           # Page components
│   ├── shared/          # Shared utilities and UI components
│   │   ├── hooks/       # Reusable custom hooks
│   │   ├── lib/         # Utility functions
│   │   ├── providers/   # Context providers
│   │   └── ui/          # Shared UI components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── components.json      # shadcn/ui configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## 🏗️ Architecture

This project follows a **feature-based architecture** where code is organized by features rather than technical layers. Each feature is self-contained with its own components, hooks, services, and types, promoting:

- **Modularity** — Features are independent and easy to modify
- **Scalability** — New features can be added without affecting existing ones
- **Maintainability** — Related code stays together, making it easier to understand
- **Reusability** — Shared code lives in the `shared/` directory

## 🔌 API Integration

The application communicates with a backend API to process user queries. Messages are sent to the API endpoint, which returns AI-generated responses along with relevant source links.

**Default API Endpoint:**

```
POST http://localhost:8000/api/v1/ask
```

Request format:

```json
{
  "question": "User's question here"
}
```

To configure a different API endpoint, update the base URL in `src/features/chat/services/chatApi.ts`.

## 🎨 Theming

The application supports both light and dark themes. Users can toggle between themes using the theme switcher in the interface. Theme preference is saved locally and persists across sessions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

Please ensure your code follows the existing style and passes linting checks.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- **Universitas Gunadarma** — For providing the institutional context and requirements
- **shadcn/ui** — For the beautiful, accessible component library
- **Lucide** — For the comprehensive icon set
- **Bun** — For the blazing-fast JavaScript runtime and package manager
