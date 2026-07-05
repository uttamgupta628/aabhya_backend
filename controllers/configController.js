const asyncHandler = require("express-async-handler");

// @desc    Get public payment config (UPI VPA + payee name for QR generation)
// @route   GET /api/config/payment
// @access  Public
const getPaymentConfig = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      upiId: process.env.ORG_UPI_ID || null,
      upiPayeeName: process.env.ORG_UPI_NAME || "Aabhya Foundation",
    },
  });
});

module.exports = { getPaymentConfig };