import React, { Component } from "react";
import axios from "axios";
import { debounce } from "lodash";

const searchAPI = `https://api.coindesk.com/v1/bpi/currentprice/`;
const supportedCurrences = 'https://api.coindesk.com/v1/bpi/supported-currencies.json';
const currencyHistory = `https://api.coindesk.com/v1/bpi/historical/close.json?currency=`;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

export class SearchField extends Component {
  state = {
      suggestion: [],
      searchResult: []
  };

  // get today's exchange rate
  getCurrentCurrency (currency) {
    return axios.get(proxyUrl + searchAPI + `${currency}.json`)
    .then(res => res.data.bpi[currency])
    .catch(error => {
        console.log('error', error);
    })
  }

  // get exchange rate for the last 31 days
  getCurrencyHistory (currency) {
    return axios.get(proxyUrl + currencyHistory + `${currency}`)
    .then(res => res.data.bpi)
    .catch(error => {
        console.log('error', error);
    })
  }
  
  // make string with exchange rate for 1 btc
  generateCurrencyRate(currentCurrency) {
    let resultDiv = document.getElementsByClassName('search-result');
    let p = document.createElement("P");
    let v = document.createTextNode(`1 BTC = ${currentCurrency.rate} ${currentCurrency.code}`);  
    p.setAttribute('class', 'currency-rate');
    p.appendChild(v);   
    resultDiv[0].appendChild(p);
  }

  // generate table with exchange rate history
  generateHistoryTable(currencyHistory) {
    let resultDiv = document.getElementsByClassName('search-result');
    let table = document.createElement('TABLE');
    let day = 30;
    let period = 10;

    for (let i = 10; i > 0; i--) {
      var tr = document.createElement('TR');
      for (let j = 0; j < 3; j++) {
          var td = document.createElement('TD')
          td.appendChild(document.createTextNode(`${Object.keys(currencyHistory)[day-(period*j)]} - ${Object.values(currencyHistory)[day-(period*j)]}`));
          tr.appendChild(td)
      }
      day--;
      table.appendChild(tr);
      table.setAttribute('class', 'currency-history');
    }

    resultDiv[0].appendChild(table);
  }

  clearResult() {
    let resultDiv = document.getElementsByClassName('search-result');
    while (resultDiv[0].firstChild) {
      resultDiv[0].removeChild(resultDiv[0].firstChild);
    }
  }

  componentDidMount() {
    document.getElementById('currency_input').addEventListener("search", () => {
      this.clearResult();
    });

    // store all available currences
    axios.get(proxyUrl + supportedCurrences) 
    .then(res => this.setState({ suggestion: res.data }))
    .catch(error => {
        console.log('error', error);
    })
  }

  debounceOnChangeEvent(...args) {
    this.debouncedEvent = debounce(...args);
    return e => {
      e.persist();
      return this.debouncedEvent(e);
    }
  }

  // show suggestions for input field
  onChange = (e) => {
    let currencyList = document.getElementById('currency-list');
    currencyList.innerHTML = "";
    this.state.suggestion.forEach((c) => {
      if (c.currency.toLowerCase().includes(e.target.value.toLowerCase())) {
        let option = document.createElement('option');
        option.value = c.currency;
        currencyList.append(option);
      }
    });
  };

  // fire event to generate information about exchange rates
  onSubmit = async(e) => {
    e.preventDefault();

    // hide suggestion list after submit
    document.getElementById('currency_input').addEventListener('keyup',function(e){
      if (e.which === 13) this.blur();
    });

    let input = document.getElementById('currency_input');
    input.value = input.value.toUpperCase();

    // If the input equal to currency, we submit the form
    for (let element of this.state.suggestion) {
      if(element.currency === input.value) {
        let currentCurrency = await this.getCurrentCurrency(input.value);
        let currencyHistory = await this.getCurrencyHistory(input.value);

        this.clearResult();

        this.generateCurrencyRate(currentCurrency);
        this.generateHistoryTable(currencyHistory);
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <p className="main-title">Pick currency to get fresh rates</p>
        <input 
          id="currency_input" 
          type="search" 
          name="currency" 
          placeholder="Type currency name..." 
          list="currency-list"
          autoComplete="off" 
          onChange={this.debounceOnChangeEvent(this.onChange, 200)}
          style={{ flex: "10", padding: "10px", border: "none", outline: "none", marginRight: "auto", marginLeft: "auto", display: "flex", textAlign: "center" }}
        />
        <datalist id="currency-list"></datalist>
        <div className="search-result"></div>
      </form>
    );
  }
}

export default SearchField;
