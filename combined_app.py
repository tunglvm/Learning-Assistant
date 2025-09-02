from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
import json
import os
import secrets
import string
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import re
import math
import numpy as np

# Thêm import cho dịch thuật
try:
    from googletrans import Translator
except ImportError:
    Translator = None

app = Flask(__name__)
CORS(app)  # Cho phép truy cập từ domain khác
app.secret_key = 'your-secret-key'  # Thay đổi thành một key bảo mật

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Đường dẫn đến file JSON lưu thông tin người dùng
USERS_FILE = '.vscode/users.json'
RESET_TOKENS_FILE = '.vscode/reset_tokens.json'

# Cấu hình email (giả lập)
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'sender_email': 'your-email@gmail.com',
    'sender_password': 'your-app-password'
}

# Calculator class
class Calculator:
    @staticmethod
    def sum_numbers(numbers):
        """Tính tổng của một danh sách các số"""
        return sum(numbers)

    @staticmethod
    def subtract_numbers(numbers):
        if not numbers:
            return 0
        result = numbers[0]
        for n in numbers[1:]:
            result -= n
        return result

    @staticmethod
    def multiply_numbers(numbers):
        result = 1
        for n in numbers:
            result *= n
        return result

    @staticmethod
    def divide_numbers(numbers):
        if not numbers:
            return 0
        result = numbers[0]
        for n in numbers[1:]:
            if n == 0:
                raise ValueError("Không thể chia cho 0")
            result /= n
        return result

    @staticmethod
    def add(a, b):
        return a + b

    @staticmethod
    def subtract(a, b):
        return a - b

    @staticmethod
    def multiply(a, b):
        return a * b

    @staticmethod
    def divide(a, b):
        if b == 0:
            raise ValueError("Không thể chia cho 0")
        return a / b

    @staticmethod
    def sum_range(start, end):
        """Tính tổng các số từ start đến end"""
        return sum(range(start, end + 1))

    @staticmethod
    def sum_even_numbers(numbers):
        """Tính tổng các số chẵn trong danh sách"""
        return sum(num for num in numbers if num % 2 == 0)

    @staticmethod
    def sum_odd_numbers(numbers):
        """Tính tổng các số lẻ trong danh sách"""
        return sum(num for num in numbers if num % 2 != 0)

    @staticmethod
    def average(numbers):
        """Tính trung bình cộng của một danh sách số"""
        return sum(numbers) / len(numbers) if numbers else 0

    @staticmethod
    def factorial(n):
        """Tính giai thừa của một số"""
        if n < 0:
            raise ValueError("Không thể tính giai thừa của số âm")
        return math.factorial(n)

    @staticmethod
    def fibonacci(n):
        """Tính số Fibonacci thứ n"""
        if n < 0:
            raise ValueError("Không thể tính số Fibonacci âm")
        if n <= 1:
            return n
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b

    @staticmethod
    def is_prime(n):
        """Kiểm tra số nguyên tố"""
        if n < 2:
            return False
        for i in range(2, int(math.sqrt(n)) + 1):
            if n % i == 0:
                return False
        return True

    @staticmethod
    def prime_factors(n):
        """Phân tích thừa số nguyên tố"""
        factors = []
        divisor = 2
        while n > 1:
            while n % divisor == 0:
                factors.append(divisor)
                n //= divisor
            divisor += 1
            if divisor * divisor > n:
                if n > 1:
                    factors.append(n)
                break
        return factors

    @staticmethod
    def gcd(a, b):
        """Tìm ước chung lớn nhất"""
        return math.gcd(a, b)

    @staticmethod
    def lcm(a, b):
        """Tìm bội chung nhỏ nhất"""
        return abs(a * b) // math.gcd(a, b)

    @staticmethod
    def solve_quadratic(a, b, c):
        """Giải phương trình bậc 2: ax² + bx + c = 0"""
        if a == 0:
            raise ValueError("Không phải phương trình bậc 2")
        delta = b**2 - 4*a*c
        if delta < 0:
            return {"type": "complex", "x1": f"{-b/(2*a)} + {math.sqrt(-delta)/(2*a)}i",
                    "x2": f"{-b/(2*a)} - {math.sqrt(-delta)/(2*a)}i"}
        elif delta == 0:
            x = -b/(2*a)
            return {"type": "real", "x1": x, "x2": x}
        else:
            x1 = (-b + math.sqrt(delta))/(2*a)
            x2 = (-b - math.sqrt(delta))/(2*a)
            return {"type": "real", "x1": x1, "x2": x2}

    @staticmethod
    def calculate_statistics(numbers):
        """Tính các thống kê cơ bản"""
        if not numbers:
            return {"error": "Danh sách trống"}
        return {
            "mean": np.mean(numbers),
            "median": np.median(numbers),
            "mode": float(max(set(numbers), key=numbers.count)),
            "std": np.std(numbers),
            "min": min(numbers),
            "max": max(numbers)
        }

    @staticmethod
    def translate(text, dest='en'):
        if Translator is None:
            return "Chức năng dịch chưa được cài đặt. Hãy cài đặt googletrans."
        translator = Translator()
        result = translator.translate(text, dest=dest)
        return result.text

