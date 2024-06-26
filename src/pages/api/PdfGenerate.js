const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
const nodemailer = require("nodemailer");
import puppeteer from "puppeteer";
import handlers from "handlebars";
import qrcode from "qrcode";
import { connectToDatabase } from "../../lib/mongodb";
import { authentication } from "../../lib/googleSheet";

const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options);
  const [datePart, timePart] = formattedDate.split(", ");
  const [month, day, year] = date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .split(" ");
  const [hour, minute, second] = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .split(":");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day.replace(
    ",",
    ""
  )}-${month.toUpperCase()}-${year} ${hour}:${minute}:${second}`;
};

// Function to generate a 4-digit random number as a string
const generateShortHash = (input) => {
  const hash = crypto.createHash("sha1").update(input).digest("hex");
  return hash.substring(0, 4);
};

// Function to generate a unique PDF ID
const generateUniquePDFId = () => {
  const uuid = uuidv4();
  const shortHash = generateShortHash(uuid);
  return shortHash;
};

const generateQR = async (formData) => {
  try {
    // Convert the form data to a JSON string
    const values = Object.values(formData).map((value) => String(value));
    const formattedData = values.join(" || ");
    const qrCodeDataUrl = await qrcode.toDataURL(formattedData);

    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error.message);
    throw error;
  }
};

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
  secure: true,
});

export default async function pdfGenerate(req, res) {
  const {
    date,
    endDate,
    phone,
    passNo,
    sourceAuction,
    permitHolder,
    name,
    address,
    route,
    vecNo,
    vehicleType,
    cubicContent,
  } = req.body;
  console.log(req.body);
  const { db } = await connectToDatabase();
  const pdfId = generateUniquePDFId();
  console.log(pdfId, "id");
  const formattedDate = formatDateString(date);
  const formattedEndDate = formatDateString(endDate);
  console.log("====================================");
  console.log(formattedDate + " - " + formattedEndDate);
  console.log("====================================");

  const qrCodeData = {
    pdfId: "",
    passNo,
    formattedDate: formattedDate + " - " + formattedEndDate,
    miningOffice: "BHADRAK",
    quarry: sourceAuction,
    licenseeName: permitHolder.toUpperCase(),
    mineral: "SAND",
    address: name + "," + address,
    route,
    vecNo,
    length: "NA",
    height: "NA",
    breadth: "NA",
    cubic: cubicContent,
    vehicleType,
    phone: "",
  };
  const qr = await generateQR(qrCodeData);
  console.log(qrCodeData);
  const { sheets } = await authentication();
  const filePath = path.join(process.cwd(), "src", "template", "pdf.html");
  try {
    // read our invoice-template.html file using node fs module
    const file = fs.readFileSync(filePath, "utf8");
    // const qrCodeHtml = `<img src="${qr}" alt="QR Code" style="width: 200px; height: 200px;" />`;
    // compile the file with handlebars and inject the customerName variable
    const template = handlers.compile(`${file}`);
    const html = template({
      formattedDate,
      formattedEndDate,
      phone,
      passNo,
      name,
      sourceAuction,
      permitHolder,
      address,
      route,
      vecNo,
      vehicleType,
      cubicContent,
      qr,
    });

    // simulate a chrome browser with puppeteer and navigate to a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pdfName = name + date + passNo;
    const fPdfName = pdfName.replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g, "-");
    console.log(fPdfName);

    // set our compiled html template as the pages content
    // then waitUntil the network is idle to make sure the content has been loaded
    await page.setContent(html, { waitUntil: "networkidle0" });

    // convert the page to pdf with the .pdf() method
    let pdf = await page.pdf({
      width: "1700",
      height: "1900",
      printBackground: true,
      landscape: true,
    });
    console.log(pdf, "create");

    fs.mkdirSync("./public/pdf", { recursive: true });
    fs.writeFileSync(`./public/pdf/${fPdfName}.pdf`, pdf);

    await browser.close();
    // Upload PDF to Google Drive
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEET_MAIL,
        private_key: process.env.GOOGLE_SHEET_KEY.replace(/\\n/g, "\n"),
      },
      scopes: "https://www.googleapis.com/auth/drive.file",
    });
    // const authClient = await auth.getClient({
    //   credentials,
    //   scopes: "https://www.googleapis.com/auth/drive",
    // });

    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: `${fPdfName}.pdf`,
      parents: ["1eXs8_ToKGkCEyIkZL-qYof3TNJeSXvid"], // Replace with the folder ID where you want to upload the PDF
    };

    const media = {
      mimeType: "application/pdf",
      body: fs.createReadStream(`./public/pdf/${fPdfName}.pdf`),
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id ,webViewLink",
    });
    const fileId = driveResponse.data.id;
    const webViewLink = driveResponse.data.webViewLink;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const mailData = {
      from: "webappphalgunisingh@gmail.com",
      to: "permitsand@gmail.com",
      subject: `New pdf Generated`,
      attachments: [
        {
          filename: `${fPdfName}.pdf`,
          path: `./public/pdf/${fPdfName}.pdf`,
          contentType: "application/pdf",
        },
      ],
      html: `<div>Hi ,</div><p>Congratulations!,</p> <p>New pdf has been generated kindly check the attachment</p>`,
    };
    let emailSent;
    transporter.sendMail(mailData, async function (err, info) {
      if (err) {
        console.log(err);
        emailSent = err.message;
        res.status(200).send({
          emailSent: emailSent,
        });
      } else {
        emailSent = `email sent successfully. ${info.messageId}`;
        fs.unlinkSync(`./public/pdf/${fPdfName}.pdf`);
      }
    });
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID1,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            pdfId,
            date,
            phone,
            passNo,
            name,
            address,
            route,
            vecNo,
            vehicleType,
            cubicContent,
            webViewLink,
          ],
        ],
      },
    });
    let myPost = await db.collection("pdfData").insertOne({
      pdfId,
      date: date - endDate,
      phone,
      passNo,
      name,
      address,
      route,
      vecNo,
      vehicleType,
      cubicContent,
      webViewLink,
    });

    res.status(200).json({ message: "file uploaded", qr: qr, status: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
