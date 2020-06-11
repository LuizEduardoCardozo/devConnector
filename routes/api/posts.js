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


router.put('/comment/:id', [authMiddleware, [

    check('comment', 'You need to add a comment to perform this action!').not().isEmpty()

]], async ( req, res ) => {

    const errs = validationResult(req);
    if(!errs.isEmpty()) return res.send(errs);

    try {

        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.id).select('-password');
    
        if(!post) return res.status(404).json({err: "Post not found!"});
        if(!user) return res.status(405).json({err: 'User not found'});

        if(post.comments.filter(comment => comment.user.toString() === req.user.id).length !== 0)
            return res.status(400).json({error: 'A user can only add a single comment by post, buddy :/'});
        
        const newComment = {
            user: req.user.id,
            text: req.body.comment,
            name: user.name,
            avatar: user.avatar
        }
    
        post.comments.unshift(newComment);
        await post.save()
    
        return res.status(300).json({success: "Ok!"});

    } catch ( err ) {

        if ( err ) throw err.message;

    }


    // post.comments.unshift();

});


router.delete('/comment/:id', authMiddleware, async ( req, res ) => {

    try { 
        
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if(!post) return res.status(404).json({err: 'Post not found!'});
        if(!user) return res.status(405).json({err: 'User not found'});

        if(post.comments.length === 0)
            return res.status(501).json({err: "This post have no comments yet"});

        const removeIndex = post.comments.map(c => c.user).indexOf(req.user.id);

        if(post.comments[removeIndex].user.toString() !== req.user.id) 
            return res.status(501).json({err: "You only can remove yours own posts"});

        post.comments.splice(removeIndex, 1);
        post.save();

        return res.status(300).json({success: "Ok!"});

    } catch ( err ) {
        
        if( err ) throw err.message;

    }

});

    module.exports = router;
    