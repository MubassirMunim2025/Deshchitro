const form = document.getElementById('countryForm');
const input = document.getElementById('countryInput');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const country = input.value.trim();
    resultDiv.innerHTML = '';
    if (!country) return;

    resultDiv.innerHTML = `<div class="not-found" style="color:#64a0e0;">Looking up <b>${country}</b>...</div>`;

    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=false`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        // result clean
        resultDiv.innerHTML = '';

        data.forEach(country => {
            const currencyList = country.currencies ? Object.entries(country.currencies).map(
                ([code, cur]) => `${cur.name} (${code}${cur.symbol ? ', ' + cur.symbol : ''})`
            ).join(", ") : "N/A";
            const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
            const population = country.population ? country.population.toLocaleString() : "N/A";
            const region = country.region || "N/A";
            const timezone = country.timezones ? country.timezones.join(', ') : "N/A";
            const area = country.area ? `${country.area.toLocaleString()} km²` : "N/A";
            const maps = country.maps && country.maps.googleMaps ? `<a href="${country.maps.googleMaps}" target="_blank">Google Maps</a>` : "N/A";

            resultDiv.innerHTML += `
                <div class="country-card">
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                    <h2>${country.name.common}</h2>
                    <div class="data-row"><span class="label">Official Name:</span> <span class="value">${country.name.official}</span></div>
                    <div class="data-row"><span class="label">Capital:</span> <span class="value">${country.capital ? country.capital[0] : "N/A"}</span></div>
                    <div class="data-row"><span class="label">Region:</span> <span class="value">${region}</span></div>
                    <div class="data-row"><span class="label">Population:</span> <span class="value">${population}</span></div>
                    <div class="data-row"><span class="label">Currency:</span> <span class="value">${currencyList}</span></div>
                    <div class="data-row"><span class="label">Languages:</span> <span class="value">${languages}</span></div>
                    <div class="data-row"><span class="label">Timezone:</span> <span class="value">${timezone}</span></div>
                    <div class="data-row"><span class="label">Area:</span> <span class="value">${area}</span></div>
                    <div class="data-row"><span class="label">Maps:</span> <span class="value">${maps}</span></div>
                </div>
            `;
        });
    } catch (err) {
        resultDiv.innerHTML = `<div class="not-found">Country not found. Please check the spelling and try again.</div>`;
    }
});


document.getElementById("resetBtn").addEventListener("click", function() {
    document.getElementById("countryInput").value = "";
    document.getElementById("result").innerHTML = "";
});

input.addEventListener('focus', () => {
    input.select();
});