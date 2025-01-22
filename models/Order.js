const { required } = require("joi");
const { Schema, model } = require("mongoose");
const Joi = require("joi");

const itemSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, "product id is required (mongo _id)"],
    },
    title: {
        type: String,
        required: [true, "product title is required (string)"],
    },
    price:{
        type: Number,
        required: [true, "product price is required (number)"],
    },
    amount: {
        type: Number,
        required: [true, "product amount is required (number)"],
    },
    image: {
        type: String,
        required: [true, "image is required (string)"],
    }
})

const OrderSchema = new Schema(
    {       
        user: {
            type: {
                _id: {
                    type: Schema.Types.ObjectId,
                    required: [true, "user id is required (mongo _id)"],                   
                },
                name: {
                    type: String,
                    required: [true, "user name is required (string)"],
                },
                email: {
                    type: String,
                    required: [true, "user email is required (string)"],
                },
            }
        },
        address: {
            type: {
                city: {
                    type: String,
                    required: [true, "address (city) is required (string)"],
                },
                street: {
                    type: String,
                    required: [true, "address (street) is required (string)"],
                },
                house: {
                    type: String,
                    required: [true, "address (house) is required (string)"],
                },
                app: {
                    type: String,
                    required: [true, "address (appartment) is required (string)"],
                }
            }
        },
        order: {
            type: {
                items: [itemSchema],
                discountedPrice: {
                    type: Number,
                    required: true,
                },
                fullPrice: {
                    type: Number,
                    required: true,
                },
            }
        },
        map: {
            type: [String],
            required: [true, "map cords are required ([string])"],
        },
        delivery: {
            type: [String, Date],
            required: [true, "date is required (date)"],
        },
        isPayed: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Order = model("Order", OrderSchema);

const orderValidation = Joi.object({    
    user: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().alphanum().min(3).max(30).required(),
        email:  Joi.string().required(),
    }), 
    address: Joi.object({
        city: Joi.string().required(),
        street: Joi.string().required(),
        house:  Joi.string().required(),
        app:  Joi.string().required(),
    }),
    order: Joi.object({
        items: Joi.array().items(Joi.object({
            _id: Joi.string().required(),
            title: Joi.string().required(),
            price: Joi.number().min(0).required(),
            amount: Joi.number().min(0).max(999).required(),
            image: Joi.string().required(),
        })),
        discountedPrice: Joi.number().required(),       
        fullPrice: Joi.number().required(),       
        // total: Joi.number().min(0).required(),
    }),
    map: Joi.array().items(Joi.string().min(1).required()).length(2),
    // orderDate: Joi.date().required(),    
    delivery: Joi.array().items(Joi.string(), Joi.date()).required(),
    isPayed: Joi.boolean().default(false),    
});

module.exports = {
    Order,
    orderValidation,
};


