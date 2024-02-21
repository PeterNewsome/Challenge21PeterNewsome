const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id);
      }
      throw new Error('Not authenticated');
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !await user.isCorrectPassword(password)) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign({ _id: user._id }, 'hahahahaitsasecret', { expiresIn: '2h' });
      return { token, user };
    },
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword });

      const token = jwt.sign({ _id: newUser._id }, 'hahahahaitsasecret', { expiresIn: '2h' });
      return { token, user: newUser };
    },
    saveBook: async (_, { bookData }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (_, { bookId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
