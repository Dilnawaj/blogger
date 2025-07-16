# Blogging Application

This is a full-stack application for managing and posting blogs. The app allows bloggers to post unlimited content and includes user functionalities such as downloading, subscribing, commenting, liking, and sharing.

## Prerequisites

Before running this application, ensure you have the following installed:

### Backend
- JAVA
- SpringBoot
- Logger
- MySQL
- Redis
- Swagger
- JWT

### Frontend
- React Js
- JavaScript
- HTML
- CSS

## 📦 **Microservices Modules**

| Module | Purpose |
|-------|--------:|
| **API Gateway** |All the request firstly pass through this Gateway|
| **Candidate Service** | Register and manage candidates |
| **Voter Service** | Register voters, check eligibility |
| **Vote Casting Service** | Accept votes, validate voters |
| **Vote Processor Service** | Process and forward votes |
| **Result Service** | Aggregate and display election results |
| **Notification Service** |Sending email to Candidate & Voters |

All services communicate via **Kafka topics** to ensure decoupled, scalable architecture.

---

## 📧 **Features**
- Modular microservices design for independent scaling & deployment
- Real-time vote processing with Kafka
- Redis cache for faster data retrieval
- Email notifications to voters and candidates on registration and voting
- React.js frontend for interactive dashboards
- Service discovery & fault tolerance (Eureka + Resilience4j)

---

## Running the React App

To run the React app, follow these steps:
1. Set up the environment variable `REACT_APP_CLIENT_KEY` using your Google Client ID, and `REACT_APP_SERVER_NAME` to specify where your backend code is deployed, such as http://localhost:5000/.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   npm install
3. npm start

To run the React Backend app, follow these steps:
1. Open the bloggerBackend directory, It contains the Spring Boot application.
2. Run MySql server and create database blog_app_apis.
3.Download Redis Cache using this URL -> https://github.com/MicrosoftArchive/redis/releases 
4. Setup Smtp using Email and AppPassword & clientId(for google)
5. Set Email's AppPassword, Google clientId & JWT key into Application properties file 
6. After Adding all the credentials in Application properties file ,Run spring boot app using below commands:
   ```bash
   mvn clean install -U(if needed)
   mvn clean install
   mvn spring-boot:run
