const { Schema, model } = require("mongoose");
const Joi = require("joi");

const ProductSchema = new Schema(
    {        
        code: {
            type: String,
            required: [true, "Code is required"],
            unique: true,
            match: [/^\d{4}$/, 'Code must be a 4-digit number'],
            index: true,
            sparse: true
        },
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        type: {
            type: String,
            required: [true, "Type is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        images: {
            type: [String],
            validate: {
                validator: (v) => {
                    return Array.isArray(v) && v.length >= 1 && v.length <= 4;
                },
                message:
                    "The length of images array must be between 1 and 4 items.",
            },
        },
        // sizes: {
        //     type: {
        //         w: {
        //             type: Number,
        //             required: [true, "Width is required"],
        //             min: [10, "Width must be at least 10"],
        //             max: [200, "Width must not exeed 200"],
        //         },
        //         h: {
        //             type: Number,
        //             required: [true, "Height is required"],
        //             min: [50, "Height must be at least 50"],
        //             max: [200, "Height must not exeed 200"],
        //         },
        //     },
        //     required: true,
        // },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be greater than or equal to 0."],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Reting must be at least 1"],
            max: [5, "Rating must not exeed 5"],
        },
        quantity: {
            type: Number,
            min: [0, "Quantity must be at least 0"],
            max: [999, "Quantity must not exeed 999"],
            default: 0,
        },
        sale: {
            type: {
                status: {
                    type: Boolean,
                    default: false,
                },
                value: {
                    type: Number,
                    min: [0.01, "Sale value must be at least 0.01"],
                    max: [0.25, "Sale value must not exeed 0.25"],
                    validate: {
                        validator: (v) => {
                            return !this.status || v !== undefined;
                        },
                        message:
                            "Field value shouldn't be empty when status is true.",
                    },
                },
            },
            required: true,
        },
        releaseDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Product = model("Product", ProductSchema);

const productValidation = Joi.object({    
    code: Joi.string().length(4).required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    rating: Joi.number().min(1).max(5).required(),
    quantity: Joi.number().integer().min(0).max(999).required(),
    sale: Joi.object({
        status: Joi.boolean().required(),
        value: Joi.number()
            .min(0.01)
            .max(0.25)
            .when("status", { is: true, then: Joi.required() }),
    }),
    releaseDate: Joi.date(),
});

module.exports = {
    Product,
    productValidation,
};

// {
//     title: json,
//     type: json,
//     description: json,
//     images: [1, 2, 3 url],
//     sizes: {
//         w: random(10, 200)
//         h: random(50, 200)
//     },
//     price: json,
//     rating: random(3, 5),
//     code: 0001,
//     quantity: random(0, 999),
//     sale: {
//         status: true/false,
//         if status === true -> value: 0.01 - 0.25
//     },
//     releaseDate: random Date(),

//     createdAt: date of creating document in mongo,
//     updatedAt: date of updating document in mongo,
// }




// images: 
// content: JSON({
//     title:
//     code:
// })


// json.parse({...req.body}.content)


// JSON postman
// {
//     items: [....]
// }

// for(let item of req.body.items){
// await Product.save({...})
// }
