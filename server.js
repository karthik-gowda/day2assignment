const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const products = express()
const parser = require('body-parser');
products.use(parser.json())
products.use(parser.urlencoded({ extended: false }));

// set the view engine to ejs
products.set('view engine', 'ejs');
products.set('views', './views');



var product = [];


products.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
})


products.get("/getproducts", async(req, res) => {

    try {
        // getting response array using destructuring
        let [productResponse, userResponse] = await axios.all([
            axios.get('https://fakestoreapi.com/products'),
            axios.get('https://fakestoreapi.com/users')
        ])
        let result = productResponse.data.slice(0, 10)
        product = [...result]
        res.render("index.ejs", { productData: product, userData: userResponse.data })

    } catch (error) {
        console.error(error);
    }
});

// products.get('/getproducts', (req, res) => {
//     const sendGetRequest = async() => {
//         try {
//             const resp = await axios.get('https://fakestoreapi.com/products');
//             // handle success
//             let data = resp.data;
//             res.render('index.ejs', { data: data });
//         } catch (err) {
//             // Handle Error Here
//             console.error(err);
//         }
//     };
//     sendGetRequest();
// });



//Without Async Await
// products.get('/getproducts', (req, res) => {

//     axios.get('https://fakestoreapi.com/products')
//         .then(response => {
//             let data = response.data;
//             // handle success
//             res.render('index.ejs', { data: data });
//         });
// });

// URL mapped to return the fetched products from API along with the newly added product

products.get('/addproduct', async(req, res) => {
    res.render("product.ejs")
})


products.post('/postproduct', async(req, res) => {

    let newProduct = {
        "id": parseInt(req.body.id),
        "title": req.body.title,
        "price": parseFloat(req.body.price),
        "description": req.body.desc,
        "category": req.body.category

    }

    try {
        let response = await axios.get("https://fakestoreapi.com/products");
        let result = response.data.slice(0, 10)
        product = [...result]
        product.push(newProduct)
        res.render('index.ejs', { productData: product })
    } catch (error) {
        console.error(error);
    };
});

products.listen(5000, () => {
    console.log('Server is UP at 5000')
})