const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const authMiddleware = require('../middlwares/auth');

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = req.body;

    // Create a new post
    const newPost = await Post.create({ ...post, creator: req.userId,name:req.username });

    // Populate the creator field with user details
    // await newPost.populate('creator')

    return res.status(201).json({
      message: 'Post created successfully',
      post: newPost // Return the new post with populated creator field
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Get all posts
router.get('/', async (req, res) => {
  try {
    const {page}=req.query
    const posts = await Post.find();
    const total=await Post.countDocuments()
    return res.status(200).json({data:posts,currentPage:page});
  } catch (error) {
    console.error('Error getting posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific post by ID
router.get('/creator', async (req, res) => {
  try {
    const nameQuery = new RegExp(req.query.name, 'i');
    console.log(nameQuery);
    const post = await Post.find({ name: nameQuery });
    res.json(post);
  } catch (error) {
    console.error('Error getting posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const {searchQuery,tags} = req.query
    const title= new RegExp(searchQuery,"i")
    const posts = await Post.find({$or:[{title},{tags:{$in:tags.split(",")}}]})
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error getting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error('Error getting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

 



router.patch('/update/:id', authMiddleware, async (req, res) => {
  try {
    const post=await Post.findById(req.params.id)
    if(post.creator!==req.userId)
    res.send("You are not allowed to update this post")
        const updatePost=await Post.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.json(updatePost);
  } catch (error) {
    console.error('Error getting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const deletePost=await Post.findByIdAndDelete(req.params.id)
    res.json(deletePost);
  } catch (error) {
    console.error('Error getting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/like/:id', authMiddleware, async (req, res) => {
  try {
    const id=req.params.id
    const post=await Post.findById(req.params.id)
    const index= post.likes.findIndex((id)=>id===String(req.userId))
    if(index===-1){
      post.likes.push(req.userId)
    }
    else{
      post.likes=post.likes.filter((id)=>id!==String(req.userId))
    
    }
    console.log(post.likes)
    const updatedPost=await Post.findByIdAndUpdate(id,post,{new:true})
    res.send(updatedPost)
  } catch (error) {
    console.error('Error getting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/comment/:id', authMiddleware, async (req, res) => {
  try {
    const id=req.params.id
    
 const {value}=req.body
 console.log(value)
    const post=await Post.findById(req.params.id)
    post.comments.push(value)
    const updatedPost=await Post.findByIdAndUpdate(id,post,{new:true})
    res.json(updatedPost)
  } catch (error) {
    console.error('Error getting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
