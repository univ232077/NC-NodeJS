const fs = require("fs");
const path = require("path");
const input = require("./input.js");

const PRODUCTS_FILE = path.resolve(__dirname, "products.json");

function isJsonValid(strToCheck) {
    try {
        const jsonObject = JSON.parse(strToCheck)
        return jsonObject && typeof jsonObject === "object";
    } catch (e) {
        return false;
    }
}

function writeToProductsFile(data) {
    return new Promise(((resolve, reject) => {
        fs.writeFile(PRODUCTS_FILE, data, (err) => {
            if (err) reject(err)
            else resolve();
        })
    }))
}

function getProductsContent() {
    return new Promise(((resolve) => {
        fs.readFile(PRODUCTS_FILE, {encoding: "utf-8"}, async (err, buffer) => {
            if (!err)
                resolve(buffer);
            else
                resolve(null);
        })
    }))
}

function Product(productID, name, price, imageURL) {
    this.productID = productID;
    this.name = name;
    this.price = price;
    this.imageURL = imageURL;
}

async function edit() {
    const fileContent = await getProductsContent();
    const products = isJsonValid(fileContent) ? JSON.parse(fileContent.toString()) : [];

    if (!products.length) {
        console.error("У вас нет ни одного товара!");
        return false;
    }

    const productID = parseInt((await input.get("Введите ID товара который вы хотите изменить:")).toString());
    if (typeof productID !== "number" ||
        isNaN(productID) ||
        !products.filter((product) => product.productID === productID).length
    ) {
        console.error("Данного товара не существует!");
        return false;
    }

    const index = products.map((item) => {
        return item.productID;
    }).indexOf(productID);
    products[index].name = await input.get("Введите имя товара:");
    products[index].price = parseInt((await input.get("Введите цену товара:")).toString());
    products[index].imageURL = await input.get("Введите URL картинки товара:");

    await writeToProductsFile(JSON.stringify(products, null, 4));
    console.log("Товар был успешно изменён!");
    return true;
}

async function remove() {
    const content = await getProductsContent();
    const products = isJsonValid(content) ? JSON.parse(content.toString()) : [];

    if (!products.length) {
        console.error("У вас нет ни одного товара!");
        return false;
    }

    const productID = parseInt((await input.get("Введите ID товара для удаления:")).toString());
    const index = products.map((item) => {
        return item.productID;
    }).indexOf(productID);
    if (index === -1) {
        console.error("Данного ID товара не существует!");
        return false;
    }

    products.splice(index, 1);

    await writeToProductsFile(JSON.stringify(products, null, 4));
    console.log(`Товар с кодом ${productID} был удалён!`)
}

async function add() {
    const fileContent = await getProductsContent();
    const products = isJsonValid(fileContent) ? JSON.parse(fileContent.toString()) : [];

    const productID = parseInt((await input.get("Введите ID товара:")).toString());
    if (typeof productID !== "number" || isNaN(productID)) {
        console.error("Неверный ID товара!");
        return false;
    }

    if (products.filter((product) => product.productID === productID).length) {
        console.error("Данный ID товара уже существует!");
        return false;
    }

    const productName = await input.get("Введите имя товара:");
    const productPrice = parseInt((await input.get("Введите цену товара:")).toString());
    const productImage = await input.get("Введите URL картинки товара:");
    const newProduct = new Product(productID, productName, productPrice, productImage);

    products.push(newProduct);

    await writeToProductsFile(JSON.stringify(products, null, 4));
    console.log("Новый товар был успешно добавлен!");

    return true;
}

async function printAll() {
    const productsContent = await getProductsContent();
    const productsJSON = isJsonValid(productsContent) ? productsContent : [];
    console.log(productsJSON);
}

module.exports = {
    edit,
    remove,
    add,
    printAll
};
