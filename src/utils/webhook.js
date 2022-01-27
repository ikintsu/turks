

const validate_webhook = (u) => {
    const s = u.split("/").reverse();
    if (s.length < 4) {
        return false;
    }

    const url = `https://discord.com/api/webhooks/${s[1]}/${s[0]}`
    return fetch(url)
        .then(res => {
            console.log(res);
            console.log(res.status);

            return res.status === 200;
        });
};

const send_a_test = (urls) => {
    return Promise.all(urls.map(url => fetch(url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    embeds: [
                        {
                            description: "This is a test message :)",
                            color: 3468142
                        }
                    ]
                }
            )
        })));
}

module.exports = {
    validate_webhook,
    send_a_test
}