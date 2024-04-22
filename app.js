const currencyOneEl = document.querySelector('[data-js="currency-one"]');
const currencyTwoEl = document.querySelector('[data-js="currency-two"]');
//div onde será inserido o aviso de erro
const currenciesEL = document.querySelector('[data-js="currencies-container"]');

const getErrorMessage = errorType => ({
  'unsupported-code': 'a moeda não existe em nosso banco de dados',
  'malformed-request': 'a solicitação de conversão não é válida',
  'invalid-key': 'a chave da API não é válida',
  'inactive-account': 'a conta está inativa',
  'quota-reached': 'a cota de solicitações foi atingida',
})[errorType] || 'não foi possível obter as informações'

const fetchExchangeRate = async () => {
  try {
    const response = await fetch('https://v6.exchangerate-api.com/v6/5861b7ff3ae03b0fc88cc183/latest/USD');
    const exchangeRateData = await response.json();

    //se request mal sucedida
    if (!response.ok) {
      throw new Error ('Sua conexão falhou. Não foi possível obter as informações.');
    }

    if (exchangeRateData.result === 'error') {
      throw new Error(getErrorMessage(exchangeRateData['error-type']));
    }

    return exchangeRateData;
  } catch (error) {
    const div = document.createElement('div');
    const button = document.createElement('button');

    div.textContent = error.message;
    div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    div.setAttribute('role', 'alert')
    button.classList.add('btn-close');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Close');

    button.addEventListener('click', () => {
      div.remove();
    })

    div.appendChild(button)
    currenciesEL.insertAdjacentElement('afterend', div);

    console.log(div);
    /*
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      Mensagem de erro
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    */
  }
}

//initialize
const init = async () => {
  const exchangeRateData = await fetchExchangeRate();

  const getOptions = selectedCurrency => Object.keys(exchangeRateData.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('')

  currencyOneEl.innerHTML = getOptions('USD');
  currencyTwoEl.innerHTML = getOptions('BRL')
}

init();
