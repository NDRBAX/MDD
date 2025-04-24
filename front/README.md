# MDD Frontend Setup Guide

This guide explains how to set up and run the Angular (v18.2) frontend for the MDD project during development. These instructions assume you've already set up the backend according to the backend documentation.

## Prerequisites

Before starting, make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/) (version compatible with Angular 18)
- [npm](https://www.npmjs.com/) (latest stable version)
- [Angular CLI](https://angular.io/cli) (compatible with Angular 18, install using `npm install -g @angular/cli`)

## Step 1: Navigate to the frontend directory

If you've already cloned the repository for the backend setup, navigate to the frontend directory:

```bash
cd mdd/front
```

If you haven't cloned the repository yet:

```bash
git clone https://github.com/NDRBAX/MDD.git
cd mdd/front
```

## Step 2: Install dependencies

Install all the required dependencies:

```bash
npm install
```

This command will install all the dependencies needed for the Angular application, including Angular Material components used throughout the project.

## Step 3: Proxy Configuration

The project uses a proxy configuration for development to handle API requests. Check the proxy configuration in `src/proxy.config.json` to ensure it points correctly to the backend:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

This configuration will redirect all `/api` requests from  frontend to the backend server running on port 8080.

## Step 4: Start the development server

Make sure your backend is running on port 8080 as described in the backend documentation, then start the Angular development server:

```bash
npm start
```

This will execute `ng serve` with the proxy configuration automatically applied. The application will be compiled and the development server will start on port 4200.

## Step 5: Access the application

Open your browser and navigate to:

```
http://localhost:4200
```

The Angular application should load and connect to your backend running on port 8080 through the configured proxy.
