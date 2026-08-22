# Glimpse

An AI-powered event photo delivery platform that uses face recognition to help guests find their photos with a single selfie.

## Overview

Glimpse is designed for photographers to easily distribute event photos. Instead of manually sorting photos or sending generic cloud links where guests have to scroll through hundreds of images, photographers can use Glimpse. Guests simply open a link, take a selfie, and instantly see every photo they appear in.

This repository contains the hackathon prototype version of Glimpse, built to demonstrate the core end-to-end flow.

## Core Features (Hackathon Scope)

- **Photographer Dashboard**: Create events and upload event photos in bulk.
- **Face Recognition**: Automated face detection and embedding generation for uploaded photos.
- **Guest Portal**: A frictionless experience for guests. No app installation or account creation required.
- **Instant Matching**: Guests take a selfie, give consent, and instantly find all matching photos (solo and group).
- **Easy Sharing**: Generate a shareable link and QR code for the event.
- **Downloads**: Guests can download individual photos or a bulk ZIP of all their matches.

## User Flow

1. **Photographer**: Logs in, creates an event, and uploads photos.
2. **System**: Processes photos in the background to detect faces and generate embeddings.
3. **Sharing**: Photographer receives a QR code and link for the event.
4. **Guest**: Scans the QR code, lands on the guest portal, and takes a selfie.
5. **Matching**: The system compares the selfie to the event photos and displays matches.
6. **Download**: Guest downloads their photos.

## Tech Stack

The architecture is split into a frontend application and a dedicated face-recognition processing service.

- **Frontend**: React-based UI (Vite), styled with Tailwind CSS, utilizing `framer-motion` for complex scroll animations and `lenis` for smooth cinematic scrolling. Data fetching via TanStack Query.
- **Backend / AI Processing**: Python (FastAPI) handling the core face recognition pipeline using `face_recognition`, `dlib`, and `numpy`.
- **Database & Storage**: Supabase (PostgreSQL with `pgvector` for similarity search, Auth for photographer login, and Storage for images).
- **Hosting**: Designed for Vercel (Frontend) and Render (Backend).

## Getting Started

### Prerequisites

- Node.js installed
- Python environment set up
- Supabase project for database and storage

### Running the Frontend

1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open the displayed local URL in your browser.

### Running the Backend

*(Assuming the backend code is located in its respective directory)*
1. Install Python dependencies: `pip install -r requirements.txt`
2. Run the FastAPI server: `uvicorn main:app --reload`
