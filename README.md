# 🏥 Medical Intelligence Robotic Automation

An AI-powered Health Prediction application built with **FastAPI**, **SQLite**, **SQLAlchemy**, and **Groq AI**. It allows users to manage patient records and generate AI-based health assessments from blood test parameters.

---

## ✨ Features

* Patient CRUD (Create, Read, Update, Delete)
* AI-generated health assessment using Groq API
* Risk level classification (Low / Moderate / High Risk)
* Dashboard with patient statistics
* Input validation using Pydantic
* SQLite database with SQLAlchemy ORM
* Interactive API documentation (Swagger UI)

---

## 🧠 Tech Stack

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* Groq API
* HTML / CSS / JavaScript

---

## 📁 Project Structure

```text
Medical-Intelligence-Robotic-Automation/
│
├── app/
│   ├── static/
│   ├── __init__.py
│   ├── ai_service.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
│
├── requirements.txt
├── README.md
├── .gitignore
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Jayasingh174/Medical-Intelligence-Robotic-Automation.git
cd Medical-Intelligence-Robotic-Automation
```

### Create virtual environment

```bash
python -m venv venv
```

### Activate virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Environment variables

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

---

## 🚀 Run the Application

```bash
uvicorn app.main:app --reload
```

---

## 🌐 Access Links

* Application: http://127.0.0.1:8000
* Swagger Docs: http://127.0.0.1:8000/docs

---

## 📡 API Endpoints

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | /api/patients      | Get all patients     |
| GET    | /api/patients/{id} | Get patient by ID    |
| POST   | /api/patients      | Create a patient     |
| PUT    | /api/patients/{id} | Update a patient     |
| DELETE | /api/patients/{id} | Delete a patient     |
| GET    | /api/stats         | Dashboard statistics |

---

## 🧪 Validation Rules

* Email format validation
* Date of birth validation (no future dates)
* Required field validation
* Blood test value range validation

---

## 👨‍💻 Author

**Jaya Singh**

AI Engineer | Backend Developer | Generative AI

* Python
* FastAPI
* SQLAlchemy
* AI/ML
* RAG
* LangChain
* LangGraph
* Docker

---

## 🏁 Project Status

Developed as part of the **Junior AI/ML Developer Technical Assessment**.
