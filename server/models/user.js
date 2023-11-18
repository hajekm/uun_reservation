const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.createUser = async function (userData) {
    try {
        const user = new this(userData);
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.getUserById = async function (id) {
    try {
        const user = await this.findById(id);
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.updateUser = async function (id, updateData) {
    try {
        const user = await this.findByIdAndUpdate(id, updateData, { new: true });
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.deleteUser = async function (id) {
    try {
        const user = await this.findByIdAndDelete(id);
        return user;
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
