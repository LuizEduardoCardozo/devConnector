const express = require('express');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profiles');
const User = require('../../models/User');

const authMiddleware = require('../../middlewares/auth');


const router = express.Router();


// @route api/profile/

router.get('/me', authMiddleware, async (req,res) => {{

    try {
         console.log("user id - profile route -",req.user.id);
        /* const profile = await Profile.findById(req.user.id); */
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile) return res.status(404).json({ err: "There is no profile for this user registered on the databases"});

        return res.json(profile);

    }catch (err) {

        if(err) throw err.message;
        return res.status(400).send(err);
    }

}});


router.post('/', 
    authMiddleware,
    [
        check('status','A status is required').not().isEmpty(),
        check('skills', 'Skill is required').not().isEmpty(),
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        //if(errors.isEmpty()) return res.status(400).json({errs: errors.array()});

        const {
            user,
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            experience,
            social,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram
        } = req.body;

        const profileFiels = {};

        profileFiels.user = req.user.id;

        if(user) profileFiels.user = user;
        if(company) profileFiels.company = company;
        if(website) profileFiels.website = website;
        if(location) profileFiels.location = location;
        if(status) profileFiels.status = status;
        if(skills) profileFiels.skills = skills.split(',').map( skill => skill.trim() );
        if(bio) profileFiels.bio = bio;
        if(githubusername) profileFiels.githubusername = githubusername;
        if(experience) profileFiels.experience = experience;

        if(social) profileFiels.social = {};
        if(youtube) profileFiels.social.youtube = youtube;
        if(twitter) profileFiels.social.twitter = twitter;
        if(facebook) profileFiels.social.facebook = facebook;
        if(linkedin) profileFiels.social.linkedin = linkedin;
        if(instagram) profileFiels.social.instagram = instagram;

        // console.log(profileFiels);

        try {

            let profile = await Profile.findOne({user: req.user.id});

            if(profile) {
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFiels }, { new: true });
                return res.json(profile);
            }

            profile = new Profile(profileFiels);
            await profile.save();

            return res.send(profile);

        }catch(err) {

            if(err) throw err.message;

        }

        return res.status(300).json({msg:"Ok!"});

    }
);


router.get('/', async (req,res) => {
    try {

        const profiles = await Profile.find().populate('user',['name','avatar']);
        return res.json(profiles);

    }catch(err) {

        if(err) throw err.message;

    }
});


router.get('/user/:id', async (req,res) => {

    try {

        const profile = await Profile.findById(req.params.id).populate('user',['name','avatar']);
        
        if(!profile) res.status(400).json({ err: "User not found :/" });
        
        return res.status(300).json(profile);

    }catch(err) {

        if(err.kind == "ObjectId") res.status(400).json({ err: "The user has not found :/" });
        if(err && err.kind != "ObjectId") throw err.message;

    }

});


router.delete('/:id', async (req, res) => {

    try {

        await Profile.findByIdAndRemove(req.params.id);
        await User.findByIdAndRemove(req.params.id);

    } catch (err) {

        if(err) throw err.message;

    }

});


router.post('/experience',[ authMiddleware, 
    [
    check('title','Title is needed').not().isEmpty(),
    check('company','Company is needed').not().isEmpty(),
    check('from','From date is needed').not().isEmpty(),
    ]
    ], 
    async (req, res) => { 

        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).send(errors);

        const {
            title,company,location,
            from,to,current,description,
        } = req.body;
        
        const newExp = {
            title,company,location,
            from,to,current,description,
        }
        
        try {

            const profile = await Profile.findOne({ user: req.user.id });
            if(!profile) return res.status(400).json({err: "Profile not found!"});

            profile.experience.unshift(newExp);

            profile.save(); 

            return res.status(300).json(profile);


        } catch (err) {

            if(err) throw err.message;

        }

    });

router.delete("/experience/:id", authMiddleware, async ( req, res ) => {

    try {

        let profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.id);
        console.log(profile.experience[removeIndex]);   
        profile.experience.splice(removeIndex,1)
        profile.save();
        return res.status(300).json(profile.experience);

    } catch ( err ) {

        if( err ) throw err.message;

    }

});


router.post('/education',

    [authMiddleware, [
        check('school','school is required!').not().isEmpty(),
        check('degree','degree is required!').not().isEmpty(),
        check('fieldofstudy','fieldofstudy is required!').not().isEmpty(),
        check('from','from is required!').not().isEmpty(),

    ]], 
    async ( req, res) => { 

        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(401).send(errors);

        const {
            school,degree,fieldofstudy,
            from,to,
        } = req.body;

        const newEducation = {
            school, degree, fieldofstudy,
            from, to,
        };

        console.log(newEducation);

        try {

            const profile = await Profile.findOne({user: req.user.id});

            profile.education.unshift(newEducation);
            profile.save()

            res.status(300).json(profile.education);

        } catch ( err ) {
            if( err ) throw err.message;
        }

});


router.delete('/education/:id', authMiddleware, async ( req , res ) => {

    console.log(req.user.id);
    //  5ee0139e2e2c0c408f0680d0
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.education.map(education => education.id).indexOf(req.params.id);
    profile.education.splice(removeIndex,1);
    profile.save()
    return res.status(300).json(profile.education);
    

});

module.exports = router;
