
import { MongoClient } from "mongodb";

// MongoDB Atlas connection string
const url = "mongodb+srv://muhammadnabim81_db_user:<PASSWORD>@usermanagementcluster.xtxasjp.mongodb.net/";

// MongoDB client
const client = new MongoClient(url);

// Database name
const dbName = "productcatalog";

async function main() {
    try {
        // Connect to MongoDB Atlas
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        // Select database
        const db = client.db(dbName);

        // Test database connection
        await db.command({ ping: 1 });
        console.log(`Database "${dbName}" is ready!`);

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    } finally {
        await client.close();
    }
}

main();
