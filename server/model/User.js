import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
     image: {type: String, required: true},
    contact: {
        type: String,
        trim: true,
        default: ''
    },
    country: {
        type: String,
        trim: true,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'vip_client', 'client', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'closed'],
        default: 'active'
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;