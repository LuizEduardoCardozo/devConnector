const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

const authMiddleware = require('../../middlewares/auth');

const router = express.Router();


const User = require('../../models/User');

// @route api/auth/

router.get('/', authMiddleware , async (req,res) => {{
    try{
        const user = await User.findById(req.user.id);
        if(!user) return res.status(400).json({err: "User not found!"});
        user.password = undefined;
        res.send(user);

    } catch (err) {
        return res.status(500).json({ err: "Server error" });
    }

}})

//Login route
router.post('/', 
    [
        check('email','email is a required field').not().isEmpty(),
        check('password','password is a required field').not().isEmpty(),
    ],
    async (req, res) => {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if( !user ) return res.status(401).json({err: "Invalid email or password"});

        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            res.status(401).json({err: "Invalid email or password"})
        }
    
        const payload = {
            user: {
                id: user.id
            }
        }
        
        jwt.sign(payload, config.get('secret'), {expiresIn: 36000},  (err,token) => {
            if(err) return res.status(400).send(err);
            return res.json({token});
        });

    }
);

module.exports = router;
