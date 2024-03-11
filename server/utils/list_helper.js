const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  let maxLikes = -1;
  let favorite = null;

  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favorite = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      };
    }
  });

  return favorite;
};

// const mostBlogs = (blogs) => {
//   if (blogs.length === 0) return null;

//   const authorCounts = _.countBy(blogs, "author");

//   const maxBlogs = _.max(Object.values(authorCounts));

//   const topAuthor = _.findKey(authorCounts, (count) => count === maxBlogs);

//   return { author: topAuthor, blogs: maxBlogs };
// };

const mostLikes = (blogs) => {
  // Create an object to store the total likes for each author
  const likesByAuthor = {};

  // Iterate through the blogs array
  blogs.forEach((blog) => {
    // If the author already exists in likesByAuthor, add the likes to their total
    if (likesByAuthor[blog.author]) {
      likesByAuthor[blog.author] += blog.likes;
    } else {
      // If the author doesn't exist, initialize their total likes
      likesByAuthor[blog.author] = blog.likes;
    }
  });

  // Find the author with the most likes
  let mostLikedAuthor = {
    author: "",
    likes: 0,
  };

  Object.entries(likesByAuthor).forEach(([author, likes]) => {
    if (likes > mostLikedAuthor.likes) {
      mostLikedAuthor.author = author;
      mostLikedAuthor.likes = likes;
    }
  });

  return mostLikedAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  // mostBlogs,
  mostLikes,
};
