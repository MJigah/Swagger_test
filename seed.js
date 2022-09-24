const data = {
    meals: [
        {
            name: "Fried Rice with Chicken",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nam possimus vel, non voluptates ipsum.",
            price: 450.99,
            category: "Big man Size",
            count_in_stock: 5,
        },
        {
            name: "Fried Rice with Beef",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nam possimus vel, non voluptates ipsum.",
            price: 350.00,
            category: "Big man Size",
            count_in_stock: 2,
        },
        {
            name: "Jollof Spaghetti with Chicken",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nam possimus vel, non voluptates ipsum.",
            price: 400.00,
            category: "Big man Size",
            count_in_stock: 1,
        },
        {
            name: "Rice and Beans",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nam possimus vel, non voluptates ipsum.",
            price: 200.50,
            category: "Hungry man Size",
            count_in_stock: 8,
        },
        {
            name: "Bucket Chicken",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nam possimus vel, non voluptates ipsum.",
            price: 5000.00,
            category: "Family Size",
            count_in_stock: 10,
        }
    ],
    orders: [
        {
            userId: '6329d01c7703617f421d1c68',
            order_item: {
                name: 'Fried Rice with Chicken',
                quantity: 4,
                image: './images/image.jpg',
                price: 450.99,
                meal: '632c62dd9b6ac77bfeae97bc'
            },
            order_date: '2022-09-22',
            shipping_address: {
                address: 'No 34A Gabon Crescent, Barnawa, Kaduna',
                city: 'Kaduna',
                postal_code: 800283
            },
            payment_method: 'Stripe',
            payment_result: {
                id: '123abc',
                status: 'Successful',
                update_time: '2022-09-20T14:42:13.746+00:00',
                email_address: 'seedDB@gmail.com'
            },
            total_price: 18203.96,
        }
    ],
    reviews: [
        {
            userId: '6329d01c7703617f421d1c68',
            comments: 'This Store is one of the best in town, really awesome delivery time!!',
            ratings: 4.5
        },{
            userId: '6329d01c7703617f421d1c68',
            comments: 'This Store is sophisticated, but can do more',
            ratings: 3
        },
        {
            userId: '6329d01c7703617f421d1c68',
            comments: 'This Store is terribly aweful',
            ratings: 0.5
        }
    ]
}

module.exports = data;