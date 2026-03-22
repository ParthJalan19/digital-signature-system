# Getting Started with Create React App

A secure digital signature system for financial documents like invoices and loan approval forms.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Sequelize
- **Storage:** Cloudinary
- **Auth:** JWT

## Features
- ✅ User Authentication (Register/Login)
- ✅ PDF Document Upload
- ✅ Canvas-based Digital Signature
- ✅ Document Status Tracking
- ✅ Email Notifications
- ✅ Document Verification + QR Code
- ✅ Audit Logs

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/ParthJalan19/digital-signature-system.git
cd digital-signature-system

### 2. Setup Backend
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev

### 3. Setup Frontend
cd client
npm install
npm start

### 4. Setup Database
Create a PostgreSQL database named digital_signature_db
The tables will be auto-created when server starts.
```

---

## ✅ Your Final GitHub Structure Should Look Like
```
digital-signature-system/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── server/
│   ├── blockchain/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example    ← ✅ safe to upload
│   ├── index.js
│   └── package.json
└── README.md
