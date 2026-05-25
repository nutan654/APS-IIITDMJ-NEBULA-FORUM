import shutil
import os

log_path = r"C:\Users\nutan\.gemini\antigravity\brain\0b87f650-2af1-4a79-86dc-dd43df12363c\.system_generated\tasks\task-675.log"
dest_path = "log_out.txt"

if os.path.exists(log_path):
    shutil.copy(log_path, dest_path)
    print("Log copied successfully!")
    with open(dest_path, 'r', encoding='utf-8') as f:
        print(f.read())
else:
    print("Log file not found at path:", log_path)
