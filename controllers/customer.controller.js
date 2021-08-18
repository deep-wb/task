exports.createCustomer = (req, res) => {

    const customer = new Customer({
                          firstname: req.body.firstname,
                          lastname: req.body.lastname,
                          age: req.body.age,
                          address: req.body.address,
                        });
 
    // Save a Customer in the MongoDB
    customer.save().then(data => {
                    res.status(200).json(data);
                }).catch(err => {
                    res.status(500).json({
                      message: "Fail!",
                      error: err.message
                    });
                });
};
exports.getCustomer = (req, res) => {
    customer.findById(req.params.id).select('-__v')
        .then(customer => {
          res.status(200).json(customer);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.id,
                    error: err
                });                
            }
            return res.status(500).send({
                message: "Error retrieving Customer with id " + req.params.id,
                error: err
            });
        });
  };
  exports.customers = (req, res) => {
    customer.find().select('-__v').then(customerInfos => {
          res.status(200).json(customerInfos);
        }).catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
};
exports.deleteCustomer = (req, res) => {
    let customerId = req.params.id

    customer.findByIdAndRemove(customerId).select('-__v -_id')
        .then(customer => {
            if(!customer) {
              res.status(404).json({
                message: "Does Not exist a Customer with id = " + customerId,
                error: "404",
              });
            }
            res.status(200).json({});
        }).catch(err => {
            return res.status(500).send({
              message: "Error -> Can NOT delete a customer with id = " + customerId,
              error: err.message
            });
        });
};
exports.updateCustomer = (req, res) => {
    // Find customer and update it
    customer.findByIdAndUpdate(
                      req.body._id, 
                      {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        age: req.body.age,
                        address: req.body.address
                      }, 
                        {new: true}
                    ).select('-__v')
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message: "Error -> Can NOT update a customer with id = " + req.params.id,
                    error: "Not Found!"
                });
            }

            res.status(200).json(customer);
        }).catch(err => {
            return res.status(500).send({
              message: "Error -> Can not update a customer with id = " + req.params.id,
              error: err.message
            });
        });
};