const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Candidate = require('./candidate');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber:{
        type: Number,
        required: true,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    role:{
        type: String,
        enum: ["voter","admin"],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
})

// userSchema.pre('save', async function(next){

//     const user = this;
//     // Hash the password only if it has been modified (or is new)
//     if(!user.isModified('password')) return next();
//     try {
//         // hash password generation
//         const salt = await bcrypt.genSalt(10);

//         // hash password
//         const hashPassword = await bcrypt.hash(user.password, salt);
//         user.password = hashPassword;
//     } catch (error) {
//         return next(error)
//     }
//     next();
// })


// userSchema.methods.comparePassword = async function(candidatePassword){
//     try {
//         const isMatch = await bcrypt.compare(candidatePassword, this.password)
//         return isMatch;
//     } catch (error) {
//         throw(error)
//     }
// }

userSchema.pre('save', async function (next){

    if(!this.isModified('password')){
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    } catch (error) {
        throw(error)
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;