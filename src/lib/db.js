import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

const client = new MongoClient(uri);
await client.connect();

const db = client.db('Roomora')
const collections = {
    users: db.collection('users'),
    bookings: db.collection('bookings'),
    hotels: db.collection('hotels'),
}

export default collections;