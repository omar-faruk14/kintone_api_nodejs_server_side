const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const { KintoneRestAPIClient } = require("@kintone/rest-api-client");

const sourceClient = new KintoneRestAPIClient({
    baseUrl: "https://kybkt9gzqkzo.cybozu.com",
    auth: { apiToken: 'YWAM5SMqaAtgxba7cUFeGI4HiHkwiz0kUBZ2uAb6' }
});

const targetClient = new KintoneRestAPIClient({
    baseUrl: "https://yj1u9wbleojv.cybozu.com/",
    auth: { apiToken: 'pTPZh8mpeHCUcvxokrgx7frIf6HTCvodzwSgrmH6' }
});

app.listen(4005, () => {
    console.log('Server is running on port 4005');
});


// Endpoint to fetch data from the source Kintone instance
app.get('/fetch_data', (req, res) => {
    sourceClient.record
        .getRecords({ app: "4" })
        .then((resp) => {
            const records = resp.records.map(record => {
                return {
                    id: record.id.value,
                    Name: record.Name.value,
                    Email: record.Email.value,
                    Details: record.Details.value,
                };
            });
            records.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            res.json(records);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Error retrieving records' });
        });
});

app.get('/push_data', (req, res) => {
    sourceClient.record
        .getRecords({ app: "4" })
        .then((resp) => {
            const records = resp.records.map(record => {
                return {
                    id: { value: record.id.value },
                    Name: { value: record.Name.value },
                    Email: { value: record.Email.value },
                    Details: { value: record.Details.value },
                };
            });

            targetClient.record
                .addRecords({ app: "1", records })
                .then((response) => {
                    res.json({ message: 'Records pushed successfully to the target Kintone instance' });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: 'Error pushing records to the target instance' });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Error retrieving records' });
        });
});




