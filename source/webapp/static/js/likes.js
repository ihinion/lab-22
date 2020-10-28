async function onLike(event) {
    event.preventDefault();
    let likeBtn = event.target;
    let quoteId = likeBtn.id[0];

    let url = BASE_API_URL + 'quote/' + quoteId + '/upvote/';

    try {
        let response = await makeRequest(url, 'POST');
        let data = await response.text();
        console.log(data);
        const counter = likeBtn.parentElement.getElementsByClassName('counter')[0];
        counter.innerText = data;
    }
    catch (error) {
        console.log(error)
    }
}

async function onDislike(event) {
    event.preventDefault();
    let dislikeBtn = event.target;
    let quoteId = dislikeBtn.id[0];
    let url = BASE_API_URL + 'quote/' + quoteId + '/downvote/';

    try {
        let response = await makeRequest(url, 'POST');
        let data = await response.text();
        console.log(data);
        const counter = dislikeBtn.parentElement.getElementsByClassName('counter')[0];
        counter.innerText = data;
    }
    catch (error) {
        console.log(error)
    }
}