const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = "Sheet1!A2:D";

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

let previousData = null;

async function processUsers(users) {
  for (const user of users) {
    const { username, status } = user;

    if (status === "active") {
      await inviteUser(username);
    } else if (status === "inactive") {
      await removeUser(username);
    }
  }
}

async function inviteUser(username) {
  try {
    const res = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/memberships/${username}`,
      {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ role: "member" }),
      },
    );

    if (res.ok) {
      console.log(`Invited or updated ${username}`);
    } else {
      const error = await res.json();
      console.error(`Failed to invite ${username}: ${error.message}`);
    }
  } catch (err) {
    console.error(`Error inviting ${username}:`, err.message);
  }
}

// Remove user from GitHub org
async function removeUser(username) {
  try {
    const res = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/members/${username}`,
      {
        method: "DELETE",
        headers: HEADERS,
      },
    );

    if (res.status === 204) {
      console.log(`Removed ${username}`);
    } else if (res.status === 404) {
      console.log(`${username} is not in the organization`);
    } else {
      const error = await res.json();
      console.error(`Failed to remove ${username}: ${error.message}`);
    }
  } catch (err) {
    console.error(`Error removing ${username}:`, err.message);
  }
}

// Fetch Google Sheet data

const getData = async () => {
  try {
    console.log("getting data");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);

    if (data?.values) {
      const dataString = JSON.stringify(data.values);
      if (dataString !== previousData) {
        previousData = dataString;

        const users = data.values.map(([, username, , status]) => ({
          username: username,
          status: status,
        }));

        await processUsers(users);
      } else {
        console.log("No changes in data");
      }
    } else {
      console.log("Error in response:", data);
    }
  } catch (e) {
    console.error("Error fetching Google Sheets data:", e.message);
  }
};

setInterval(getData, 60000);
getData();
