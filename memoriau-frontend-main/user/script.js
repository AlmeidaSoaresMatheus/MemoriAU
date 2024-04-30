document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    
    const login = formData.get('login');
    const password = formData.get('password');

    try {
        const requestBody = new URLSearchParams();
        requestBody.append('login', login);
        requestBody.append('password', password);

        const response = await fetch('http://localhost:3306/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Adjusted Content-Type
            }, 
            body: requestBody // Adjusted request body
        });

        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        const newUser = await response.json();
        addUserToList(newUser);
        this.reset(); // Reset form after successful submission
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register user');
    }
});

function addUserToList(user) {
    const userList = document.getElementById('userList');
    const listItem = document.createElement('li');
    listItem.textContent = `Login: ${user.login}`;
    userList.appendChild(listItem);
}
