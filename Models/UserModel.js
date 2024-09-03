const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        maxlength:70,
    },
    username:{
        type:String,
        required:true,
        maxlength:70,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
