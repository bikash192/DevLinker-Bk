const express = require('express');
const chatRouter = express.Router();
const Chat = require('../model/chat');
const { authMiddleware } = require('../middleware/authMiddleware');

chatRouter.get('/chat/:targetUserId', authMiddleware, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }, 
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName photoUrl"
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }

        res.json(chat);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

module.exports = chatRouter;
