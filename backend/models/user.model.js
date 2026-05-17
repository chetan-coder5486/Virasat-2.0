import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    role: {type:String, enum:['admin','editor','viewer'], default:'viewer'},
    family: {type: mongoose.Schema.Types.ObjectId, ref:'Family'},
    tokenVersion:{            //to invalidate refresh tokens when user logs out or password changes
        type:Number,
        default:0
    },
    bio: {type:String},
    avatar: {type:String, default:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
},{timestamps:true})

// Increment token version (invalidates all refresh tokens)
userSchema.methods.incrementTokenVersion = async function() {
  this.tokenVersion += 1;
  await this.save();
};

export const User = mongoose.model('User', userSchema)