import os
import requests
import zipfile
import io

# URL from the WSPR-NCSU Repo Release
DATASET_URL = "https://github.com/wspr-ncsu/robocall-audio-dataset/archive/refs/tags/v1.0.zip"
TARGET_DIR = "../data"

def setup_data():
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)
    
    print(f"Downloading dataset from {DATASET_URL}...")
    r = requests.get(DATASET_URL)
    z = zipfile.ZipFile(io.BytesIO(r.content))
    
    print("Extracting scammer audio (_left.wav) only...")
    count = 0
    for file in z.namelist():
        # We only want the '_left.wav' files (The Remote Scammer)
        if file.endswith("_left.wav") and "MACOSX" not in file:
            # Extract to data folder with a clean name
            filename = os.path.basename(file)
            with open(os.path.join(TARGET_DIR, filename), 'wb') as f:
                f.write(z.read(file))
            count += 1
            if count >= 10: break # Just get 10 examples for the hackathon demo
    
    print(f"Done! {count} scam files ready in {TARGET_DIR}")

if __name__ == "__main__":
    setup_data()