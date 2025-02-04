// {
//     _id: new ObjectId('6794d8ceab376a44702f211a'),
//     user: {
//       _id: new ObjectId('672bb495256a7ec7da799de0'),
//       name: 'Gleb',
//       email: 'empty@mail.ru'
//     },
//     address: {
//       city: 'Moscow',
//       street: 'Grayvoronovskaya',
//       house: '12',
//       app: '12',
//       _id: new ObjectId('6794d8ceab376a44702f211b')
//     },
//     order: {
//       items: [ [Object], [Object] ],
//       discountedPrice: 121.03,
//       fullPrice: 133,
//       _id: new ObjectId('6794d8ceab376a44702f211c')
//     },
//     map: [ 'fghfgh', 'dfgdfgd' ],
//     delivery: [ 'courier', '1737894478629' ],
//     isPayed: false,
//     createdAt: 2025-01-25T12:27:58.664Z,
//     updatedAt: 2025-01-25T12:27:58.664Z,
//     __v: 0
//   }


{/* <img src="./cache/images/1734976138494milk_c.jpg" alt=""> */ }

function emailCompose(order) {

    const { order: details } = order;

    const orderHtml = details.items.map((item) => (
        `<div class="flex">
            <img src="https://images.pexels.com/photos/3766180/pexels-photo-3766180.jpeg?cs=srgb&dl=pexels-alexazabache-3766180.jpg&fm=jpg" alt="pic">
            <div>
                <p>${item.title} - ${item.amount} pcs.</p>
                <p>${item.price.toFixed(2)}$</p>
            </div>        
        </div>`

    )).join('');


    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .order-details {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid black;
        }
        h2 {
            text-align: center;
        }
        .section {
            margin-bottom: 20px;
        }
        .section label {
            font-weight: bold;
        } 
        img {
            width: 80px;
            height: 80px;
            margin: 10px;

            object-fit: cover;
            border-radius: 8px;
        }
        .flex {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .indent {
            margin-left: 20px;
        }
    </style>
</head>
<body>

<div class="order-details">
    <h2>Order details</h2>
    
    <!-- Email -->
    <div class="section">
        <label for="email">E-Mail:</label>
        <p class="indent" id="email">${order.user.email}</p>
    </div>

    <!-- Address -->
    <div class="section">
        <label for="address">Delivery address:</label>
        <div class="address indent">
            <p><strong>City: </strong> ${order.address.city}</p>
            <p><strong>Street: </strong> ${order.address.street}</p>
            <p><strong>House: </strong> ${order.address.house}</p>
            <p><strong>Appartment: </strong> ${order.address.app}</p>
        </div>
    </div>    

    <!-- Order content -->
    <div class="section">
         <label for="flex">Order details:</label>
        ${orderHtml}
    </div>

    <div class="section">
    <label for="price">Order price:</label>
        <h4 class="price indent">Total: ${order.order.discountedPrice.toFixed(2)}$</h4>
        <h4 class="price indent">Discount: ${(order.order.fullPrice - order.order.discountedPrice).toFixed(2)}$</h4>
    </div>
</div>
</body>
</html>`;
}

module.exports = emailCompose;






