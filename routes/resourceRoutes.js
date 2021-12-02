const { decodeBase64 } = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.get('/:filename', function(req, res){
    const img_url = decodeBase64()
})