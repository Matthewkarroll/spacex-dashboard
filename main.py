from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import time

app = FastAPI()

# Allow connections from your web browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROCKET STATE (The Brain) ---
# This is where we store the live numbers
rocket_data = {
    "status": "Pre-Launch",        # Pre-Launch, Thrusting, Coasting, Orbit, Aborted
    "altitude_km": 0.0,
    "speed_kmh": 0.0,
    "throttle": 0,
    "fuel_percent": 100,
    "time": 0
}

mission_running = False
mission_thread = None

# --- THE FLIGHT PHYSICS ---
def run_mission():
    global mission_running, rocket_data
    rocket_data["status"] = "Thrusting"
    rocket_data["time"] = 0
    
    # Run this loop until we stop it or reach space (120km)
    while mission_running and rocket_data["altitude_km"] < 120: 
        # Physics simulation (converted per-second)
        rocket_data["time"] += 1
        
        # 1. Throttle management
        if rocket_data["time"] < 20:
            rocket_data["throttle"] = 100
        elif rocket_data["time"] < 40:
            rocket_data["throttle"] = 80
        else:
            rocket_data["throttle"] = 50
            
        # 2. Altitude and Speed math
        current_throttle = rocket_data["throttle"] / 100
        acceleration = 15 * current_throttle * (1 - (rocket_data["time"] / 160))
        rocket_data["speed_kmh"] += acceleration * 3.6
        rocket_data["altitude_km"] += (rocket_data["speed_kmh"] / 3600) * 1
        
        # 3. Fuel consumption
        rocket_data["fuel_percent"] = max(0, 100 - (rocket_data["time"] * 0.8))
        
        # Make sure numbers are clean
        rocket_data["altitude_km"] = round(rocket_data["altitude_km"], 1)
        rocket_data["speed_kmh"] = round(rocket_data["speed_kmh"], 0)
        rocket_data["fuel_percent"] = round(rocket_data["fuel_percent"], 1)
        
        # Wait 1 second before doing the math again
        time.sleep(1)
        
    if rocket_data["altitude_km"] >= 120:
        rocket_data["status"] = "Orbit Achieved"
    mission_running = False

# --- API ENDPOINTS ---
@app.get("/data")
def get_rocket_data():
    return rocket_data

@app.post("/launch")
def launch_rocket():
    global mission_running, mission_thread, rocket_data
    if mission_running:
        return {"message": "Mission already in progress!"}
    
    # Reset the rocket to starting position
    rocket_data = {
        "status": "Pre-Launch",
        "altitude_km": 0.0,
        "speed_kmh": 0.0,
        "throttle": 0,
        "fuel_percent": 100,
        "time": 0
    }
    
    mission_running = True
    mission_thread = threading.Thread(target=run_mission)
    mission_thread.start()
    
    return {"message": "Launch sequence initiated!"}

@app.post("/abort")
def abort_mission():
    global mission_running, rocket_data
    mission_running = False
    rocket_data["status"] = "Aborted"
    return {"message": "Mission aborted!"}
@app.post("/reset")
def reset_mission():
    global mission_running, rocket_data
    mission_running = False
    rocket_data = {
        "status": "Pre-Launch",
        "altitude_km": 0.0,
        "speed_kmh": 0.0,
        "throttle": 0,
        "fuel_percent": 100,
        "time": 0
    }
    return {"message": "Mission reset to launchpad!"}
