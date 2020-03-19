const mongoose = require('mongoose');

//Create schema to hold a list of uploads
const uploadedImageOrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uploadedImage: {type: mongoose.Schema.Types.ObjectId, ref: 'UploadedImage' },
    quantity: {type: Number, default: 1}

});

module.exports = mongoose.model('UploadedImageOrder', uploadedImageOrderSchema);