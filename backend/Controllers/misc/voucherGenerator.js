const db = require("../../model/index");

const generateVoucherNo = async () => {
    try {
        // Get the current date for voucher number
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2);
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        
        // Find the last voucher number for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const lastVoucher = await db.AccountModel.findOne({
            where: {
                date: {
                    [db.Sequelize.Op.gte]: today,
                    [db.Sequelize.Op.lt]: tomorrow
                }
            },
            order: [['vc_no', 'DESC']]
        });
        
        let sequence = 1;
        if (lastVoucher && lastVoucher.vc_no) {
            // Extract sequence number from last voucher
            const lastSequence = lastVoucher.vc_no.slice(-4);
            sequence = parseInt(lastSequence) + 1;
        }
        
        // Generate voucher number: VC + YYMMDD + 4-digit sequence
        const voucherNo = `VC${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
        
        return voucherNo;
    } catch (error) {
        console.error('Error generating voucher number:', error);
        // Fallback to timestamp-based voucher number
        const timestamp = Date.now().toString().slice(-8);
        return `VC${timestamp}`;
    }
};

module.exports = generateVoucherNo; 