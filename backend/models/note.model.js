const mogoose=require('mongoose')


const noteSchema=mogoose.Schema({
    text:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false
    }
});

const noteModel=mogoose.model('note',noteSchema);

module.exports=noteModel;