require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// const multer = require("multer");

const authRouter = require("./routes/authRouter.js");
const productRouter = require("./routes/productRouter.js");
const orderRouter = require("./routes/orderRouter.js");

const port = process.env.PORT || 5000;
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/cache/images", express.static("cache/images")); // http://localhost:8080/cache/images..../

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/test");
        console.log("connected to mongo db");
        app.listen(port, () => console.log("Server is up on port: " + port));
    } catch (e) {
        console.log(e);
    }
};

// function exampleObj() {
//     return JSON.stringify({
//         title: 'Example product',
//         type: 'example',
//         description: 'Example desc',
//         price: 1,
//         rating: 4.5,
//         code: '1013',
//         quantity: 10,
//         sale: {
//             status: true,
//             value: 0.09
//         },
//     });
// }

// console.log(exampleObj());
start();

// добавить коллецию и модель продукт (имя, цена, количество, код)
// добавить маршрут и контроллер добавления товаров (админ - сразу вернуть сущность из БД)
// добавить маршрут и контроллер удаления товаров (по id и только admin)

// Все собрать через приложение react, заранее в postman авторизовать и использовать ключ, вписанный в env

// 1. Вывести таблицу со всеми товарами (название, код и кнопка удалить)
// вывести данные в консоли

//2. Над таблице сделать форму с 4 полями, и отправлять запрос на добавление товара

// ключ авторизации через options
