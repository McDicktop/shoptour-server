const { Order, orderValidation } = require("../models/Order.js");
const paymentCheck = require("../utils/paymentCheck.js");
const mongoose = require("mongoose");
const evalidator = require("email-validator");
const sentEmail = require("../utils/emailTransporter.js");
const emailCompose = require("../utils/emailCompose.js");

class orderController {
    createOrder = async (req, res) => {
        try {
            const { error } = orderValidation.validate(req.body);
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message });
            }
            const newOrder = new Order({ ...req.body });
            await newOrder.save();
            return res.status(200).json(newOrder);
        } catch (e) {
            res.status(400).json({ message: "Internal server error" });
            console.error(e);
        }
    };
    getUserOrder = async (req, res) => {
        try {
            const orders = await Order.find({ "user._id": req.params.id });
            if (!orders) {
                return res
                    .status(404)
                    .send({ message: "User doesn't have any orders" });
            }
            return res.status(200).json(orders);
        } catch (e) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
    getOrderById = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res
                    .status(404)
                    .send({ message: "Order doesn't exists" });
            }
            return res.status(200).json(order);
        } catch (e) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };

    makePaymentById = async (req, res) => {
        try {
            const { id } = req.params;
            const { number, exp, cvc, email } = req.body;

            // Проверка существования заказа
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).send({ message: "Order not found!" });
            }
            const { createdAt, isPayed } = order;

            // Проверка на оплаченный статус заказа
            if (isPayed) {
                return res
                    .status(200)
                    .json({ message: "Order has already been payed" });
            }
            const currentDate = new Date();
            const paymentTimeout = process.env.TIMEOUTPAYMENT * 1000;

            // Проверка на timeout
            if (currentDate - new Date(createdAt) > paymentTimeout) {
                await Order.findByIdAndDelete(id);
                return res.status(400).json({ message: "Order timed out" });
            }

            // Валидация
            const { isValid, errors } = paymentCheck(number, exp, cvc);
            if (!isValid) {
                return res
                    .status(422)
                    .json({ message: "Payment data is not valid", errors });
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { isPayed: true },
                { new: true }
            );

            //Если добавлена почта для отправки заказа
            if (!email) {
                return res.status(200).json({
                    message: "Order payed",
                    order: updatedOrder,
                });
            }

            if (!evalidator.validate(email)) {
                return res
                    .status(422)
                    .json({ message: "e-mail is not valid" });
            }

            await sentEmail(
                "mcdicktop@gmail.com",
                email,
                "Order details",
                emailCompose(order)
            );

            return res.status(200).json({
                message: `Order payed, sent to ${email}`,
                order: updatedOrder,
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        // Если заказ оплачет, то сообщение об его оплаченном статусе
        // if(оплачен) ...

        // Если с момент создания прошло более 30 минут, то удаляем заказ findByIdAndDelete, и вернем сообщение что заказ просрочился по оплате

        // Если не прошло 30 минут, то валидируем платежные данные и обновляем у заказа статус isPayed на true по ID (findByIdandUpdate)
    };
}

module.exports = new orderController();
