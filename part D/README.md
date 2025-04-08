# Grocery Project

This project is a system for managing a grocery for a manager and suppliers using SQL Server, with both server-side and client-side components.

## Requirements

- **Node.js** 
- **SQL Server** 

## Setup Server

1. Create an `.env` file with the following content:
    ```env
    DB_SERVER=your_database_server_address
    DB_DATABASE=your_database_name
    DB_DRIVER={SQL Server Native Client 11.0}  # Or another SQL Server driver
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    node index.js
    ```

## Setup Client

1. Install dependencies for the client-side:
    ```bash
    npm install
    ```

2. Run the client application:
    ```bash
    npm run dev
    ```
