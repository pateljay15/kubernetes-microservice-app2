const express = require("express")
const cors = require("cors")
const csv = require('csv-parser')
const fs = require("fs");

const app = express()

app.use(
    cors({
      origin: "*",
    })
  );
  
app.use(express.json());

app.post("/calculate", (req, res) => {
    let sum = 0
    let products = []

    if (!req.body.file) {
        return res.status(400).json({
            file: null,
            error: "Invalid JSON input."
        })
    }

    if (fs.existsSync('../Jay_PV_dir/'+req.body.file)) {
        // console.log("file exists")
    } else {
        return res.status(400).json({
            file: req.body.file,
            error: "File not found."
        })
    }

    try {

        const data = fs.readFileSync("../Jay_PV_dir/"+req.body.file, 'utf8');

        // Split the data by new lines to get each row
        const rows = data.trim().split('\n');
          
        // Get the headers from the first row
        const headers = rows[0].split(',').map(header => header.trim());
      
        // Initialize an array to hold the parsed data
        const products = [];
      
        // Loop through the remaining rows and parse the data
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(',').map(value => value.trim());
          const obj = {};
          headers.forEach((header, index) => {
            if (values[index] == '') {
                throw Error()
            } 
            obj[header] = values[index];
          });
          products.push(obj);
        }
      
        console.log(products);

        if (products.length > 0) {
            for (let proObj of products) {

                if (proObj.product.trim().toLowerCase() == req.body.product.trim().toLowerCase()) {
                    sum = sum + parseInt(proObj.amount.trim())
                }
            }
        } else {
            return res.status(400).json({
                file: req.body.file,
                error: "Input file not in CSV format."
            })
        }

        res.status(200).json({
            file: req.body.file,
            sum: sum
        })    

    } catch (error) {
        return res.status(400).json({
            file: req.body.file,
            error: "Input file not in CSV format."
        })
    }
});
  
  
app.listen(6060, () => {
    console.log("server listening on port 6060");
});