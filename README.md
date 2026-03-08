<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and manage this portfolio locally

This project keeps the original portfolio design and adds a local uploader page for images and videos.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open the main portfolio page in the browser
4. Open the uploader page with:
   `http://localhost:3000/?mode=upload`

## Upload workflow

1. Open `/?mode=upload`
2. Add cover media and main media for each project
3. Click `写入项目`
4. The local dev server writes files into `public/uploads/` and creates `public/uploads/portfolio-data.json`
5. Refresh the main page and the Works section will load the uploaded data automatically
