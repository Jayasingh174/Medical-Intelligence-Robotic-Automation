<<<<<<< HEAD
# Medical Intelligence Robotic Automation

An AI-powered Health Prediction application built with **FastAPI**, **SQLite**, **SQLAlchemy**, and **Grok AI**. The application allows users to manage patient records and generate AI-based health assessments from blood test parameters.
=======
````md
# 🏥 Medical Intelligence Robotic Automation
<!-- IMPROVED: Added emoji for better visual hierarchy and recruiter engagement -->

An AI-powered Health Prediction application built with **FastAPI**, **SQLite**, **SQLAlchemy**, and **Groq AI**.
It allows users to manage patient records and generate AI-based health assessments from blood test parameters.

<!-- IMPROVED: Slightly simplified wording for clarity -->
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

---

## ✨ Features
<!-- IMPROVED: Section renamed for better presentation -->

- Patient CRUD (Create, Read, Update, Delete)
<<<<<<< HEAD
- AI-generated health assessment using Grok API
- Risk level classification (Low Risk / Moderate Risk / High Risk)
- Dashboard with patient statistics
- Input validation using Pydantic
- SQLite database with SQLAlchemy ORM
- Interactive API documentation with Swagger UI
=======
- AI-generated health assessment using Groq API
- Risk level classification (Low / Moderate / High Risk)
- Dashboard with patient statistics
- Input validation using Pydantic
- SQLite database with SQLAlchemy ORM
- Interactive API documentation (Swagger UI)

<!-- IMPROVED: Removed redundancy and improved readability -->
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

---

## 🧠 Tech Stack
<!-- IMPROVED: Better naming consistency -->

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
<<<<<<< HEAD
- Grok API
- HTML
- CSS
- JavaScript

---

## Project Structure
=======
- Groq API
- HTML / CSS / JavaScript

---

## 📁 Project Structure
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

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
<<<<<<< HEAD
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/Jayasingh174/Medical-Intelligence-Robotic-Automation.git
cd Medical-Intelligence-Robotic-Automation
```

### Create a virtual environment
=======
````

<!-- IMPROVED: Structure is good, no changes needed -->

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Jayasingh174/Medical-Intelligence-Robotic-Automation.git
cd Medical-Intelligence-Robotic-Automation
```

### Create virtual environment
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

```bash
python -m venv venv
```

<<<<<<< HEAD
### Activate the virtual environment
=======
### Activate virtual environment
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

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

<<<<<<< HEAD
### Create a `.env` file
=======
### Environment variables

Create a `.env` file:
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

```env
GROQ_API_KEY=your_api_key_here
```

<<<<<<< HEAD
### Run the application
=======
<!-- IMPROVED: renamed section for clarity -->

---

## 🚀 Run the Application
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

```bash
uvicorn app.main:app --reload
```

---

<<<<<<< HEAD
## Open the Application

Application:

```
http://127.0.0.1:8000
```

Swagger API Docs:

```
http://127.0.0.1:8000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/patients | Get all patients |
| GET | /api/patients/{id} | Get patient by ID |
| POST | /api/patients | Create a patient |
| PUT | /api/patients/{id} | Update a patient |
| DELETE | /api/patients/{id} | Delete a patient |
| GET | /api/stats | Dashboard statistics |

---

## Validation

- Email validation
- Date of birth validation
- Required field validation
- Blood test value validation
=======
## 🌐 Access Links

* Application: http://127.0.0.1:8000
* Swagger Docs: http://127.0.0.1:8000/docs

<!-- IMPROVED: clearer section grouping -->

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
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

---

## 🧪 Validation Rules

* Email format validation
* Date of birth validation (no future dates)
* Required field validation
* Blood test value range validation

<!-- IMPROVED: clearer wording -->

---

## 👨‍💻 Author

**Jaya Singh**

AI Engineer | Backend Developer | Generative AI

<<<<<<< HEAD
- Python
- FastAPI
- SQLAlchemy
- AI/ML
- RAG
- LangChain
- LangGraph
- Docker
=======
* Python
* FastAPI
* SQLAlchemy
* AI/ML
* RAG
* LangChain
* LangGraph
* Docker
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)

<!-- IMPROVED: consistent formatting -->

---

<<<<<<< HEAD
Developed as part of the **Junior AI/ML Developer Technical Assessment**.
=======
## 🏁 Project Status

Developed as part of the **Junior AI/ML Developer Technical Assessment**

<!-- IMPROVED: added clear closing section for recruiters -->

```
```
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)
"# Medical-Intelligence-Robotic-Automation" 
