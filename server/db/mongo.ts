import {
  Collection,
  Db,
  MongoClient,
  ObjectId,
  ServerApiVersion
} from "mongodb";

type UserDm = {
  userId: string;
  firstname: string;
  avatar: string;
  avatarBG: string;
};

export type Message = {
  _id?: ObjectId;
  room: string;
  from: UserDm;
  to: UserDm;
  text?: string;
  createdAt: Date;
};

const uri = process.env.MONGO_DB_URL;

if (!uri) {
  throw new Error("MONGO_DB_URL is not set");
}

let db: Db | null = null;
let messages: Collection<Message> | null = null;
let connected = false;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

export const initMongo = async () => {
  if (connected) return;

  try {
    await client.connect();
    console.log(" You successfully connected to MongoDB!");

    db = client.db("chatapp");
    messages = db.collection("messages");

    // keyset pagination by _id within room
    await messages.createIndex({ roomId: 1, _id: 1 });
    // time queries
    await messages.createIndex({ createdAt: 1 });

    connected = true;
  } catch (err) {
    console.log("Mongo init failed: " + err);
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
