const Blog = require('../config/blogscema'); // Import the Blog model from the specified path

// Render the Add Blog page
exports.renderAddBlog = (req, res) => {
  // Render the 'add' view (form to add a new blog) and pass the user info to it
  res.render('add', { user: req.user });
};

// Render the Edit Blog page
exports.renderEditBlog = (req, res) => {
  // Find the specific blog by ID and ensure it belongs to the logged-in user
  Blog.findOne({ _id: req.params.id, user: req.user.id })
    .then(blog => {
      // If no blog is found, redirect to the user's blogs
      if (!blog) {
        return res.redirect('/myblog');
      }
      // Render the 'edit' view with the blog data
      res.render('edit', { blog, user: req.user });
    })
    .catch(err => console.log(err)); // Log any errors
};

// Render all blogs
exports.renderAllBlogs = (req, res) => {
  // Fetch all blogs from the database
  Blog.find()
    .then(blogs => {
      // Render the 'allblog' view with the fetched blogs and user info
      res.render('allblog', { blogs, user: req.user });
    })
    .catch(err => console.log(err)); // Log any errors
};

// Render user's blogs
exports.renderMyBlogs = (req, res) => {
  console.log('User:', req.user); // Log the user object for debugging
  if (!req.user) {
      return res.redirect('/login'); // Redirect to login if not authenticated
  }

  Blog.find({ user: req.user.id })
      .then(blogs => {
          res.render('myblog', { blogs,user: req.user  }); // Pass user info to the view
      })
      .catch(err => console.log(err)); // Log any errors
};

// Add a new blog (handles POST request)
exports.addBlog = (req, res) => {
  const { title, content } = req.body; // Get title and content from the request body
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Handle file upload if exists

  console.log("user",req.user.name);
  
  // Create a new blog instance with the provided data
  const newBlog = new Blog({
    title,
    content,
    image,
    user: req.user.id,
    author: req.user.name // Include the user's name
});

  // Save the new blog to the database
  newBlog.save()
    .then(() => res.redirect('/myblog')) // Redirect to 'myblogs' after saving
    .catch(err => console.log(err)); // Log any errors
};

// Edit an existing blog (handles POST request)
exports.editBlog = (req, res) => {
  console.log("edit");
  const { title, content } = req.body; // Get title and content from the request body
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Handle file upload if exists

  const updateData = { title, content }; // Prepare the data to update
  if (image) {
    updateData.image = image; // Only add the image to updateData if a new one is uploaded
  }

  // Find the blog and update it with new data
  Blog.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id }, // Find the blog by ID and ensure it belongs to the user
    updateData, // Data to update
    { new: true } // Return the updated blog
  )
  .then(() => res.redirect('/myblog')) // Redirect after updating
  .catch(err => {
    console.error('Error updating blog:', err); // Log error
    res.status(500).send('Internal Server Error'); // Send error response
  });
};

// Delete a blog
exports.deleteBlog = (req, res) => {
  console.log("Attempting to delete blog with ID:", req.params.id);
  
  // Find and delete the blog by ID, ensuring it belongs to the user
  Blog.findOneAndDelete({ _id: req.params.id, user: req.user.id })
      .then(blog => {
          if (!blog) {
              console.log("Blog not found or doesn't belong to the user.");
              return res.status(404).send('Blog not found or you do not have permission to delete this blog.'); 
          }
          console.log("Blog deleted successfully.");
          res.redirect('/myblog'); // Redirect after deletion
      })
      .catch(err => {
          console.error('Error deleting blog:', err); // Log error
          res.status(500).send('Internal Server Error'); // Send error response
      });
};

