const currencyOneEl = document.querySelector('[data-js="currency-one"]');
const currencyTwoEl = document.querySelector('[data-js="currency-two"]');
//div onde será inserido o aviso de erro
const currenciesEL = document.querySelector('[data-js="currencies-container"]');
const convertedValueEl = document.querySelector('[data-js="converted-value"]');
const valuePrecissionEl = document.querySelector('[data-js="conversion-precision"]');
const timeCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]');

let internalExchangeRate = {};

const getErrorMessage = errorType => ({
  'unsupported-code': 'A moeda não existe em nosso banco de dados',
  'malformed-request': 'A solicitação de conversão não é válida',
  'invalid-key': 'A chave da API não é válida',
  'inactive-account': 'A conta está inativa',
  'quota-reached': 'A cota de solicitações foi atingida',
})[errorType] || 'Não foi possível obter as informações'

const getUrl = currency => `https://v6.exchangerate-api.com/v6/5861b7ff3ae03b0fc88cc183/latest/${currency}`;

//recebe a url da API e retorna os dados da API
const fetchExchangeRate = async url => {
  try {
    const response = await fetch(url);
    const exchangeRateData = await response.json();

    //se request mal sucedida
    // if (!response.ok) {
    //   throw new Error ('Sua conexão falhou. Não foi possível obter as informações.');
    // }

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
    //insert error warning after currenciesEL
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
  //const exchangeRateData = await fetchExchangeRate(getUrl('USD'));

  internalExchangeRate = {... (await fetchExchangeRate(getUrl('USD')))};

  const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('');

  currencyOneEl.innerHTML = getOptions('USD');
  currencyTwoEl.innerHTML = getOptions('BRL');

  convertedValueEl.textContent = internalExchangeRate.conversion_rates.BRL.toFixed(2);

  valuePrecissionEl.textContent = `1 ${currencyOneEl.value} = ${internalExchangeRate.conversion_rates.BRL} ${currencyTwoEl.value}`;
}

//multiplica a quantidade de moeda 1 pelo valor da moeda 2
timeCurrencyOneEl.addEventListener('input', (e) => {
  convertedValueEl.textContent = (e.target.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2);
  //console.log(e.target.value);
});

//atualiza o valor da moeda 2 ao selecionar outra moeda
currencyTwoEl.addEventListener('input', (e) => {
  const currencyTwoValue = internalExchangeRate.conversion_rates[e.target.value];

  convertedValueEl.textContent = (timeCurrencyOneEl.value *currencyTwoValue).toFixed(2);
  
  valuePrecissionEl.textContent = `1 ${currencyOneEl.value} = ${1 * internalExchangeRate.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`;
});

//após o valor da primeira moeda ser alterado, é realizado um novo fetch para os valores da primeira moeda
currencyOneEl.addEventListener('input', async e => {
  const exchangeRateData = await fetchExchangeRate(getUrl(e.target.value));

  internalExchangeRate = {... exchangeRateData};
  
  console.log(internalExchangeRate);
});


init();
