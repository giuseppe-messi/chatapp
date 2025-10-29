import { getMessagesCollection, type Message } from "../../db/mongo.js";

export const saveMessage = async (doc: Message) => {
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
