const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const request = require('request');
const config = require('config');

const {check, validationResult}  = require('express-validator');

const router = express.Router();

const User = require('../../models/User');

// @route api/users/
// Create a new user
router.post('/', 

    [
        check('name','Name is required').not().isEmpty(),
        check('email','Please, include the email').not().isEmpty(),
        check('password','Please, include the password with 6 or more characters!').isLength({min:6}),
    ],
    async (req,res) => {{

        const errors = validationResult(req);

        if( !errors.isEmpty() ) return res.status(401).json( { err: errors.array() } );

        const { name, email, password } = req.body;

        try {

            if( await User.findOne({ email }) ) return res.status(400).json({ err: "The user already registred" });

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'p',
                d: 'mm'
            });

            const user = new User({name, email, avatar, password});
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            }

            await jwt.sign(payload, config.get('secret'), {expiresIn: 36000 }, (err, token) => {
                if(err) return res.status(400).sendStatus(err);
                return res.status(300).json({success: "User registred!", token});
            });

    }catch(err) {
        console.log(err);
    }

}})

router.get('/github/:username', ( req, res ) => {
    try {

        const options = {
            uri: `https://api.github.com/users/LuizEduardoCardozo/repos?per_page=5&sort=created: dec`,
            method: 'GET',
            headers: {'user-agent':'node-js'}
        }

        request(options,( err, githubRes, body ) => {

            if(err) console.log(err);

            if( githubRes.statusCode != 200 ){
                return req.stauts(404).json({err: "Github profile wasnt found!"});
            }
            
        });
        
        return res.json(JSON.parse(body));

    } catch (err) {

        if(err) throw err.message;

    }
})

module.exports = router;
