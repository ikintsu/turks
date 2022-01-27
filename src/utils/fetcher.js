// const url = "https://lacedapi.herokuapp.com";
const url = "http://localhost:3002";

const get_tattoo = (discord_id, store) => {
    // console.log(JSON.stringify(json_query));
    const path = `/gettattoo`;
    console.log(url + path);
    return fetch(url + path, {
        method: 'GET'
    });
};

const post_tattoo = (_id, body) => {

    const path = `/posttattoo?_id=${_id}`;

    return fetch(url + path, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
}

module.exports = {
    get_tattoo,
    post_tattoo
}