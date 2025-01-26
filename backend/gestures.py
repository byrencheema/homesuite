import os
import time
import mediapipe as mp
from PIL import Image
import numpy as np
import asyncio
import websockets
import cv2

# Mediapipe setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7, max_num_hands=1)

# Swipe detection thresholds
SWIPE_THRESHOLD = 70 
last_x = None

# WebSocket clients
connected_clients = set()

# WebSocket message sender
async def send_to_clients(message):
    for client in connected_clients:
        try:
            await client.send(message)
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected while sending message.")

# WebSocket handler
async def websocket_handler(websocket):
    connected_clients.add(websocket)
    print(f"New client connected. Total clients: {len(connected_clients)}")
    try:
        async for _ in websocket:
            pass  # Clients may send messages, but they're ignored
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)
        print(f"Client disconnected. Total clients: {len(connected_clients)}")

# Debug video display
def debug_video_display(frame, result, width, height):
    if result.multi_hand_landmarks:
        for hand_landmarks, hand_class in zip(result.multi_hand_landmarks, result.multi_handedness):
            hand_label = hand_class.classification[0].label
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            cv2.putText(frame, f"Hand: {hand_label}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Debug Video", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("Exiting debug video.")
        cv2.destroyAllWindows()
        exit()

# Swipe detection and WebSocket integration
async def swipe_detection():
    global last_x
    IMAGE_DIR = "images"
    os.makedirs(IMAGE_DIR, exist_ok=True)
    delay = 0.5
    time_prev = time.time() - delay

    print("Starting Swipe Detection...")
    while True:
        images = sorted(os.listdir(IMAGE_DIR))
        if not images:
            await asyncio.sleep(0.1)
            continue

        latest_image_path = os.path.join(IMAGE_DIR, images[-1])
        try:
            with Image.open(latest_image_path) as img:
                frame = np.array(img.convert("RGB"))

            height, width, _ = frame.shape
            time_cur = time.time()
            result = hands.process(frame)

            # debug_video_display(frame, result, width, height)

            if result.multi_hand_landmarks:
                for hand_landmarks, hand_class in zip(result.multi_hand_landmarks, result.multi_handedness):
                    hand_label = hand_class.classification[0].label
                    if hand_label == "Left":
                        x = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].x * width
                        if last_x is not None:
                            movement = x - last_x
                            if abs(movement) > SWIPE_THRESHOLD and time_cur - time_prev > delay:
                                direction = "Left" if movement > 0 else "Right"
                                print(f"{direction} Swipe Detected\n\n\n")
                                await send_to_clients(direction)
                                time_prev = time_cur
                        last_x = x

            os.remove(latest_image_path)

        except Exception as e:
            print(f"Error processing image {latest_image_path}: {e}")
            os.remove(latest_image_path)

# Main function
async def main():
    websocket_server = websockets.serve(websocket_handler, "0.0.0.0", 8765)
    print("Starting WebSocket server on ws://0.0.0.0:8765")
    await asyncio.gather(websocket_server, swipe_detection())

if __name__ == "__main__":
    hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7, max_num_hands=1)
    asyncio.run(main())
