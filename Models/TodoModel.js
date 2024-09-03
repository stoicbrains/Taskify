const mongoose = require('mongoose');

const TodoSchema = ({
    time:{
        type:Date,
        default:Date.now,
    },
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    },
    desc:{
        type:String,
        required:true,
        trim:true,
        maxlength:300
    },
    completed:{
        type:Boolean,
        default:false
    },
    username:{
        type:String,
        required:true,
    }
});

const TodoModel = new mongoose.model("Todo",TodoSchema);
module.exports = TodoModel;