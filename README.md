# Yoga Master Web Application

**Module number:** COM104  
**By:** p110136332  

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Scope](#scope)  
3. [In-Scope Features](#in-scope-features)  
4. [Technologies Used](#technologies-used)  
5. [Setup Instructions](#setup-instructions)  
   - [Prerequisites](#prerequisites)  
   - [Backend Setup](#backend-setup)  
   - [Frontend Setup](#frontend-setup)  
6. [Skeleton & Wireframes](#skeleton--wireframes)  
   - [Homepage Wireframe](#homepage-wireframe)  
   - [Login Page Wireframe](#login-page-wireframe)  
   - [Classes/Schedule Wireframe](#classesschedule-wireframe)  
   - [Contact Wireframe](#contact-wireframe)  
   - [Announcements Wireframe](#announcements-wireframe)  
   - [Bookings Wireframe](#bookings-wireframe)  
7. [Colour Scheme](#colour-scheme)  
8. [Testing Suite](#testing-suite)  
9. [Database Schema](#database-schema)  
10. [API Documentation](#api-documentation)  
    - [Authentication](#authentication)  
    - [Endpoints](#endpoints)  
    - [Example: List Classes](#example-list-classes)  
11. [Future Improvements](#future-improvements)  

---

## Project Overview

Yoga Master is a full-stack web application for a yoga studio that allows clients to sign up, browse yoga classes, book sessions, and purchase packages. Administrators (teachers and staff) can manage classes, view enrollments and post announcements.

## Scope

This website aims to deliver a simple user experience by making it extremely easy to navigate and reducing the number of pages the customer can go through as well as making it scalable so it can be further enhanced.

## In-Scope Features

- Home page that informs the user what the purpose of the web app is and the services it provides 
- A header with a menu that allows the user to navigate through the website 
- A login feature that allows the user to create their account to access the exclusive services provided by the web application
- Have admin users so that they can manage the web application by editing classes and announcements 
- Display the classes that the user can enrol in
- A payment page that allows users to purchase the services by accepting their card details and storing them safely 
- Responsive across multiple devices and resolutions 

## Technologies Used

- **Backend:** Django, Django REST Framework, SQLite  
- **Frontend:** React, React Router, React Bootstrap, Axios  
- **Authentication:** DRF Token Auth, JWT  
- **Payments:** Stripe API (test mode)  
- **Styling & Icons:** Bootstrap 5, React Icons  
- **Date Handling:** date-fns  

## Setup Instructions

### Prerequisites

- Node.js & npm  
- Python 3.10+ & pip  
- virtualenv or venv  

### Backend Setup

```bash
cd backend/
python -m venv .venv
# activate:
source .venv/bin/activate       # Linux/macOS
.venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Create and apply migrations
export DJANGO_SETTINGS_MODULE=yogamaster.settings
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend/
npm install

# Create a .env file:
# REACT_APP_API_URL=http://localhost:8000/api/
# REACT_APP_STRIPE_KEY=pk_test_YOUR_KEY

npm start
```

## Skeleton & Wireframes

The web app has a simple but efficient design that is easy to understand and navigate. The overall design is very user-friendly and follows Jakob Nielsen’s guidelines for usability and user experience. All the pages retain the same style and design as to create familiarity with the users and therefore avoid potential confusion while navigating through the app 


The home page is the main hub and the first thing the user sees when entering the webapp so it features all the information a new user should know about the site and provides the 2 main features at the header top which are the drop down menu which allows users to navigate throughout the site and the login button where they can either login or sign up. The header and footer stay present throughout all the pages as they possess important information and features that should be accessible anywhere within the webapp.

I designed simple wireframes to better envision my ideas for the layout of this webapp, all wireframes are mostly accurate, but the end product does deviate from some very slightly. The website does work in most resolutions including mobile but it was design and developed for the average computer monitor resolution of 1920x1080.


### Homepage Wireframe

![image](https://github.com/user-attachments/assets/904caa4a-4d60-4a21-88f0-0cfc2805c428)


### Login Page Wireframe

![image](https://github.com/user-attachments/assets/9b8105b9-132e-473f-85c6-7ac2a6780936)


### Classes/Schedule Wireframe

![image](https://github.com/user-attachments/assets/cac39b5c-662f-4a93-baa6-53b7278f7bb2)


### Contact Wireframe

![image](https://github.com/user-attachments/assets/d016bc1a-48a8-490a-975a-549734ef03a4)


### Announcements Wireframe

![image](https://github.com/user-attachments/assets/936bed57-9b4b-4339-9335-4ce81e352eea)


### Bookings Wireframe

![image](https://github.com/user-attachments/assets/69fb77a3-4ce5-46d9-98a5-463e07113d0d)


## Colour Scheme

For this webapp I was unsure on which colours to use, so I went for the extremely simple blacks and greys, as although they may be quite bland, these colours are easier on the eyes as they are not vibrant


![cors](https://github.com/user-attachments/assets/cd7147de-ebff-4f53-b1f2-c5609436c9e5)


## Testing 

### Google Lighthouse

I used Lighthouse to test my webapp on the user side in order to evaluate its performance, accessibility and best practices.
## Lighthouse Home

![image](https://github.com/user-attachments/assets/172dbeeb-ea25-4b2f-b276-e2d38c6f43f6)


## Lighthouse Schedule/Classes
  
![image](https://github.com/user-attachments/assets/d11fc0e9-5e5f-455e-960b-8c3195ec72fc)


## Lighthouse Bookings
  
![image](https://github.com/user-attachments/assets/3f9d56fe-e01f-4a5e-ae24-644fb6d025b4)

  
## Lighthouse Announcements

![image](https://github.com/user-attachments/assets/be0b35f9-6515-4fd6-83e9-9e6fe2c7d057)




## Database Schema

**Core models:**  
- **User** (`users.User`): `username`, `email`, `password`, `role`, `is_staff`  
- **YogaClass** (`classes.YogaClass`): `title`, `date`, `start_time`, `duration`, `capacity`, `instructor` (FK)  
- **Booking** (`bookings.Booking`): `user` (FK), `yoga_class` (FK), `timestamp`  
- **Announcement** (`announcements.Announcement`): `title`, `content`, `author` (FK), `timestamp`  
- **Package** (`payments.Package`): `name`, `price`, `description`  
- **Purchase** (`payments.Purchase`): `user` (FK), `package` (FK), payment metadata  

Configuration scripts:

```bash
python manage.py makemigrations
python manage.py migrate
```


## API Documentation

### Authentication

- **Obtain Token:**  
  `POST /api/token-auth/`  
  Payload: `{ "username": "...", "password": "..." }`  
  Response: `{ "token": "..." }`  

- **Protected endpoints:** include header `Authorization: Token <token>`

### Endpoints

| Method | URL                   | Description                                         |
| ------ | --------------------- | --------------------------------------------------- |
| GET    | `/api/classes/`       | List all upcoming classes (public)                  |
| POST   | `/api/bookings/`      | Book a class (authenticated)                       |
| GET    | `/api/bookings/`      | List user’s bookings (authenticated)               |
| GET    | `/api/announcements/` | List announcements (public)                        |
| POST   | `/api/announcements/` | Create announcement (staff only)                   |
| GET    | `/api/packages/`      | List pricing plans (public)                        |
| POST   | `/api/checkout/`      | Create purchase & PaymentIntent (authenticated)    |

### Example: List Classes

```bash
curl -X GET http://localhost:8000/api/classes/
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Vinyasa Flow",
    "date": "2025-04-25",
    "start_time": "06:00",
    "duration": 60,
    "capacity": 20,
    "instructor": 2,
    "instructor_name": "John",
    "spots_taken": 5,
    "spots_remaining": 15
  },
  ...
]
```

## Future Improvements

- To host the webapp on AWS or other hosting platforms 
- To implement OAuth2 social logins so that the user can log in with Google
- To implement Continuous Integration (GitHub Actions)
- Dockerize frontend & backend for easy deployment
- To send the announcements to the user’s email account automatically
- To implement/expand the test coverage for both the frontend and backend using the following methods  
  - **Backend:**
      - unit tests (` python manage.py test users classes bookings announcements payments`), 
      - Integration: DRF APIClient in tests/ directories.
  - **Frontend:**
      - Unit & Integration: (` npm test`) (Jest + React Testing Library).
      - End-to-End: Cypress or Playwright.
