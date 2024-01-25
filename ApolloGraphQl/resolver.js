import { books } from "./dummyData.js";
export const resolvers = {
    Query: {
      books: () => books,
    },
};