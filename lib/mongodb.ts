import { MongoClient, Db } from "mongodb";

// Singleton pattern for MongoDB connection to prevent connection pool exhaustion
const globalForMongo = global as unknown as {
  mongoClient: MongoClient | undefined;
  mongoClientPromise: Promise<MongoClient> | undefined;
};

const uri = process.env.DATABASE_URL!;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalForMongo.mongoClientPromise) {
    client = new MongoClient(uri);
    globalForMongo.mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo.mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("selectionv2");
}

export { clientPromise };
