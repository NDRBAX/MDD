# MDD Backend Setup Guide

This guide explains how to install and run the Spring Boot backend for the MDD project step by step.

## Prerequisites

Before starting, make sure you have the following tools installed on your machine:

- [Java JDK 23](https://www.oracle.com/java/technologies/javase/jdk23-archive-downloads.html) (as specified in pom.xml)
- [Maven](https://maven.apache.org/download.cgi) (version 3.8+)
- [MySQL](https://dev.mysql.com/downloads/) (version 8.0+ recommended)
- [Git](https://git-scm.com/downloads) (to clone the repository)
- [Node.js](https://nodejs.org/) (version 22.14.0)
- [npm](https://www.npmjs.com/) (version 11.2.0)

## Step 1: Clone the project

```bash
git clone https://github.com/NDRBAX/MDD.git
cd MDD
```

## Step 2: Create environment variables file

Create a `.env` file at the root of the project with the following content:

```
DB_DEV_NAME=MDD
DB_USER=root
DB_PASSWORD=XXX

JWT_KEY_ID=XXX
JWT_ACCESS_EXPIRATION_MILLISECONDS=900000
JWT_REFRESH_EXPIRATION_MILLISECONDS=604800000
JWT_ISSUER=http://localhost:8080
JWT_AUDIENCE=mdd-api
JWT_ALLOWED_ISSUERS=http://127.0.0.1:4200,http://localhost:4200,http://127.0.0.1:8080,http://localhost:8080
```

> **Note**: Replace `XXX` with your actual database password and JWT key ID.

## Step 3: Database configuration

1. Create a MySQL database for the project:

```sql
CREATE DATABASE MDD;
```

2. Make sure your MySQL server is running and accessible with the credentials specified in the `.env` file.

## Step 4: Generate JWT keys

The application requires public and private keys for JWT authentication. Follow these steps to generate them:

1. Navigate to the resources directory:

```bash
cd mdd-api/src/main/resources
```

2. Generate the private key:

```bash
openssl genrsa -out app-private.key 2048
```

3. Generate the public key from the private key:

```bash
openssl rsa -in app-private.key -pubout -out app-public.key
```

These commands will create two files in the resources directory:
- `app-private.key`: The private key used to sign JWTs
- `app-public.key`: The public key used to verify JWTs

> **Important**: Never commit these keys to your repository. If you're using Git, make sure these files are added to your `.gitignore` file.

## Step 5: Build and run the project

Navigate to the backend directory (according to your pom.xml, it should be in the root of the project):

```bash
cd back
```

Build the project with Maven:

```bash
mvn clean install
```

This command will:
1. Download all necessary dependencies
2. Install Node.js and npm if not already installed
3. Build the frontend application (in the ../front directory)
4. Compile the backend code and run tests
5. Create an executable JAR file

## Step 6: Launch the backend server

You can start the backend server in two ways:

### Option 1: Using Maven

```bash
mvn spring-boot:run
```

### Option 2: Running the JAR file

```bash
java -jar target/*.jar
```

The backend server should now start and be accessible at: http://localhost:8080


## Development workflow

For development purposes, the project uses Spring Boot DevTools which enables:

- Automatic restart when code changes
- Live reload capabilities

Additionally, when working on both frontend and backend:

```bash
# Run the backend with DevTools enabled
mvn spring-boot:run

# In a separate terminal, navigate to the frontend directory
cd ../front
npm run start
```

## Common troubleshooting

### Java version issues

Ensure you're using Java 23 as specified in the pom.xml:

```bash
java -version
```

### Database connection issues

If you encounter database connection errors:
- Check that your MySQL server is running
- Verify the credentials in the `.env` file
- Make sure the database named `MDD` exists

### Port already in use

If port 8080 is already in use, you can change the port in `application.properties`:

```properties
server.port=8081
```