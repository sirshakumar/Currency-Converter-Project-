// ===== CONFIGURATION =====
const API_KEY = "2fde2833cfdf4aea833a30e9"; // Your ExchangeRate API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`;

// ===== DOM ELEMENTS =====
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ===== POPULATE DROPDOWNS =====
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Update flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ===== FETCH & DISPLAY EXCHANGE RATE =====
const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  // Validate amount
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  try {
    // Build API URL
    const URL = `${BASE_URL}/${fromCurr.value}/${toCurr.value}`;
    let response = await fetch(URL);
    let data = await response.json();

    if (data.result === "success") {
      let rate = data.conversion_rate;
      let finalAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "Error: Unable to fetch exchange rate.";
    }
  } catch (error) {
    msg.innerText = "Network error. Please try again.";
  }
};

// ===== UPDATE FLAG IMAGE =====
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ===== EVENT LISTENERS =====
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Fetch exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
