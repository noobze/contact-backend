// Importing expressjs & mysql2
const express = require("express");
const mysql = require('mysql2/promise');

// Importing dbConfig
const { dbConfig } = require("./config");

// Creating expressjs instance
const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.json());


/*
HTTP Request Methods (CRUD Mapping):

1. GET: Fetches data (read-only, e.g., view a user profile).
2. POST: Sends data to create a resource (e.g., submit a form).
3. PUT: Updates an entire resource (e.g., replace user details).
4. PATCH: Updates specific fields of a resource (e.g., update email).
5. DELETE: Removes a resource (e.g., delete a post).
6. OPTIONS: Checks available methods for a resource (e.g., CORS preflight).
7. HEAD: Fetches headers only (e.g., verify resource existence).
8. CONNECT/TRACE: Debugging or establishing tunnels (rarely used).

Best Practices:
- Use appropriate methods for each operation.
- Validate inputs and secure sensitive operations.
*/


// Specify Homepage
app.get("/" , (req , res)=>{
    res.send("Hello World!")
});


// Specifiy Routes
app.get("/hello" , (req , res)=>{
    res.send("Hello from /hello Route");
});


// A Post route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields (name, email, and message) are required." });
  }

  try {
      // Create a connection pool. 
      // Best practice is to keep a signle instance of db connection. 
      // (This implementation is kept simple)
      const pool = mysql.createPool(dbConfig);

      // Insert data into the database
      const query = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
      const [results] = await pool.execute(query, [name, email, message]);

      res.status(200).json({ message: "Your message has been received and saved to the database!" });
      
      // Close the connection
      pool.end();
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: "Failed to save the message." });
  }
});

// Get all Contacts Posted
app.get("/admin/fetch", async (req, res) => {
  try {
      // Create a connection pool
      const pool = mysql.createPool(dbConfig);

      // Query to fetch all contacts
      const query = "SELECT * FROM contacts";
      const [rows] = await pool.query(query);

      // Return the array of contacts
      res.status(200).json(rows);

      // Close the connection
      pool.end();
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch contacts." });
  }
});


/*
    Ports in the TCP/IP networking model range from 0 to 65535.

    - Ports are an extension of an IPv4 or IPv6 address, used to 
      differentiate between multiple services or applications running 
      on the same device.
    - Certain ports are reserved by the system and are commonly referred 
      to as "well-known ports" (0-1023). These are used for standard services 
      such as HTTP (port 80) and HTTPS (port 443).
    - Ports in the range 1024-49151 are referred to as "registered ports" and 
      are used by user applications or processes.
    - Ports in the range 49152-65535 are "dynamic" or "ephemeral" ports, 
      often used for temporary communication sessions.

    Proper management and understanding of port usage is crucial for 
    running servers and ensuring secure communication.
*/

// Start the server at port 3000 
if (!process.env.PROD) {
  app.listen(3000 , ()=>{
      console.log("Server Started at port 3000");
  })
}

module.exports = app;
