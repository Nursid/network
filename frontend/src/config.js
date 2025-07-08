// METHOD 1: Automatic environment detection
// This automatically uses local URLs in development and production URLs in build
const isDevelopment = process.env.NODE_ENV === 'development';

// Local development URLs
const LOCAL_API_URL = "http://localhost:5000";
const LOCAL_IMG_URL = "http://localhost:5000/uploads/";

// Production URLs
const PRODUCTION_API_URL = "https://api.medicinehub.in";
const PRODUCTION_IMG_URL = "https://api.medicinehub.in/";

// Export the appropriate URLs based on environment
export const API_URL = isDevelopment ? LOCAL_API_URL : PRODUCTION_API_URL;
export const IMG_URL = isDevelopment ? LOCAL_IMG_URL : PRODUCTION_IMG_URL;

// METHOD 2: Custom environment variables (alternative approach)
// To use this method instead:
// 1. Create .env.development file in frontend root with:
//    REACT_APP_API_URL=http://localhost:5000
//    REACT_APP_IMG_URL=http://localhost:5000/uploads/
// 
// 2. Create .env.production file in frontend root with:
//    REACT_APP_API_URL=https://api.medicinehub.in
//    REACT_APP_IMG_URL=https://api.medicinehub.in/
//
// 3. Replace the exports above with:
//    export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
//    export const IMG_URL = process.env.REACT_APP_IMG_URL || "http://localhost:5000/uploads/";

// How it works:
// - When you run "npm start" → NODE_ENV=development → uses local URLs
// - When you run "npm run build" → NODE_ENV=production → uses production URLs

export const employeeList = ["backoffice", "admin", "supervisor"];

export const admin = "admin";
export const service = "service provider";

export const roles = {
  super: "super",
  admin: "admin",
  office: "office",
  service: "service",
  supervisor: "supervisor",
};
