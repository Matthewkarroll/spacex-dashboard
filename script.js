const API_URL = "http://127.0.0.1:8000";

// --- SETUP THE FLIGHT MAP ---
// Center on Cape Canaveral, Florida (where real rockets launch from)
const map = L.map('flight-map').setView([28.5, -80.5], 3); 

// Load dark map tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Place a launch pad marker at the start
let rocketMarker = L.marker([28.5, -80.5]).addTo(map)
    .bindPopup("Launch Site");

// --- UPDATE THE DASHBOARD ---
async function updateDashboard() {
    try {
        const response = await fetch(API_URL + '/data');
        const data = await response.json();
        
        // Update the numbers
        document.getElementById('altitude').innerText = data.altitude_km + ' km';
        document.getElementById('speed').innerText = data.speed_kmh + ' km/h';
        document.getElementById('throttle').innerText = data.throttle + '%';
        document.getElementById('fuel').innerText = data.fuel_percent + '%';
        document.getElementById('time').innerText = data.time + 's';
        
        const statusEl = document.getElementById('status');
        statusEl.innerText = data.status.toUpperCase();
        
        // Change status color based on mission phase
        if (data.status === 'Pre-Launch') statusEl.style.color = '#4db8ff';
        else if (data.status === 'Thrusting') statusEl.style.color = '#00ffcc';
        else if (data.status === 'Orbit Achieved') statusEl.style.color = '#00cc66';
        else if (data.status === 'Aborted') statusEl.style.color = '#ff4d4d';

        // Update buttons and bottom message
        const msg = document.getElementById('status-message');
        const launchBtn = document.getElementById('launchBtn');
        const abortBtn = document.getElementById('abortBtn');

        if (data.status === 'Pre-Launch') {
            msg.innerText = "Waiting for launch command...";
            launchBtn.disabled = false; abortBtn.disabled = true;
        } else if (data.status === 'Thrusting') {
            msg.innerText = "🚀 Mission is underway!";
            launchBtn.disabled = true; abortBtn.disabled = false;
        } else if (data.status === 'Orbit Achieved') {
            msg.innerText = "✅ Orbit achieved! Mission successful!";
            launchBtn.disabled = true; abortBtn.disabled = true;
        } else if (data.status === 'Aborted') {
            msg.innerText = "❌ Mission aborted.";
            launchBtn.disabled = false; abortBtn.disabled = true;
        }

        // --- UPDATE THE MAP POSITION ---
        // Simple math: as altitude goes up, the rocket moves East across the Atlantic
        const startLng = -80.5;
        const startLat = 28.5;
        const newLng = startLng + (data.altitude_km / 20); 
        const newLat = startLat + (data.altitude_km / 100);
        
        if (data.altitude_km > 0) {
            map.setView([newLat, newLng], 4);
            rocketMarker.setLatLng([newLat, newLng]);
            rocketMarker.bindPopup(`Altitude: ${data.altitude_km}km`).openPopup();
        }

    } catch (error) {
        console.error("Could not reach the rocket:", error);
    }
}

// --- BUTTON COMMANDS ---
async function launch() {
    await fetch(API_URL + '/launch', { method: 'POST' });
    updateDashboard();
}

async function abort() {
    await fetch(API_URL + '/abort', { method: 'POST' });
    updateDashboard();
}

// --- START THE CLOCK ---
// Update the dashboard every 1 second
setInterval(updateDashboard, 1000);

// Run it immediately when the page loads
updateDashboard();

async function resetMission() {
    await fetch(API_URL + '/reset', { method: 'POST' });
    updateDashboard();
}