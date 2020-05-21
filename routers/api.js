const express = require("express");

const pw = require("../passwords.js");

module.exports = function(seq) {
    const router = new express.Router();
    router.post("/login", async function(request, response) {
        let user = await seq.models.User.findOne({
            where: {
                email: request.body.email
            }
        });
        if (user === null) {
            return response.status(404).json({
                success: false,
                error: "INVALID_USER",
                message: "The specified user does not exist."
            })
        }
        if (!(await pw.compare(request.body.password, user.password))) {
            return response.status(403).json({
                success: false,
                error: "INVALID_PASSWORD",
                message: "The specified password is incorrect."
            })
        }
        response.status(200).json({
            success: true,
            token: user.token
        })
    })
    return router;
};