let cooldown = false; // Flag to track cooldown
const cooldownTime = 5000; // Cooldown time in milliseconds (e.g., 5000ms = 5 seconds)

document.getElementById('vatForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (cooldown) {
        alert(`Relax, count to ${cooldownTime / 1000} before trying again.`); // I'm not sure if corsproxy.io has a rate limit, but it's better to be safe than sorry.
        return;
    }

    const country = document.getElementById('country').value.toUpperCase();
    const vatNumber = document.getElementById('vatNumber').value;
    
    const url = `https://corsproxy.io/?https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${country}/vat/${vatNumber}`; // CORS proxy to bypass CORS policy

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            if (data.isValid) { // then yipeee!
                resultDiv.innerHTML = `
                    <p><strong>This VAT number is valid!</strong></p>
                    <p>Name (company): ${data.name}</p>
                    <p>Adress: ${data.address}</p>
                    <p>Request date: ${new Date(data.requestDate).toLocaleString()}</p>
                `; // Don't know why I put request date here, but someone might find it useful.
            } else {
                resultDiv.innerHTML = '<p><strong>This VAT number is either invalid, from a individual or not supported by VIES (non-eu country maybe?).</strong></p>'; // VIES doesn't support all countries, and it's only for companies. Maybe soon I should update it to calculate the VAT for individuals.
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = '<p><strong>The EU online services are down, or VIES returned a invalid response.</strong></p>'; // We never know if it's down. Hopefully it's not like CGD.
        })
        .finally(() => {
            // Start cooldown after the request is completed
            cooldown = true;
            setTimeout(() => {
                cooldown = false;
            }, cooldownTime);
});