import {
  MongoClient,
  ServerApiVersion,
  Db,
  Collection,
  ObjectId
} from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;
let messages: Collection | null = null;

export type MessageDoc = {
  _id?: ObjectId;
  room: string;
  from: string;
  to: string;
  text?: string;
  createdAt: Date;
};

export const initMongo = async (uri: string) => {
  try {
    if (client) return;

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

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
  if (!messages) throw new Error("Mongo not initialized");
  return messages;
};

export const saveMessage = async (doc: MessageDoc) => {
  const messages = getMessagesCollection();
  const toInsert = { ...doc, createdAt: doc.createdAt ?? new Date() };
  const res = await messages.insertOne(toInsert);
  return { ...toInsert, _id: res.insertedId };
};

export const getMessages = async (room: string) => {
  const messages = getMessagesCollection();
  const query = await messages.find({ room }).sort({ createdAt: 1 }).toArray();
  return query;
};
