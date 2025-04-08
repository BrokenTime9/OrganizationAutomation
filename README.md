---GitHub Organization Access Manager

--This project automates the process of managing access to a GitHub organization using data from a Google Spreadsheet. It reads user data from the spreadsheet and grants or revokes access based on the current state of the organization.

*Features

--Automatically grants access to new users listed in the spreadsheet

--Revokes access for users who are no longer listed

--Uses Google Sheets as the source of truth

--Secure configuration using environment variables

--Can be scheduled or integrated into CI/CD pipelines

*Prerequisites

--A GitHub Personal Access Token with admin:org and user scopes

--A Google Spreadsheet with a list of GitHub usernames

--A Google Sheets API key with access to the spreadsheet


*Setup

--Clone the repository

--Copy

--Edit

--git clone https://github.com/your-username/github-org-access-manager.git

--cd github-org-access-manager

--Install dependencies

--Copy

--Edit

--npm install


*Create a .env file in the root directory with the following content:



--Copy

--Edit

GITHUB_TOKEN=your_github_token

GITHUB_ORGANIZATION_NAME=your_org_name

SPREADSHEET_ID=your_google_sheet_id

GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key

--Run the script



--Copy

--Edit

--node index.js

--Spreadsheet Format

--Your spreadsheet must include at least one column named GitHub Username, with each row containing a valid GitHub username.


*Example:

GitHub Username

johndoe

janedoe

--You can optionally include other columns such as team name or role depending on your use case.


*Security

--Do not commit the .env file to version control.


--Store and manage credentials securely.


--Use a GitHub token with only the necessary permissions.


*Technologies Used

--Node.js


--GitHub REST API


--Google Sheets API


