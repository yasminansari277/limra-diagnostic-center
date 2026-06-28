# Limra Diagnostic Center

A modern React application for a diagnostic center with patient and admin dashboards.

## Features

- Diagnostic sonography services for pregnancy and general imaging
- Pregnancy ultrasound scans including early pregnancy, NT, anomaly, and growth scans
- General sonography for abdomen, pelvis, thyroid, breast, kidney, and more
- Doppler studies for fetal and placental blood flow assessment
- Modern ultrasound imaging with experienced radiologists

## Tech Stack

- React 19
- JavaScript (ES6+)
- Tailwind CSS
- Vite
- React Router

## Getting Started

### Prerequisites

- Node.js 16+
- npm

### Installation

1. Clone the repository
2. Install dependencies for both apps:
   ```bash
   npm run install-all
   ```

### Running the Applications

#### Client (Patient Portal)
```bash
npm run start-client
```
Opens at http://localhost:5173

#### Admin Dashboard
```bash
npm run start-admin
```
Opens at http://localhost:5174

### Building for Production

```bash
npm run build-client
npm run build-admin
```

## Project Structure

```
limra-diagnostic-center/
├── client/          # Patient portal React app
├── admin/           # Admin dashboard React app
├── shared/          # Shared UI components
└── package.json     # Root scripts
```

## Usage

- Visit the client app to browse services, book appointments, and manage your profile
- Use the admin app to manage appointments, doctors, and patients
- Authentication is simulated with localStorage

## Contributing

1. Make changes to the respective app (client or admin)
2. Test locally
3. Submit a pull request
