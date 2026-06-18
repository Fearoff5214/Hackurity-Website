import http.server
import socketserver
import threading
import sys
import os
import time

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Configure MIME types to prevent browser blocking due to strict MIME type checking
MIME_MAP = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
}

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def end_headers(self):
        # Allow CORS and caching for smoother performance
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
        
    def guess_type(self, path):
        _, ext = os.path.splitext(path.lower())
        if ext in MIME_MAP:
            return MIME_MAP[ext]
        return super().guess_type(path)

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

server = None
server_thread = None
is_running = False

def start_server(port):
    global server, server_thread, is_running
    
    current_port = port
    max_tries = 20
    
    for _ in range(max_tries):
        try:
            handler = CustomHTTPRequestHandler
            server = ThreadedTCPServer(("", current_port), handler)
            is_running = True
            
            # Start a thread with the server
            server_thread = threading.Thread(target=server.serve_forever)
            server_thread.daemon = True
            server_thread.start()
            
            print(f"\n[SUCCESS] Server started successfully on port {current_port}!")
            print(f"--> Local Address:  http://localhost:{current_port}/")
            print(f"--> Directory:      {DIRECTORY}\n")
            return current_port
        except Exception as e:
            current_port += 1
            
    print("[ERROR] Could not find an available port to start the server.")
    return None

def stop_server():
    global server, is_running
    if server and is_running:
        print("[INFO] Shutting down the web server...")
        server.shutdown()
        server.server_close()
        is_running = False
        print("[SUCCESS] Server stopped successfully.")
    else:
        print("[INFO] Server is not currently running.")

def main():
    global is_running
    os.system('cls' if os.name == 'nt' else 'clear')
    
    print("=" * 60)
    print("      HACKCURITY 2026 — SERVER CONTROL CENTER")
    print("=" * 60)
    print("Controls:")
    print("  start   : Start the web server")
    print("  stop    : Stop the web server")
    print("  restart : Restart the web server")
    print("  status  : View current server status")
    print("  exit    : Stop the server and exit program")
    print("=" * 60)
    
    # Auto-start on launch
    port = start_server(PORT)
    
    while True:
        try:
            cmd = input("Control-Panel> ").strip().lower()
            if not cmd:
                continue
                
            if cmd == "start":
                if is_running:
                    print(f"[INFO] Server is already running at http://localhost:{server.server_address[1]}/")
                else:
                    start_server(PORT)
                    
            elif cmd == "stop":
                stop_server()
                
            elif cmd == "restart":
                if is_running:
                    active_port = server.server_address[1]
                    stop_server()
                    time.sleep(0.5)
                    start_server(active_port)
                else:
                    start_server(PORT)
                    
            elif cmd == "status":
                if is_running:
                    print(f"[STATUS] ACTIVE - Running on http://localhost:{server.server_address[1]}/")
                else:
                    print("[STATUS] INACTIVE - Web server is stopped.")
                    
            elif cmd in ("exit", "quit", "stop"):
                if is_running:
                    stop_server()
                print("[INFO] Goodbye!")
                break
                
            else:
                print(f"[HELP] Unknown command '{cmd}'. Available commands: start, stop, restart, status, exit")
        except KeyboardInterrupt:
            print("\n[INFO] Exiting...")
            if is_running:
                stop_server()
            break

if __name__ == "__main__":
    main()
