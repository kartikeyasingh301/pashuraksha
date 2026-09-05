# PashuSuraksha - Animal Health Surveillance System

**PashuSuraksha** is a comprehensive, mobile-first surveillance platform designed for the early detection and management of livestock diseases in India. 

It provides an end-to-end pipeline:
1. **Farmers** can report animal health issues with GPS tagging and symptom tracking.
2. **The Backend Engine** intelligently analyzes incoming reports across spatiotemporal boundaries.
3. **Veterinarians** are automatically alerted to emerging disease clusters, zoonotic threats, and critical active cases via their dedicated dashboard.

## Live Demo
- **Frontend (Vercel):** [https://pashuraksh.vercel.app](https://pashuraksh.vercel.app)

### Demo Credentials
- **Farmer Dashboard:** Username: `farmer1` / Password: `farmer123`
- **Vet Dashboard:** Username: `vet1` / Password: `vet123`

## Tech Stack
### Frontend
- React 18 & Vite
- React Router DOM (Role-based navigation)
- Mobile-first responsive CSS (no external UI framework)
- Leaflet Maps (Geospatial visualization)

### Backend
- Node.js & Express
- SQLite (better-sqlite3) for fast local querying and cluster analytics
- JWT-based Authentication
- Custom Automated Pipeline Engine (Case & Cluster escalation)

## Features
- **Intelligent Escalation Pipeline:** Automatically groups singular reports into `Cases`, elevates connected cases into `Clusters`, and flags `Suspected Outbreaks`.
- **Zoonotic Alerts:** Immediate threat detection for diseases that cross over to humans (e.g., Rabies, Anthrax).
- **Vaccination Gap Analysis:** Tracks vulnerable villages with low vaccination coverage.
- **Geospatial Mapping:** Visualizes outbreaks and active clusters dynamically.

## Installation & Local Development

1. **Install Dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Run Backend:**
   ```bash
   cd server
   npm run dev
   ```
   *Runs on http://localhost:3001*

3. **Run Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   *Runs on http://localhost:5173*
