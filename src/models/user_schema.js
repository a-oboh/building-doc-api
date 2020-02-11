const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    role: String,
    accountNumber: {
        type: String,
        default: ''
    },
    accountName: {
        type: String,
        default: ''
    },
    bvn: {
        type: String,
        default: ''
    },
    resetToken: String,
    resetTokenExpiry: Date,
    verified: {
        type: Boolean,
        default: false
    },
    suspended: {
        type: Boolean,
        default: false
    },
});

UserSchema.virtual('fullName').get(function () {
    return `${this.firstname} ${this.lastname}`;
});

// Hash password
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = this.encryptPassword(this.password);
    next();
});

UserSchema.methods = {
    encryptPassword: (plainTextWord) => {
        if (!plainTextWord) return '';
        const salt = bcrypt.genSaltSync(12);
        return bcrypt.hashSync(plainTextWord, salt);
    },
    comparePassword: function (password) {
        const data = bcrypt.compareSync(password, this.password);
        return data;
    },
};

const User = mongoose.model('User', UserSchema);

module.exports = User;