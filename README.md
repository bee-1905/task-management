
# 📝 MERN Task Manager

A full-stack task management web application built using the **MERN stack** – MongoDB, Express.js, React, and Node.js – with full user authentication and task CRUD functionality.

## 📌 Project Overview

This app allows users to register, log in securely, and manage their tasks. Each task can be created, edited, deleted, marked as completed, and filtered by status and priority. The app features a responsive UI and is deployed on Vercel (frontend) and Render (backend).

---

## 🚀 Live Demo

- **Frontend**: [Live on Vercel](https://your-client-url.vercel.app)
- **Backend API**: [Live on Render](https://your-server-url.onrender.com)

---

## 📂 Folder Structure

```

mern-task-manager/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── config/
│       ├── context/
│       ├── pages/
│       ├── utils/
│       ├── App.js
│       ├── index.js
│       ├── App.css
│       └── index.css
├── server/                 # Node.js backend
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
├── .env.example

````

---

## 🧰 Tech Stack

- **Frontend**: React, React Router, Context API, Axios, CSS
- **Backend**: Node.js, Express.js, JWT, MongoDB, Mongoose
- **Other**: dotenv, bcrypt, cors, nodemon

---

## 🔐 Authentication Features

- User registration with hashed password
- User login with JWT authentication
- Protected routes
- Fetching logged-in user's profile

---

## ✅ Task Management Features

- Create, read, update, delete (CRUD) tasks
- Mark tasks as completed/incomplete
- Filter tasks by status and priority
- Responsive UI with validation, loaders, and feedback messages

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mern-task-manager.git
cd mern-task-manager
````

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env  # Fill in values
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env  # Add REACT_APP_API_URL
npm start
```

---

## 🔐 API Endpoints

### Auth Routes

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register new user       |
| POST   | `/api/auth/login`    | Login existing user     |
| GET    | `/api/auth/profile`  | Get current user (auth) |

### Task Routes

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/tasks`            | Get all user tasks            |
| POST   | `/api/tasks`            | Create new task               |
| PUT    | `/api/tasks/:id`        | Update a task                 |
| DELETE | `/api/tasks/:id`        | Delete a task                 |
| PATCH  | `/api/tasks/:id/toggle` | Toggle task completion status |

---

## 📃 Features Summary

* 🔐 Secure login and registration
* 🗂️ Create/edit/delete tasks
* ✅ Mark tasks complete/incomplete
* 🔍 Filter tasks by status and priority
* 🌐 Responsive UI (mobile + desktop)
* 🧠 Context API-based state management

---

## ⚠️ Known Issues

* No drag-and-drop support
* No email notifications
* UI can be polished further

---

## ⏱️ Time Spent

| Task                     | Hours  |
| ------------------------ | ------ |
| Project Setup & Planning | 2      |
| Backend Development      | 6      |
| Frontend Development     | 8      |
| Testing & Debugging      | 2      |
| Deployment               | 1      |
| **Total**                | **19** |

---

## 📄 License

This project is open-source and free to use.

---

## 🤝 Contact

Built by Abeeerah Aamir (abeerah.aamir.91@gmail.com) – for internship assessment purposes.

