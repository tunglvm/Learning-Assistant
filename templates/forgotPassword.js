// Function to show the forgot password modal
function showForgotPasswordModal() {
    closeAllModals(); // Make sure this function exists and closes other modals
    document.getElementById('forgotPasswordModal').style.display = 'block';
    // Optionally clear previous messages and form fields
    document.getElementById('forgotEmail').value = '';
    document.getElementById('forgotPasswordSuccess').style.display = 'none';
    document.getElementById('forgotPasswordError').style.display = 'none';
     document.getElementById('forgotPasswordForm').style.display = 'flex'; // Ensure form is visible initially
}

// Function to handle forgot password form submission
function handleForgotPassword(event) {
    event.preventDefault();

    const form = document.getElementById('forgotPasswordForm');
    const email = document.getElementById('forgotEmail').value.trim();
    const loading = document.getElementById('forgotPasswordLoading');
    const successMessage = document.getElementById('forgotPasswordSuccess');
    const errorMessageDiv = document.getElementById('forgotPasswordError');

    // Reset messages
    successMessage.style.display = 'none';
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.querySelector('p').textContent = '';

    // Client-side validation
    if (!email || !isValidEmail(email)) { // Assuming isValidEmail is in auth.js or accessible
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.querySelector('p').textContent = 'Vui lòng nhập email hợp lệ.';
        return;
    }

    // Show loading and hide form
    form.style.display = 'none';
    loading.style.display = 'block';

    // Send request to backend
    fetch('/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        if (data.success) {
            successMessage.style.display = 'block';
            // Optionally close modal after a delay or show a success message permanently
            // setTimeout(() => {
            //     closeModal('forgotPasswordModal');
            // }, 3000); // Close after 3 seconds
        } else {
            form.style.display = 'flex'; // Show form again
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.querySelector('p').textContent = data.message;
        }
    })
    .catch((error) => {
        loading.style.display = 'none';
        form.style.display = 'flex'; // Show form again
        console.error('Error:', error);
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.querySelector('p').textContent = 'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.';
    });
}

// Note: Assumes closeModal and isValidEmail functions are available globally (e.g., from auth.js) 