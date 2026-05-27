const phoneNumber = "+2347040155877";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("email-form");
    const emailInput = document.getElementById("email-input");
    const message = document.getElementById("message");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = emailInput.value;

        if (validateEmail(email)) {
            message.textContent = "Thank you for subscribing!";
            message.style.color = "green";
            emailInput.value = ""; // Clear the input field
        } else {
            message.textContent = "Please enter a valid email address.";
            message.style.color = "red";
        }
    });

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Display the sample phone number
    const phoneDisplay = document.getElementById("phone-number");
    phoneDisplay.textContent = phoneNumber;
});