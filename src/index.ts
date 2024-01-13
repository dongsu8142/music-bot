import dotenv from "dotenv";
dotenv.config();
import { BotClient } from "./client";

const client = new BotClient();

client.login(process.env.BOT_TOKEN);
