import pyautogui
import time
import random
import math
import sys
import threading

# ---------------------------------------------------------
# CẤU HÌNH NGỤY TRANG (CAMOUFLAGE CONFIG)
# Tên hiển thị: Log Analyzer Service
# ---------------------------------------------------------

# Cài đặt an toàn: Di chuột vào góc màn hình nếu muốn dừng khẩn cấp
pyautogui.FAILSAFE = True 

def human_move(x2, y2, duration=0.5):
    """
    Di chuyển chuột theo đường cong tự nhiên (Bezier Curve)
    thay vì đường thẳng robot.
    """
    x1, y1 = pyautogui.position()
    
    # Tạo điểm điều khiển ngẫu nhiên để tạo đường cong
    control_x = random.randint(min(x1, x2), max(x1, x2))
    control_y = random.randint(min(y1, y2), max(y1, y2))
    
    # Số bước di chuyển
    steps = int(duration * 60) # 60 fps
    
    for i in range(steps):
        t = i / steps
        # Công thức Bezier bậc 2
        bx = (1-t)**2 * x1 + 2*(1-t)*t * control_x + t**2 * x2
        by = (1-t)**2 * y1 + 2*(1-t)*t * control_y + t**2 * y2
        
        pyautogui.moveTo(bx, by)
        time.sleep(duration / steps)

def simulate_reading():
    """Giả lập hành động đọc tài liệu (Scroll lên xuống)"""
    print("[*] Processing log chunk...") # Fake log message
    scroll_amount = random.randint(-300, 300)
    pyautogui.scroll(scroll_amount)
    time.sleep(random.uniform(1.0, 3.0))

def simulate_switching():
    """Giả lập Alt+Tab để chuyển cửa sổ làm việc"""
    print("[*] Switching context...")
    if random.random() < 0.2: # 20% cơ hội
        pyautogui.hotkey('alt', 'tab')
        time.sleep(random.uniform(0.5, 2.0))

def simulate_thinking():
    """Giả lập người đang suy nghĩ (Di chuột vẩn vơ)"""
    print("[*] Analyzing patterns...")
    screen_w, screen_h = pyautogui.size()
    
    # Chọn điểm ngẫu nhiên nhưng tránh các góc nguy hiểm
    target_x = random.randint(100, screen_w - 100)
    target_y = random.randint(100, screen_h - 100)
    
    duration = random.uniform(0.5, 1.5)
    human_move(target_x, target_y, duration)
    time.sleep(random.uniform(2.0, 10.0))

def main():
    print("=== DATA LOG ANALYZER V2.0 ===")
    print("Initializing analysis engine...")
    time.sleep(2)
    print("Running background tasks. Press Ctrl+C to stop.")
    
    try:
        while True:
            # Random hành động
            action = random.choice(['move', 'move', 'move', 'scroll', 'scroll', 'switch'])
            
            if action == 'move':
                simulate_thinking()
            elif action == 'scroll':
                simulate_reading()
            elif action == 'switch':
                simulate_switching()
            
            # Thời gian nghỉ ngẫu nhiên (quan trọng để tránh pattern detection)
            # Nghỉ từ 10s đến 45s (mô phỏng người đang đọc/nghĩ)
            sleep_time = random.uniform(10, 45)
            print(f"[*] Idle for {sleep_time:.1f}s...")
            time.sleep(sleep_time)
            
    except KeyboardInterrupt:
        print("\n[!] Analysis stopped by user.")
        sys.exit(0)

if __name__ == "__main__":
    main()
