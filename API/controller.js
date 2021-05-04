var Userdb = require("../models/productModel")
const Codes = require("../models/generateCouponModel")



//create and save product


exports.create = (req, res) => {
    //validate req
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty" });
        return;
    }

    //new user
    const Product = new Userdb({
        name: req.body.name,
        detail: req.body.detail,
        price: req.body.price,
        status: req.body.status,
        users : req.body.users,
        flat : req.body.flat,
        transcations : req.body.transcations,
        data_size : req.body.data_size,
        gst : req.body.gst,
        total : req.body.total,
        
    
    })
    

    // user.users.update()

    //save user in data base
    Product
        .save(Product)
        .then(data => {
            // res.send(data)
            res.redirect('/admin')
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occur"
            });
        });
    
    

}

//reterive and return all products / reterive and return single user

exports.find = (req, res) => {

    if (req.query.id) {
        const id = req.query.id;
        // console.log(req.query.id)

        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user" })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error reterived" })
            })
    } else {
        Userdb.find()
            .then(Product => {
                res.send(Product)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occured" });
            });

    }




}


//update a product

exports.update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot update data" })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error update" })
        })


}

//Delete a product

exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot delete id" })

            }
            else {
                res.send({
                    message: "User was deleted successfully"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user"
            })
        })

}


// users.codes.insertOne({name : "jack"})

exports.orders = (req , res) =>{
    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot update data" })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error update" })
        })
}

// exports.store = (req , res)=>{
//     const {phone , address} = req.body
//     if(!phone || !address) {
//         req.flash('error' , "All fields are required" )
//         return res.redirect("/complete")
//     }

//     const order = new Order({
//         // customerId : req.user._id,
//         items : req.Userdb,
//         phone,
//         address
//     })

//     order.save().then(result =>{
//         req.flash('success', "Order placed successfully")
//         return res.redirect("/admin")
//     }).catch(err=>{
//         req.flash('error' , "Something went wrong")
//         return res.redirect('/complete')
//     })

// }