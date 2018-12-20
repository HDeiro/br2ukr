"use strict";

// API
var updateQuotes = function updateQuotes(quotations) {
  return fetch("http://free.currencyconverterapi.com/api/v5/convert?q=" + quotations + "&compact=y").then(function (response) {
    return response.text();
  }).then(function (response) {
    return JSON.parse(response);
  }).then(resolveQuotes).catch(resolveError);
};

var resolveQuotes = function resolveQuotes(quotes) {
  Object.keys(quotes).forEach(function (key) {
    return localStorage.setItem(key, quotes[key].val.toFixed(2));
  });
  localStorage.setItem("lastUpdate", new Date().toLocaleDateString("en-us", {
    month: "long",
    year: "numeric",
    day: "2-digit"
  }));
};

var resolveError = function resolveError(error) {
  console.log(error);
};

// Init
window.addEventListener('load', function (_) {
  // DOM Refs
  var brl = document.querySelector("#brl");
  var eur = document.querySelector("#eur");
  var uah = document.querySelector("#uah");
  var updatedAt = document.querySelector("#updatedAt");

  // Initialize Quotations
  updateQuotes("BRL_EUR,BRL_UAH");
  updateQuotes("EUR_BRL,EUR_UAH");
  updateQuotes("UAH_BRL,UAH_EUR");

  // Utilitary function
  function debounce(callback) {
    var timeout = void 0;
    (function () {
      clearTimeout(timeout);
      timeout = setTimeout(callback, 400);
    })();
  }

  var get = function get(item) {
    return localStorage.getItem(item);
  };

  // Update components
  brl.value = 1;
  uah.value = get("BRL_UAH");
  eur.value = get("BRL_EUR");
  updatedAt.textContent = "Last updated at " + get("lastUpdate");

  // Event handling
  brl.onkeyup = function (_) {
    return debounce(function (_) {
      uah.value = (brl.value * get("BRL_UAH")).toFixed(2);
      eur.value = (brl.value * get("BRL_EUR")).toFixed(2);
    });
  };

  eur.onkeyup = function (_) {
    return debounce(function (_) {
      brl.value = (eur.value * get("EUR_BRL")).toFixed(2);
      uah.value = (eur.value * get("EUR_UAH")).toFixed(2);
    });
  };

  uah.onkeyup = function (_) {
    return debounce(function (_) {
      brl.value = (uah.value * get("UAH_BRL")).toFixed(2);
      eur.value = (uah.value * get("UAH_EUR")).toFixed(2);
    });
  };

  // Force update onload
  brl.dispatchEvent(new Event("keyup"));
});