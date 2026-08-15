# CloudVandana Salesforce CRUD Application

## Overview

This project is a full-stack CRUD application developed as part of the CloudVandana assignment.

The application provides a user interface to perform CRUD operations and integrates the backend with Salesforce.

## Technologies Used

### Backend

* Python
* FastAPI
* Salesforce REST API
* Pydantic
* Uvicorn

### Frontend

* React
* JavaScript
* HTML
* CSS

## Features

* Create a Salesforce record
* View/List Salesforce records
* Update a Salesforce record
* Delete a Salesforce record
* REST API based backend
* React-based frontend
* Salesforce integration
* Error handling and validation

## Project Structure

```text
CloudVandana-CRUD/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── package.json
│   ├── src/
│   └── ...
│
├── .gitignore
└── README.md
```

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows Git Bash:

```bash
source venv/Scripts/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and add the required Salesforce configuration.

**Do not commit the `.env` file to GitHub.**

Start the backend:

```bash
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm start
```

The frontend will run on the URL shown in the terminal.

## Salesforce Configuration

The application uses Salesforce credentials through environment variables.

Example:

```text
SALESFORCE_CLIENT_ID=your_client_id
SALESFORCE_CLIENT_SECRET=your_client_secret
SALESFORCE_USERNAME=your_username
SALESFORCE_PASSWORD=your_password
SALESFORCE_SECURITY_TOKEN=your_security_token
```

Never upload real credentials or secrets to GitHub.

## CRUD Operations

The application supports:

| Operation | Description                    |
| --------- | ------------------------------ |
| Create    | Create a new Salesforce record |
| Read      | Retrieve Salesforce records    |
| Update    | Modify an existing record      |
| Delete    | Delete an existing record      |

## API Documentation

Once the backend is running, API documentation can be accessed through:

```text
http://127.0.0.1:8000/docs
```

## Security

Sensitive credentials are stored in environment variables and are excluded from version control using `.gitignore`.

## Author

Pooja Bhosale
