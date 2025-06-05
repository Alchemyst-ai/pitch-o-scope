# Smart Pitch Generator

A Next.js application that uses AI to generate personalized B2B sales pitches from CSV lead data.

## Overview

Smart Pitch Generator is a tool designed to help sales teams create personalized outreach messages at scale. Upload your leads in CSV format, provide context about your company and offerings, and the application will generate tailored pitches for each lead based on intelligent grouping.

## ScreenShots
![image](https://github.com/user-attachments/assets/4cfd76a5-ee50-45c9-90e2-30ff0b014af4)


## Features

- **CSV Lead Import**: Upload your lead data in CSV format
- **AI-Powered Lead Grouping**: Automatically groups similar leads for targeted messaging
- **Personalized Pitch Generation**: Creates customized pitches for each lead or group
- **Multiple Output Formats**: Generate content for emails, LinkedIn messages, and more
- **Export Options**: Download results as CSV for easy integration with your CRM

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **AI Integration**: LangChain with OpenAI
- **Data Processing**: CSV parsing with Papa Parse

## Quick Start

For a quick guide to get up and running, see [Quick Start Guide](docs/QUICK_START.md).

Sample files:
- [Example .env file](docs/env.example) - Template for your environment variables
- [Sample CSV file](docs/sample-leads.csv) - Example lead data format

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- OpenAI API key or Alchemyst API access

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Alchemyst Configuration (if using)
ALCHEMYST_API_KEY=your_alchemyst_api_key
ALCHEMYST_API_URL=https://api.alchemyst.ai
ALCHEMYST_BASE_URL=api.openai.com/v1
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-pitch-generator.git
cd smart-pitch-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### CSV Format

Your CSV file should include the following columns (at minimum):
- `First Name` or `Full Name`
- `Last Name` (if not using Full Name)
- `Job Title`
- `Company Name`

Additional columns that can enhance personalization:
- `Industry`
- `Website`
- `Location`
- `Keywords`

## Usage

1. **Upload Leads**: Use the file uploader to import your CSV file
2. **Configure Your Pitch**: Enter context about your company and offerings
3. **Review Leads**: Check the preview table to ensure your data was imported correctly
4. **Generate Pitches**: Click the generate button to start the AI processing
5. **Export Results**: Download the results as a CSV or copy individual pitches

## Development

### Project Structure

- `/app`: Next.js app router components and API routes
- `/src/components`: React components for the UI
- `/src/functions`: Core business logic and AI integration
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions for data processing

### Build for Production

```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm run start
# or
yarn start
```
