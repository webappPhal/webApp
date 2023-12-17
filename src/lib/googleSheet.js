import { google } from "googleapis";
import "dotenv/config";

export const authentication = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: JSON.parse(process.env.GOOGLE_SHEETS_KEY),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  return { sheets };
};
