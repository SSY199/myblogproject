import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // unique: true,
  },
  profilePicture: {
    type: String,
    default: "https://files.oaiusercontent.com/file-1C6r4vaazQ5nymhsVN3oiE?se=2024-12-09T04%3A03%3A40Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D810ac378-9ae5-47ba-a36a-edea1c9bad6a.webp&sig=ia8SDcvL6tSZvWuTyXJCzF4GwnJX9nj6i9Vl6TUuRvk%3D",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
},
{timestamps: true}
);

const User = mongoose.model('User', userSchema);

export default User;