
# Gahbaz(جهبذ)


<div align="center">

[![Preview](screenshot.png)](https://elearningsystem.onrender.com)

**An integrated system for universities and institutions for distance learning and for managing the educational process.**

---

[![deploy](https://github.com/alshedivat/al-folio/actions/workflows/deploy.yml/badge.svg)](https://github.com/o2sa/gahbaz/actions/workflows/deploy.yml)
[![Maintainers](https://img.shields.io/badge/maintainers-4-success.svg)](#maintainers)
[![GitHub contributors](https://img.shields.io/github/contributors/alshedivat/al-folio.svg)](https://github.com/o2sa/gahbaz/graphs/contributors/)


[![GitHub release](https://img.shields.io/github/v/release/alshedivat/al-folio)](https://github.com/o2sa/gahbaz/releases/latest)
[![GitHub license](https://img.shields.io/github/license/alshedivat/al-folio?color=blue)](https://github.com/o2sa/al-folio/blob/version-two/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/o2sa/gahbaz)](https://github.com/o2sa/gahbaz)
[![GitHub forks](https://img.shields.io/github/forks/o2sa/gahbaz)](https://github.com/o2sa/gahbaz/fork)

</div>



---

# **E-Learning System for Universities**

## **Project Overview**

This project is an **e-learning system for universities**, built to manage online education processes, including course content, exams, student progress tracking, and real-time communication between students and teachers. The platform supports multiple user roles: students, teachers, and administrators, leveraging modern technologies for optimal performance, scalability, and user experience.

## **Main Features**
- **User Roles**: System Admin, Teachers, Students
- **Course Management**: Create, update, and manage course content
- **Exam Management**: Schedule and manage exams, automatic grading
- **Assignment Submissions**: Students can submit assignments, and teachers can review them
- **Real-time Chat**: Live chat between students and teachers using **Socket.IO**
- **Notifications System**: Real-time notifications for users
- **Cloud Storage**: Media storage for lectures, exams, and resources using **Cloudinary**
- **Analytics & Reports**: Generate student performance reports
- **Fully Responsive UI**: Built with **Mantine UI**
- **Deployed with Render** for seamless scalability

---

## **Technology Stack**

### **Backend**:
- **Node.js** & **Express.js**: For building the REST API and handling socket communication
- **MongoDB**: NoSQL database for storing user data, courses, exams, etc.
- **Mongoose**: ORM for MongoDB schema and data management
- **Socket.IO**: Real-time bidirectional communication for live chat
- **JWT Authentication**: Secure user authentication system

### **Frontend**:
- **React.js**: SPA architecture for dynamic, fast user experience
- **Mantine UI**: Component library for responsive and accessible UIs
- **React Query**: Efficient data fetching, caching, and synchronizing server state
- **Socket.IO Client**: Real-time communication for chat and live interactions

### **Cloud Services**:
- **Cloudinary**: Media storage for managing images and video files
  - [Cloudinary Link](https://cloudinary.com)

### **Design & Project Management**:
- **Figma**: UI/UX design, wireframes, and system diagrams
  - [Figma Designs](https://www.figma.com)
- **Jira**: Project management and issue tracking tool
  - [Jira Link](https://www.atlassian.com/software/jira)

### **DevOps & Deployment**:
- **GitHub**: Version control and collaboration
  - [GitHub Repository](https://github.com/your-repository)
- **Render**: Cloud platform for deploying the backend and frontend
  - [Render](https://render.com)

---

## **Real-time Chat System**

The platform includes a **real-time chat** feature that allows students and teachers to communicate instantly. This feature is powered by **Socket.IO**, which facilitates real-time, bidirectional event-based communication between the frontend and backend.

### **Socket.IO Overview**:
- **Backend (Node.js + Socket.IO)**: Manages socket connections and events between users (students, teachers).
- **Frontend (React + Socket.IO Client)**: Allows real-time message exchange, updates the chat UI in real-time.

---

## **System Architecture**

### **High-Level Architecture**
The system consists of:
1. **Frontend (React)**: Interacts with the backend via REST API and Socket.IO, handles routing, and UI rendering.
2. **Backend (Node.js, Express)**: Serves as the API provider, connects to the MongoDB database, handles business logic, and real-time chat through Socket.IO.
3. **Database (MongoDB)**: Stores all user data, courses, exams, submissions, and chat histories.
4. **Cloud Storage (Cloudinary)**: Stores media files such as images and videos uploaded by users.

You can view the full **system diagram** [here in Figma](https://www.figma.com/system-diagram).

### **Database Schema**
The core database entities:
- **Users**: Stores students, teachers, and admins
- **Courses**: Stores course details, syllabus, and materials
- **Exams**: Stores exam details, questions, and answers
- **Submissions**: Student submissions for assignments and exams
- **Messages**: Stores chat messages between users

---

## **File Structure**

```
e-learning-system/
├── client/              # Frontend code (React)
│   ├── src/
│   ├── public/
├── server/              # Backend code (Node.js, Express)
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request controllers
│   ├── routes/          # API endpoints
│   ├── sockets/         # Socket.IO events and logic
├── config/              # Environment configurations
├── README.md            # Project documentation
└── .env                 # Environment variables (not shared)
```

---

## **Installation & Setup**

### **1. Clone the Repository**:
```bash
git clone https://github.com/your-repository/elearning-system.git
cd elearning-system
```

### **2. Install Dependencies**:
```bash
npm run setup-project
```

### **3. Set Up Environment Variables**:
Create a `.env` file in the root directory:
```
MONGO_URI=<Your MongoDB connection string>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
```

### **4. Run the Project**:
```bash
npm run dev
```

This command will run both the frontend and backend servers concurrently. The real-time chat system will be available once the app is running.

---

## **Deployment on Render**

The project is deployed using **Render**:
- Backend: [API Link](https://your-api-url.onrender.com)
- Frontend: [Live App](https://your-app-url.onrender.com)

Refer to [Render's documentation](https://render.com/docs) for deployment details.

---

## **Features & Functionality**

### **User Authentication & Role Management**:
- JWT-based authentication
- Different permissions for admins, teachers, and students

### **Course Management**:
- Teachers can create, update, and delete courses.
- Students can view and enroll in courses.

### **Exams & Assignments**:
- Teachers can create exams with automatic grading.
- Students can submit assignments, which teachers can review and grade.

### **Real-time Chat (Socket.IO)**:
- Students and teachers can chat in real time.
- Message notifications and real-time updates on new messages.

### **Notifications System**:
- Real-time notifications for students and teachers (assignment due dates, grades).

### **Cloud Storage Integration (Cloudinary)**:
- Cloudinary is used for storing media files (lectures, assignments).
- [Cloudinary Docs](https://cloudinary.com/documentation)

### **Reports & Analytics**:
- Teachers and admins can generate reports for student performance.

---

## **Project Phases**

### **Phase 1: Planning & Requirements Gathering**
- **Output**: Detailed project requirements, user stories, and wireframes created in Figma.
  - Link to Figma designs: [Figma Wireframes](https://www.figma.com/your-project-wireframes)

### **Phase 2: Backend Setup**
- **Output**: Basic Node.js and Express API, MongoDB database, user authentication (JWT), and models for courses and exams.
  - Key Features: 
    - Authentication system (login, signup)
    - API endpoints for user, course, and exam management.

### **Phase 3: Frontend Development**
- **Output**: React app with routing, course listing, and user dashboards. Basic UI components using **Mantine UI**.
  - Key Features:
    - Responsive design
    - Basic views for courses, exams, and user profiles.

### **Phase 4: Integration of Cloudinary**
- **Output**: Integration with **Cloudinary** for storing images and videos (e.g., lecture materials, student submissions).
  - Key Features:
    - Upload media feature on course and exam creation pages.

### **Phase 5: Real-time Chat (Socket.IO)**
- **Output**: Integrated real-time chat system for communication between students and teachers.
  - Key Features:
    - Real-time message sending and receiving.
    - Notifications for new messages.

### **Phase 6: Notifications & Real-time Updates**
- **Output**: Notification system for students and teachers (e.g., upcoming assignments, grades).
  - Key Features:
    - Web notifications for important updates.

### **Phase 7: Final Testing & Deployment**
- **Output**: Thorough testing of the entire system (backend, frontend, and integration). Deployment on **Render**.
  - Key Features:
    - Test cases for all features.
    - CI/CD pipeline for auto-deploy on **Render**.

---

## **Contributing**

We welcome contributions from the community! To contribute:

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/elearning-system.git`
3. **Create a new branch**: `git checkout -b feature-name`
4. **Make your changes** and commit them
5. **Push to your fork** and submit a **pull request**

Please make sure your code follows our guidelines and is well-documented.

---


## **Useful Links**



- **API Documentation**: [Postman Collection](https://www.postman.com/)
- **Cloudinary Docs**: [Cloudinary Documentation](https://cloudinary.com/documentation)
- **Figma Design**: [Figma Link](https://www.figma.com)
- **Render Hosting**: [Render Documentation](https://render.com/docs)

