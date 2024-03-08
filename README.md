# CinemaApp - Delta Internship Project

## Project Overview

The VegaVision Cinema project is developed as part of the Delta Internship program at VegaIt with the goal of creating a comprehensive web application for managing cinema repertoire and facilitating ticket reservations. The project is divided into two main parts: the backend, referred to as cinema-back, and the frontend, referred to as cinema-front.

## Technologies Used

- Spring Boot
- ReactJS
- Java
- TypeScript
- PostgreSQL

## Repository Structure

- **cinema-back**: Contains the backend source code of the web application.
- **cinema-front**: Contains the frontend source code of the web application.

## Getting Started

1. Clone this repository to your local machine.
2. Set up the necessary environment for both backend and frontend:
    - For backend: Make sure you have Java and IntelliJ IDEA installed. Open the `cinema-back` project in IntelliJ IDEA.
    - For frontend: Make sure you have Node.js installed. Open a terminal and navigate to the `cinema-front` directory.
3. Install dependencies for each part:
    - For backend: Dependencies are managed using Maven. Simply let IntelliJ IDEA handle the dependencies.
    - For frontend: Run `npm install` to install all dependencies listed in `package.json`.
4. Configure the database settings for the backend:
    - Open `application.properties` file in `src/main/resources` directory of the backend project.
    - Configure your PostgreSQL database settings (e.g., URL, username, password).
5. Include your email address and password in the backend:
    - Open `application.properties` file in `src/main/resources` directory of the backend project.
    - Include your email address and password for sending email confirmations for reservations, password change etc.
6. Run both the backend and frontend applications:
    - For backend: Run the main class of the Spring Boot application.
    - For frontend: Run `npm start` command in the terminal. This will start the development server and open the application in your default web browser.
