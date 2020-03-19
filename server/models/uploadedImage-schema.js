const mongoose = require('mongoose');

//Save data for image with id, name, description and uploadedImage itself
const uploadedImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, require: true},
    image: {type: String, require: true},
    uploadedImage: {type: String, required: true}

});

module.exports = mongoose.model('UploadedImage', uploadedImageSchema);