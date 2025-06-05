# Quick Start Guide

This guide will help you get started with Smart Pitch Generator quickly.

## 1. Setup

### Clone the repository
```bash
git clone https://github.com/yourusername/smart-pitch-generator.git
cd smart-pitch-generator
```

### Install dependencies
```bash
npm install
# or
yarn install
```

### Configure environment variables
Copy the example environment file and add your API keys:
```bash
cp docs/env.example .env.local
```

Edit `.env.local` and add your OpenAI API key or Alchemyst API credentials.

## 2. Run the application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3. Using the application

### Prepare your leads CSV
Prepare a CSV file with your leads data. The file should include at minimum:
- Full Name (or First Name and Last Name)
- Job Title
- Company Name

See `docs/sample-leads.csv` for an example format.

### Upload your leads
1. Click on the file upload area or drag and drop your CSV file
2. The application will validate your CSV format
3. If valid, you'll see a preview of your leads

### Configure your pitch
1. Enter information about your company, products/services, and unique value proposition
2. Customize output settings if needed (email, LinkedIn message, etc.)

### Generate pitches
1. Click the "Generate Pitches" button
2. Wait for the AI to process your leads and create personalized pitches
3. Review the results in the output table

### Export results
1. Use the export options to download results as CSV
2. Or copy individual pitches directly from the interface

## 4. Tips for best results

- Provide detailed company context for more relevant pitches
- Include industry and other contextual data in your CSV for better personalization
- Review and adjust the generated pitches before sending to leads
- Group similar leads together for more efficient processing 