const db = require("../../model/index");
const CustomerModel = db.CustomerModel;

const generateCustomerID = async () => {
    let nextSeq = 11001;
    const lastCustomer = await CustomerModel.findOne({
        order: [['customer_id', 'DESC']]
    });

    if (lastCustomer && lastCustomer.customer_id) {
        nextSeq = lastCustomer.customer_id + 1;
    }

    return nextSeq;
};

module.exports = generateCustomerID;