# User class
class User(UserMixin):
    def __init__(self, id, username, password_hash, email=None):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.email = email

# Khởi tạo calculator
calc = Calculator()

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def load_reset_tokens():
    if os.path.exists(RESET_TOKENS_FILE):
        with open(RESET_TOKENS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_reset_tokens(tokens):
    with open(RESET_TOKENS_FILE, 'w') as f:
        json.dump(tokens, f, indent=4)

def generate_reset_token():
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))

def validate_password(password):
    """
    Kiểm tra độ mạnh của mật khẩu
    - Ít nhất 8 ký tự
    - Ít nhất 1 chữ hoa
    - Ít nhất 1 chữ thường
    - Ít nhất 1 số
    - Ít nhất 1 ký tự đặc biệt
    """
    if len(password) < 8:
        return False, "Mật khẩu phải có ít nhất 8 ký tự"
    if not re.search(r"[A-Z]", password):
        return False, "Mật khẩu phải có ít nhất 1 chữ hoa"
    if not re.search(r"[a-z]", password):
        return False, "Mật khẩu phải có ít nhất 1 chữ thường"
    if not re.search(r"\d", password):
        return False, "Mật khẩu phải có ít nhất 1 số"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
    return True, "Mật khẩu hợp lệ"

def validate_email(email):
    """Kiểm tra định dạng email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def send_reset_email(email, reset_link):
    """
    Hàm giả lập gửi email
    Trong môi trường thực tế, bạn cần thay thế bằng code gửi email thật
    """
    print(f"Sending reset email to {email}")
    print(f"Reset link: {reset_link}")
    # TODO: Implement actual email sending
    return True

@login_manager.user_loader
def load_user(user_id):
    users = load_users()
    if user_id in users:
        user_data = users[user_id]
        return User(user_id, user_data['username'], user_data['password_hash'], user_data.get('email'))
    return None

# Routes cho authentication
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/users')
@login_required
def users_list():
    users = load_users()
    users_list = [{'id': user_id, 'username': user_data['username']} 
                 for user_id, user_data in users.items()]
    return render_template('users.html', users=users_list)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        print("Form data received:", request.form) # Thêm dòng này và đổi tin nhắn in để dễ nhận biết hơn
        username = request.form.get('username')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        email = request.form.get('email')
        print("Reached register route") # Thêm dòng này
   
        # ... rest of the code

        # ... các đoạn code kiểm tra và xử lý tiếp theo
        # ... các đoạn code kiểm tra và xử lý tiếp theo
        # Kiểm tra mật khẩu xác nhận
        if password != confirm_password:
            flash('Mật khẩu xác nhận không khớp!')
            return redirect(url_for('register'))
        
        # Validate email
        if not validate_email(email):
            flash('Email không hợp lệ!')
            return redirect(url_for('register'))
        
        # Validate password
        is_valid, message = validate_password(password)
        if not is_valid:
            flash(message)
            return redirect(url_for('register'))
        
        users = load_users()
        
        # Kiểm tra username đã tồn tại chưa
        if any(user['username'] == username for user in users.values()):
            flash('Username đã tồn tại!')
            return redirect(url_for('register'))
        
        # Kiểm tra email đã tồn tại chưa
        if any(user.get('email') == email for user in users.values()):
            flash('Email đã được sử dụng!')
            return redirect(url_for('register'))
        
        # Tạo user mới
        user_id = str(len(users) + 1)
        password_hash = generate_password_hash(password)
        
        users[user_id] = {
            'username': username,
            'password_hash': password_hash,
            'email': email
        }
        
        save_users(users)
        flash('Đăng ký thành công!')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        users = load_users()
        
        # Tìm user theo username
        user = None
        for user_id, user_data in users.items():
            if user_data['username'] == username:
                user = User(user_id, username, user_data['password_hash'], user_data.get('email'))
                break
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('index'))
        
        flash('Username hoặc password không đúng!')
    
    return render_template('login.html')

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'GET':
        return render_template('forgot_password.html')
        
    if request.method == 'POST':
        email = request.form.get('email')
        
        if not validate_email(email):
            flash('Email không hợp lệ!')
            return redirect(url_for('forgot_password'))
        
        users = load_users()
        reset_tokens = load_reset_tokens()
        
        # Tìm user theo email
        user = None
        user_id = None
        for uid, user_data in users.items():
            if user_data.get('email') == email:
                user = user_data
                user_id = uid
                break
        
        if not user:
            flash('Email không tồn tại trong hệ thống')
            return redirect(url_for('forgot_password'))
        
        # Xóa token cũ nếu có
        for token, data in list(reset_tokens.items()):
            if data['user_id'] == user_id:
                del reset_tokens[token]
        
        # Tạo token reset password mới
        token = generate_reset_token()
        expiry = (datetime.now() + timedelta(hours=24)).isoformat()
        
        reset_tokens[token] = {
            'user_id': user_id,
            'expiry': expiry
        }
        
        save_reset_tokens(reset_tokens)
        
        # Gửi email với link reset password
        reset_link = url_for('reset_password', token=token, _external=True)
        if send_reset_email(email, reset_link):
            flash('Link đặt lại mật khẩu đã được gửi đến email của bạn')
        else:
            flash('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.')
        
        return redirect(url_for('login'))

@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    reset_tokens = load_reset_tokens()
    
    if token not in reset_tokens:
        flash('Token không hợp lệ hoặc đã hết hạn')
        return redirect(url_for('login'))
    
    token_data = reset_tokens[token]
    expiry = datetime.fromisoformat(token_data['expiry'])
    
    if datetime.now() > expiry:
        del reset_tokens[token]
        save_reset_tokens(reset_tokens)
        flash('Token đã hết hạn')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Mật khẩu không khớp')
            return redirect(url_for('reset_password', token=token))
        
        is_valid, message = validate_password(password)
        if not is_valid:
            flash(message)
            return redirect(url_for('reset_password', token=token))
        
        users = load_users()
        user_id = token_data['user_id']
        
        if user_id not in users:
            flash('User không tồn tại')
            return redirect(url_for('login'))
        
        users[user_id]['password_hash'] = generate_password_hash(password)
        save_users(users)
        
        del reset_tokens[token]
        save_reset_tokens(reset_tokens)
        
        flash('Mật khẩu đã được đặt lại thành công')
        return redirect(url_for('login'))
    
    return render_template('reset_password.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/change-password', methods=['POST'])
@login_required
def change_password():
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')
    
    if not check_password_hash(current_user.password_hash, current_password):
        flash('Mật khẩu hiện tại không đúng')
        return redirect(url_for('index'))
    
    if new_password != confirm_password:
        flash('Mật khẩu mới không khớp')
        return redirect(url_for('index'))
    
    is_valid, message = validate_password(new_password)
    if not is_valid:
        flash(message)
        return redirect(url_for('index'))
    
    users = load_users()
    users[current_user.id]['password_hash'] = generate_password_hash(new_password)
    save_users(users)
    
    flash('Mật khẩu đã được thay đổi thành công')
    return redirect(url_for('index'))

# Routes cho calculator API
@app.route('/api/calculate', methods=['POST'])
def calculate():
    try:
        data = request.json
        operation = data.get('operation')
        params = data.get('params', {})

        if operation == 'sum_numbers':
            result = calc.sum_numbers(params.get('numbers', []))
        elif operation == 'subtract_numbers':
            result = calc.subtract_numbers(params.get('numbers', []))
        elif operation == 'multiply_numbers':
            result = calc.multiply_numbers(params.get('numbers', []))
        elif operation == 'divide_numbers':
            result = calc.divide_numbers(params.get('numbers', []))
        elif operation == 'add':
            result = calc.add(params.get('a', 0), params.get('b', 0))
        elif operation == 'subtract':
            result = calc.subtract(params.get('a', 0), params.get('b', 0))
        elif operation == 'multiply':
            # Ensure parameters are numbers before multiplication
            try:
                a = float(params.get('a', 0))
                b = float(params.get('b', 0))
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid parameters for multiplication. Please provide numbers."}), 400
            result = calc.multiply(a, b)
        elif operation == 'divide':
            result = calc.divide(params.get('a', 0), params.get('b', 1))
        elif operation == 'translate':
            result = calc.translate(params.get('text', ''), params.get('dest', 'en'))
        elif operation == 'sum_range':
            result = calc.sum_range(params.get('start', 0), params.get('end', 0))
        elif operation == 'sum_even_numbers':
            result = calc.sum_even_numbers(params.get('numbers', []))
        elif operation == 'sum_odd_numbers':
            result = calc.sum_odd_numbers(params.get('numbers', []))
        elif operation == 'average':
            result = calc.average(params.get('numbers', []))
        elif operation == 'factorial':
            result = calc.factorial(params.get('n', 0))
        elif operation == 'fibonacci':
            result = calc.fibonacci(params.get('n', 0))
        elif operation == 'is_prime':
            result = calc.is_prime(params.get('n', 0))
        elif operation == 'prime_factors':
            result = calc.prime_factors(params.get('n', 0))
        elif operation == 'gcd':
            result = calc.gcd(params.get('a', 0), params.get('b', 0))
        elif operation == 'lcm':
            result = calc.lcm(params.get('a', 0), params.get('b', 0))
        elif operation == 'solve_quadratic':
            result = calc.solve_quadratic(params.get('a', 0), params.get('b', 0), params.get('c', 0))
        elif operation == 'statistics':
            result = calc.calculate_statistics(params.get('numbers', []))
        else:
            return jsonify({"error": "Operation not supported"}), 400

        return jsonify({"result": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000) 