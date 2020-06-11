const express = require('express');
const authMiddleware = require('../../middlewares/auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();

const Post = require('../../models/Posts');
const Profile = require('../../models/Profiles');
const User = require('../../models/User');

// @route api/posts/

router.post('/', 
    [authMiddleware,
    [
        check('text','A text is required!'),
    ]
], async (req,res) => {{
    
    const errs = validationResult(req);
    if(!errs.isEmpty()) return res.send(errs);
    
    try {
        
        const user = await User.findById(req.user.id).select('-password');

        const text = req.body.text;
        const {name, avatar} = user;
        const userID = req.user.id;
        
        const newPost = {
            text, name,
            avatar, user: userID,
        }
        
        const post = await Post(newPost);
        post.save();

        return res.status(300).json(post);

    } catch( err ) {
        if(err) throw err.message;
    }
        
}});

router.get('/', async (req, res) => {

    try {

        const posts = await Post.find().sort({date: -1});
        
        if(!posts) return res.json({err: "No posts found!"});

        res.status(300).json(posts);

    } catch ( err ) {

        if(err) throw err.message;

    }

});

router.get('/:id', async ( req, res ) => {

    const post = await Post.findById(req.params.id)

    if(!post) return res.status(404).json({err: "Post not found"});

    res.status(300).json(post);

});

router.delete('/:id', authMiddleware, async ( req, res ) => {

    try {

        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if(!post) return res.status(404).json({err: "No post found!"});
        if(post.user.toString() !== user.id) res.status(400).json({err: "Operação inválida!"});

        return res.status(300).json({success: "deleted!"});

    } catch ( err ) {

        if(err) throw err.message;

    }

});

router.put('/like/:id', authMiddleware, async ( req, res ) => {

    try { 
        
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(404).json({error: "Post not found!"});

        post.likes.map(like => {if(like.user.toString() === req.user.id) 
            return res.status(400).json({err: "Post was aleredy liked by the user!"}) });


        post.likes.unshift({user: req.user.id});
        await post.save()

        return res.status(300).json({success: true});

    } catch ( err ) {

        if( err ) throw err.message;

    }

});


router.delete('/like/:id', authMiddleware, async ( req, res ) => {

    const post = await Post.findById(req.params.id);

    if(!post) return res.status(404).json({err: "The post wasn't found!"});

    const removeIndex = post.likes.map(like => like.user).indexOf(req.params.id);

    if(post.likes.length === 0) return res.status(404).json({err: "You have not commented on this post yet!"});

    post.likes.splice(removeIndex)
    post.save();

    return res.status(404).json({success: true});

});

    module.exports = router;
    