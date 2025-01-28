import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type: String,required:true},
    description:{type:String,required: true},
    price:{type:Array,required:true},
    image:{type:Number,required: true},
    category:{type:String,required:true},
    subCategory:{type:String,required:true},
    sizes:{type:Array,required:true},
    bestSeller:{type:Number,required:true},
    art1:{type:Number,required:true},
    art2:{type:Number,required:true},
    art3:{type:Number,required:true},
    art4:{type:Number,required:true},
    art5:{type:Number,required:true},
    date:{type:Number,required:true}
}) 
const productModel =mongoose.models.product|| mongoose.model("product",productSchema)
export default productModel