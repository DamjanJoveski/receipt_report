const express = require('express');
const app = express();
let PORT = 3000;
const axios = require('axios');

app.use(express.json());


async function getReceipt (){
    const response = await axios.get('https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1')
    return response.data;
}

function processData (data){
    const domestic = [];
    const imported = [];
    let domesticCost = 0;
    let importedCost = 0;

    data.forEach((product) => {
        if (!product.weight) {
            product.weight = 'N/A';
        }

        if (product.domestic) {
            domestic.push(product);
            domesticCost += product.price;
        } else {
            imported.push(product);
            importedCost += product.price;
        }

        if (product.description.length > 10) {
            product.description = product.description.substring(0, 10) + '...';
        }
    });


    domestic.sort(function (a, b) {
        return a.name < b.name ? -1 : 1;
    });
    imported.sort(function (a, b) {
        return a.name < b.name ? -1 : 1;
    });

    const processedData = {
        'Domestic':domestic,
        'DomesticCost':domesticCost,
        'Imported':imported,
        'ImportedCost':importedCost
    }

    return processedData

}

app.listen(PORT, async function () {
    console.log(`Server running on port:${PORT}`)
    console.log('Retrieving receipt...')
    const data = await getReceipt();
    const {Domestic, Imported, DomesticCost, ImportedCost} = processData(data)
    console.log(
        'Domestic:\n' +
        Domestic.map((product) => {
            return (
                `\t${product.name}\n` +
                `\tPrice: ${product.price}\n` +
                `\t${product.description}\n` +
                `\tWeight: ${product.weight}\n`
            );
        }).join('') +

        'Imported:\n' +
        Imported.map((product) => {
            return (
                `\t${product.name}\n` +
                `\tPrice: ${product.price}\n` +
                `\t${product.description}\n` +
                `\tWeight: ${product.weight}\n`
            );
        }).join('') +

        '\nDomestic Cost: ' + DomesticCost + '\n' +
        'Imported Cost: ' + ImportedCost + '\n' +
        'Domestic Count: ' + Domestic.length + '\n' +
        'Imported Count: ' + Imported.length
    );
});

