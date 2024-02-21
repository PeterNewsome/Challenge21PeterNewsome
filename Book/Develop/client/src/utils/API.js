import { gql } from '@apollo/client';
import client from './apolloClient';

// GraphQL mutations and query
const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

const SAVE_BOOK = gql`
  mutation SaveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      savedBooks {
        bookId
      }
    }
  }
`;

// Adapted API utility functions to use GraphQL
export const loginUser = async (userData) => {
  const { data } = await client.mutate({
    mutation: LOGIN_USER,
    variables: {
      email: userData.email,
      password: userData.password,
    },
  });
  return data.login;
};

export const createUser = async (userData) => {
  const { data } = await client.mutate({
    mutation: CREATE_USER,
    variables: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    },
  });
  return data.addUser;
};

export const saveBook = async (bookData, token) => {
  const { data } = await client.mutate({
    mutation: SAVE_BOOK,
    variables: {
      bookData,
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  return data.saveBook;
};

export const deleteBook = async (bookId, token) => {
  const { data } = await client.mutate({
    mutation: REMOVE_BOOK,
    variables: {
      bookId,
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  return data.removeBook;
};

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// This function remains the same since it's a direct API call to Google Books
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
