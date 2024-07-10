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

## Running the React App

To run the React app, follow these steps:

1. Set up environment variables `REACT_APP_CLIENT_KEY` and `REACT_APP_API_KEY`.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   npm install
3. npm start

To run the React Backend app, follow these steps:
1. Run MySql server and create database blog_app_apis.
2. setup App Password and run spring boot app using below commands:
   ```bash
   mvn clean install -U(if needed)
   mvn clean install
   mvn spring-boot:run
3. Setup Smtp using Email and AppPassword & clientId(for google)