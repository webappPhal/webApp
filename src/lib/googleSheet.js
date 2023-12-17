import { google } from "googleapis";
console.log(
  process.env.GOOGLE_SHEET_MAIL,
  process.env.GOOGLE_SHEET_KEY,
  "google sheet"
);
export const authentication = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEET_MAIL,
      private_key: process.env.GOOGLE_SHEET_KEY.replace(/\\n/g, "\n"),
    },
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  return { sheets };
};
