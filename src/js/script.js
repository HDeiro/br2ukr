// API
const updateQuotes = quotations => fetch(`http://free.currencyconverterapi.com/api/v5/convert?q=${quotations}&compact=y`)
  .then(response => response.text())
  .then(response => JSON.parse(response))
  .then(resolveQuotes)
  .catch(resolveError);

const resolveQuotes = quotes => {
  Object.keys(quotes).forEach(key => localStorage.setItem(key, quotes[key].val.toFixed(2)));
  localStorage.setItem("lastUpdate", new Date().toLocaleDateString("en-us", {
    month: "long",
    year: "numeric",
    day: "2-digit"
  }));
}

const resolveError = error => {
  console.log(error);
}

// Init
window.addEventListener('load', _ => {
  // DOM Refs
  const brl = document.querySelector("#brl");
  const eur = document.querySelector("#eur");
  const uah = document.querySelector("#uah");
  const updatedAt = document.querySelector("#updatedAt");
  
  // Initialize Quotations
  updateQuotes("BRL_EUR,BRL_UAH");
  updateQuotes("EUR_BRL,EUR_UAH");
  updateQuotes("UAH_BRL,UAH_EUR");

  // Utilitary function
  function debounce(callback) {
    let timeout;
    (() => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, 400);
    })();
  }

  const get = item => localStorage.getItem(item);
  
  // Update components
  brl.value = 1;
  uah.value = get("BRL_UAH");
  eur.value = get("BRL_EUR");
  updatedAt.textContent = `Last updated at ${get("lastUpdate")}`;
  
  // Event handling
  brl.onkeyup = _ => debounce(_ => {
    uah.value = (brl.value * get("BRL_UAH")).toFixed(2);
    eur.value = (brl.value * get("BRL_EUR")).toFixed(2);
  });

  eur.onkeyup = _ => debounce(_ => {
    brl.value = (eur.value * get("EUR_BRL")).toFixed(2);
    uah.value = (eur.value * get("EUR_UAH")).toFixed(2);
  });

  uah.onkeyup = _ => debounce(_ => {
    brl.value = (uah.value * get("UAH_BRL")).toFixed(2);
    eur.value = (uah.value * get("UAH_EUR")).toFixed(2);
  });

  // Force update onload
  brl.dispatchEvent(new Event("keyup"));
});