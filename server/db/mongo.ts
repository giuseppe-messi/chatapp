import {
  MongoClient,
  ServerApiVersion,
  Db,
  Collection,
  ObjectId
} from "mongodb";

export type Message = {
  _id?: ObjectId;
  room: string;
  from: string;
  to: string;
  text?: string;
  createdAt: Date;
};

const uri = process.env.MONGO_DB_URL || "";
let db: Db | null = null;
let messages: Collection | null = null;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

export const initMongo = async () => {
  try {
    await client.connect();
    console.log(" You successfully connected to MongoDB!");

    db = client.db("chatapp");
    messages = db.collection("messages");

    // keyset pagination by _id within room
    await messages.createIndex({ roomId: 1, _id: 1 });
    // time queries
    await messages.createIndex({ createdAt: 1 });
  } catch (err) {
    console.log("Something wrong: " + err);
  }
};

export const getMessagesCollection = () => {
  if (!messages) throw new Error("Mongo not initialized!");
  return messages;
};

// graceful shutdown
process.on("SIGINT", async () => {
  await client?.close();
  console.log("MongoDB connection closed due to app termination!");
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await client?.close();
  console.log("MongoDB connection closed due to app termination!");
  process.exit(0);
});
