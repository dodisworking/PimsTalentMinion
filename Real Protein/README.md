# Talent Tracker Web Application

A web application for managing talent auditions with team-based rating system. This application connects to Google Sheets to display talent information and allows team members to rate and comment on talent submissions.

## Features

- **Talent Display**: View talent information including headshots, demographics, and contact details
- **Team Rating System**: Five team members (Claire, Olivia, Fran, Victor, Lauren) can rate talent as Yes/No/Maybe
- **Notes System**: Each team member can add personal notes for each talent
- **Automatic Averaging**: System calculates majority-based average ratings
- **Advanced Filtering**: Filter by role, age, gender, ethnicity, country, and rating
- **Responsive Design**: Blue and gold themed interface that works on desktop and mobile

## Setup Instructions

### Step 1: Google Apps Script Setup

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1r8nevJ24_wmIcHhmGtms6qwT3sJohEMeO9uvqZnMB9g/edit?usp=sharing

2. Go to **Extensions** > **Apps Script**

3. Delete any existing code and paste the contents of `Code.gs` into the editor

4. Save the project (Ctrl+S or Cmd+S)

### Step 2: Deploy as Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**

2. Click the gear icon next to "Type" and select **Web app**

3. Set the following options:
   - **Execute as**: Me
   - **Who has access**: Anyone with the link

4. Click **Deploy**

5. **IMPORTANT**: Copy the web app URL that appears after deployment - you'll need this!

### Step 3: Update HTML File

1. Open the `index.html` file in a text editor

2. Find the line that says:
   ```html
   <script src="YOUR_DEPLOYED_WEB_APP_URL"></script>
   ```

3. Replace `YOUR_DEPLOYED_WEB_APP_URL` with the actual URL from Step 2

4. Save the file

### Step 4: Access the Application

1. Open the `index.html` file in your web browser
2. The application will load talent data from your Google Sheet
3. Select your profile from the dropdown to start rating talent

## Google Sheet Structure

The application expects the following column structure in the "Auditions" tab:

| Column | Field | Description |
|--------|-------|-------------|
| A | Role/Character | The role or character name |
| B | Talent Name | Name of the talent |
| C | Age | Age of the talent |
| D | Gender | Gender of the talent |
| E | Ethnicity | Ethnicity of the talent |
| F | Country | Country of the talent |
| G | Link/Handle | Social media or portfolio link |
| H | Headshot | Google Drive link to headshot image |
| I | (Unused) | Reserved column |
| J | Overall Rating | Auto-calculated overall rating |
| K | Average Rating | Auto-calculated average rating |
| L | Claire Rating | Claire's rating (Yes/No/Maybe) |
| M | Olivia Rating | Olivia's rating (Yes/No/Maybe) |
| N | Fran Rating | Fran's rating (Yes/No/Maybe) |
| O | Victor Rating | Victor's rating (Yes/No/Maybe) |
| P | Lauren Rating | Lauren's rating (Yes/No/Maybe) |
| Q | Claire Notes | Claire's notes |
| R | Olivia Notes | Olivia's notes |
| S | Fran Notes | Fran's notes |
| T | Victor Notes | Victor's notes |
| U | Lauren Notes | Lauren's notes |

## How to Use

### Rating Talent

1. Select your profile from the dropdown (Claire, Olivia, Fran, Victor, or Lauren)
2. Browse through the talent cards
3. Click **Yes**, **No**, or **Maybe** to rate each talent
4. Add notes in the text area below the rating buttons
5. Your ratings and notes are automatically saved to the Google Sheet

### Filtering

Use the filter controls at the top to narrow down talent:
- **Role/Character**: Filter by specific roles
- **Age**: Filter by exact age
- **Gender**: Filter by gender
- **Ethnicity**: Filter by ethnicity
- **Country**: Filter by country
- **Rating**: Filter by average rating (Yes/No/Maybe)

### Rating System

- Each team member can rate talent as **Yes**, **No**, or **Maybe**
- The system automatically calculates the majority vote
- If there's a tie, no rating is shown
- The average rating appears in both column J and K of the Google Sheet

## Troubleshooting

### Common Issues

1. **"Error loading data" message**
   - Make sure the Google Apps Script is deployed correctly
   - Check that the web app URL is properly set in the HTML file
   - Verify the Google Sheet ID is correct in the Apps Script

2. **Ratings not saving**
   - Ensure you've selected your profile from the dropdown
   - Check that the Apps Script has permission to edit the sheet
   - Try refreshing the page and trying again

3. **Images not loading**
   - Verify that headshot links in column H are valid Google Drive links
   - Make sure the Google Drive files are set to "Anyone with the link can view"

### Getting Help

If you encounter issues:
1. Check the browser console for error messages (F12 > Console)
2. Verify all setup steps were completed correctly
3. Make sure the Google Sheet has the correct structure

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Google Apps Script
- **Data Storage**: Google Sheets
- **Authentication**: Google Apps Script handles authentication automatically
- **Deployment**: Web app deployment through Google Apps Script

## Security Notes

- The web app is set to "Anyone with the link" access
- All data is stored in your Google Sheet
- No external databases or services are used
- Google handles all authentication and security
