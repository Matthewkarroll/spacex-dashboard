# 🚀 Mission Control Dashboard

[![Made with FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Made with Leaflet](https://img.shields.io/badge/Map-Leaflet-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python)](https://www.python.org/)

> **A live, full-stack mission control simulator built with Python and JavaScript. Visualize real-time rocket telemetry, physics-based flight paths, and interactive mapping.**

---

## 📸 Demo

![Mission Control Dashboard](Screenshot%202026-08-08%20at%2018.05.21.png)

---

## ✨ Key Features

- **🚀 Real-Time Physics Simulation:** A Python backend calculates altitude, speed, throttle, and fuel consumption every second based on a simulated rocket physics model.
- **📊 Live Mission Dashboard:** A sleek, dark-mode UI displaying live telemetry data (Altitude, Speed, Throttle, Fuel, Mission Time, Status).
- **🌍 Interactive Flight Map:** A Leaflet.js map tracking the rocket's live trajectory across the Atlantic Ocean, launching from Cape Canaveral.
- **🕹️ Mission Control:** Full command capabilities including **Launch**, **Emergency Abort**, and **Reset** to return to the launchpad.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Python, FastAPI, Uvicorn, Threading |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Mapping** | Leaflet.js, CartoDB Dark Theme |
| **Deployment** | Render (Backend), Netlify (Frontend) |

---

## 🧠 The Physics Model

The mission runs on a separate background thread, updating the rocket state every second:

- **Throttle Logic:** Drops from 100% to 50% as the rocket ascends to mimic real staging dynamics.
- **Acceleration:** Calculated using `acceleration = 15 * throttle * (1 - time/160)` to simulate gravity losses and fuel depletion.
- **Orbit Target:** The mission completes when the rocket reaches **120 km altitude** (Low Earth Orbit threshold).
- **Fuel Consumption:** Burns at a rate of `0.8%` per second.

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/spacex-dashboard.git
   cd spacex-dashboard## 
   
---

📂 Project Structure

spacex-dashboard/
├── main.py              # FastAPI physics engine & endpoints
├── index.html           # Mission Control UI
├── script.js            # Frontend logic & map integration
└── README.md            # You are here!

---

## 👨‍💻 Author

Built as a portfolio project by [Matthewkarroll].

> *Simulating the path to Low Earth Orbit, one second at a time.*