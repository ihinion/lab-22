const nameField = document.getElementById('name_field');
const emailField = document.getElementById('email_field');
const textField = document.getElementById('quote_text_field');
const form = document.forms['form_block'];
const quotelistDiv = document.getElementById('quote_list');
const resultDiv = document.getElementById('result');


async function createQuote(event) {
    event.preventDefault();
    let response;
    try {
        response = await makeRequest(BASE_API_URL + 'quote/', 'POST', {
        author: nameField.value,
        email: emailField.value,
        text: textField.value
    });
        let data = await response.json();
        console.log(data)
        showResult(data, 'answer');
    }
    catch (error) {
        error = await error.response
        response= await error
        response= await response.json()
        console.log(response)
        showResult(response, 'error');
    }
    form.reset();
    data = await response;
    hideForm();
    console.log(data);
}

window.addEventListener('load', function () {
    const submitBtn = document.getElementById('btnsubmit')
    submitBtn.onclick = createQuote;
});

async function makeQuoteList() {
    await hideForm();
    $(resultDiv).html("");
    let response = await makeRequest(BASE_API_URL + `quote/`, 'GET');
    let quoteArray = await response.json()
    console.log(quoteArray)
    if( $(quotelistDiv).is(':empty') ){
        for (let quote of quoteArray) {
		addQuoteCard(quote)
	}} else {
        $(quotelistDiv).html("");
        for (let quote of quoteArray) {
		addQuoteCard(quote)
	}}
}

async function makeSingleQuote() {
    await hideForm();
    $(resultDiv).html("");
    let quotePk = this.id;
    let response = await makeRequest(BASE_API_URL + `quote/` + quotePk, 'GET');
    quote = await response.json();
    console.log(quote);
    $(quotelistDiv).html("");
    addQuoteCard(quote);
}

function addQuoteCard(quote) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.classList.add('mb-3');

    let cardHeaderDiv = document.createElement('div');
    cardHeaderDiv.classList.add('card-header');
    cardHeaderDiv.textContent = `Added: ${quote['created_at']}`;
    cardDiv.append(cardHeaderDiv);

    let cardHeaderDivRating = document.createElement('div');
    cardHeaderDivRating.textContent = `Rating: `
    let counter = document.createElement('span')
    counter.classList.add('counter')
    counter.textContent = `${quote['rating']}`
    cardHeaderDivRating.append(counter)
    cardHeaderDivRating.append(document.createElement('br'))

    let ratingLike = document.createElement('a');
    let ratingDislike = document.createElement('a');
    ratingDislike.textContent = '-'
    ratingLike.textContent = '+'
    ratingLike.classList.add('badge', 'badge-light');
    ratingDislike.classList.add('badge', 'badge-light');
    ratingLike.id = quote.id + 'like';
    ratingDislike.id = quote.id + 'dislike';

    ratingLike.onclick = onLike;
    ratingDislike.onclick = onDislike;

    cardHeaderDivRating.append(ratingDislike);
    cardHeaderDivRating.append(ratingLike);
    cardHeaderDiv.append(cardHeaderDivRating);

    let cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');
    cardDiv.append(cardBodyDiv);

    let cardBlockquote = document.createElement('blockquote');
    cardBlockquote.classList.add('blockquote');
    cardBlockquote.classList.add('mb-0');
    cardBodyDiv.append(cardBlockquote);

    let cardBlockquoteText = document.createElement('p');
    cardBlockquoteText.textContent = quote['text'];
    cardBlockquote.append(cardBlockquoteText);


    let cardBlockquoteFooter = document.createElement('footer');
    cardBlockquoteFooter.classList.add('blockquote-footer');
    cardBlockquoteFooter.textContent = quote['author'];
    cardBlockquote.append(cardBlockquoteFooter);

    let quoteLinkBtn = document.createElement('a');
    quoteLinkBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'mt-3');
    quoteLinkBtn.onclick = makeSingleQuote;
    quoteLinkBtn.textContent = 'View quote';
    quoteLinkBtn.id = quote.id;
    cardBodyDiv.append(quoteLinkBtn)

    quotelistDiv.append(cardDiv);
}

async function displayForm() {
    form.style.display = 'inline';
    $(quotelistDiv).html("");
}

async function hideForm() {
    form.style.display = 'none';
}

async function showResult(data, key) {
    resultDiv.style.removeProperty('color')
    $(resultDiv).html("");
    if (key==='error') {
        console.log(data)
        for (field of data) {
            let errorDiv = document.createElement('div')
            errorDiv.textContent = `Error in ${field} field: ${data[field]}`
            console.log(field)
            resultDiv.append(errorDiv)
        }
        resultDiv.style['color'] = 'red'
    } else if (key==='answer') {
        resultDiv.textContent = `Your quote was added succesfully`
        resultDiv.style['color'] = 'green'
    }
}