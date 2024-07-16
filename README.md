# Guest room booking application Docker Compose Setup

🚀 This repository contains a Docker Compose configuration for deploying and running the Guest room booking application, which consists of backend services along with a MongoDB database.

## Prerequisites

Before getting started, ensure that you have the following installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

To run the Guest room booking application using Docker Compose, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/akil555/guest_room_booking_app
   ```
   ```

2. Build and start the containers using Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Once the containers are up and running, you can access the backend API at `http://localhost:5000`.

## Services

This Docker Compose setup includes the following services:

- **📦 db (MongoDB)**: A MongoDB database service.

- **🛠️ backend**: The backend service of the Guest room booking application built using the provided Dockerfile in the `server` directory.

## Configuration

The configuration for the application and its services can be found in the `docker-compose.yml` file. You can customize the ports, volumes, and other settings according to your requirements.

## Management

To manage the Docker Compose setup and its services, you can use the following commands:

- Start containers: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs [service_name]`
- List running containers: `docker-compose ps`
- Execute commands inside a container: `docker-compose exec [service_name] [command]`
--- 


🚀 refer postman to see the details of the endpoints.

for manual deployment :

Navigate to the repository directory:

 ```bash
   cd server
   ```

install the dependencies:

   ```bash
npm i
   ```

start the server:

   ```bash
 node server.js
   ```