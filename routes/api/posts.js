const express = require('express');

const router = express.Router();

// @route api/posts/

router.get('/', (req,res) => {{
    return res.json({msg: "ok!"});
}})

module.exports = router;
