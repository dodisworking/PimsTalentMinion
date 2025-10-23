/**
 * Google Apps Script for Talent Tracker
 * Deploy this in your Google Sheet: Extensions > Apps Script
 */

// Configuration
const SHEET_NAME = 'Auditions';
const SHEET_ID = '1r8nevJ24_wmIcHhmGtms6qwT3sJohEMeO9uvqZnMB9g';

// Column mappings
const COLUMNS = {
  ROLE: 1,           // A
  TALENT_NAME: 2,    // B
  AGE: 3,            // C
  GENDER: 4,         // D
  ETHNICITY: 5,      // E
  COUNTRY: 6,        // F
  LINK: 7,           // G
  HEADSHOT: 8,       // H
  OVERALL_RATING: 10, // J
  AVERAGE_RATING: 11, // K
  CLAIRE_RATING: 12,  // L
  OLIVIA_RATING: 13,  // M
  FRAN_RATING: 14,    // N
  VICTOR_RATING: 15,  // O
  LAUREN_RATING: 16,  // P
  CLAIRE_NOTES: 17,   // Q
  OLIVIA_NOTES: 18,   // R
  FRAN_NOTES: 19,     // S
  VICTOR_NOTES: 20,   // T
  LAUREN_NOTES: 21    // U
};

// User mappings
const USERS = {
  'Claire': { ratingCol: COLUMNS.CLAIRE_RATING, notesCol: COLUMNS.CLAIRE_NOTES },
  'Olivia': { ratingCol: COLUMNS.OLIVIA_RATING, notesCol: COLUMNS.OLIVIA_NOTES },
  'Fran': { ratingCol: COLUMNS.FRAN_RATING, notesCol: COLUMNS.FRAN_NOTES },
  'Victor': { ratingCol: COLUMNS.VICTOR_RATING, notesCol: COLUMNS.VICTOR_NOTES },
  'Lauren': { ratingCol: COLUMNS.LAUREN_RATING, notesCol: COLUMNS.LAUREN_NOTES }
};

/**
 * Handle GET and POST requests
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getTalentData') {
    try {
      const data = getTalentData();
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Default: return error message
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: 'No action specified' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  const action = e.parameter.action;
  
  if (action === 'updateRating') {
    try {
      const rowIndex = parseInt(e.parameter.rowIndex);
      const user = e.parameter.user;
      const rating = e.parameter.rating;
      const notes = e.parameter.notes;
      
      const result = updateRating(rowIndex, user, rating, notes);
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get all talent data from the Auditions sheet
 */
function getTalentData() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Auditions sheet not found');
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and return data starting from row 2
    return data.slice(1);
  } catch (error) {
    console.error('Error getting talent data:', error);
    return [];
  }
}

/**
 * Update rating and notes for a specific user and talent row
 */
function updateRating(rowIndex, user, rating, notes) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Auditions sheet not found');
    }
    
    const userConfig = USERS[user];
    if (!userConfig) {
      throw new Error('Invalid user: ' + user);
    }
    
    // Convert rowIndex to actual row number (rowIndex is 0-based, sheet rows are 1-based)
    const actualRow = rowIndex + 2; // +2 because we skip header and rowIndex is 0-based
    
    // Update rating
    sheet.getRange(actualRow, userConfig.ratingCol).setValue(rating);
    
    // Update notes
    sheet.getRange(actualRow, userConfig.notesCol).setValue(notes);
    
    // Recalculate average for this row
    calculateAndUpdateAverage(actualRow);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating rating:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Calculate and update the average rating for a specific row
 */
function calculateAndUpdateAverage(row) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Auditions sheet not found');
    }
    
    // Get all ratings from columns L-P
    const ratings = [
      sheet.getRange(row, COLUMNS.CLAIRE_RATING).getValue(),
      sheet.getRange(row, COLUMNS.OLIVIA_RATING).getValue(),
      sheet.getRange(row, COLUMNS.FRAN_RATING).getValue(),
      sheet.getRange(row, COLUMNS.VICTOR_RATING).getValue(),
      sheet.getRange(row, COLUMNS.LAUREN_RATING).getValue()
    ];
    
    // Count votes
    const voteCounts = { 'Yes': 0, 'No': 0, 'Maybe': 0 };
    
    ratings.forEach(rating => {
      if (rating && voteCounts.hasOwnProperty(rating)) {
        voteCounts[rating]++;
      }
    });
    
    // Find majority vote
    let majorityVote = '';
    let maxVotes = 0;
    
    Object.keys(voteCounts).forEach(vote => {
      if (voteCounts[vote] > maxVotes) {
        maxVotes = voteCounts[vote];
        majorityVote = vote;
      }
    });
    
    // If no votes or tie, use empty string
    if (maxVotes === 0) {
      majorityVote = '';
    }
    
    // Update columns J and K with the average
    sheet.getRange(row, COLUMNS.OVERALL_RATING).setValue(majorityVote);
    sheet.getRange(row, COLUMNS.AVERAGE_RATING).setValue(majorityVote);
    
    return majorityVote;
  } catch (error) {
    console.error('Error calculating average:', error);
    return '';
  }
}

/**
 * Get the current user's rating and notes for a specific row
 */
function getUserRating(rowIndex, user) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Auditions sheet not found');
    }
    
    const userConfig = USERS[user];
    if (!userConfig) {
      throw new Error('Invalid user: ' + user);
    }
    
    const actualRow = rowIndex + 2; // +2 because we skip header and rowIndex is 0-based
    
    const rating = sheet.getRange(actualRow, userConfig.ratingCol).getValue();
    const notes = sheet.getRange(actualRow, userConfig.notesCol).getValue();
    
    return { rating: rating || '', notes: notes || '' };
  } catch (error) {
    console.error('Error getting user rating:', error);
    return { rating: '', notes: '' };
  }
}