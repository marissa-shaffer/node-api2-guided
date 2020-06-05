const express = require("express")
const users = require("./users-model")

//creates a standalone express router
const router = express.Router()

 router.get("/users", (req, res) => {
	console.log(req.query)
	users.find({
		sortBy: req.query.sortBy,
		limit: req.query.limit,
	})
		.then((users) => {
			res.status(200).json(users)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the users",
			})
		})
})

router.get("/users/:id", (req, res) => {
	users.findById(req.params.id)
		.then((user) => {
			if (user) {
				res.status(200).json(user)
			} else {
				res.status(404).json({
					message: "User not found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the user",
			})
		})
})

router.post("/users", (req, res) => {
	if (!req.body.name || !req.body.email) {
		return res.status(400).json({
			message: "Missing user name or email",
		})
	}

	users.add(req.body)
		.then((user) => {
			res.status(201).json(user)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error adding the user",
			})
		})
})

router.put("/users/:id", (req, res) => {
	if (!req.body.name || !req.body.email) {
		return res.status(400).json({
			message: "Missing user name or email",
		})
	}

	users.update(req.params.id, req.body)
		.then((user) => {
			if (user) {
				res.status(200).json(user)
			} else {
				res.status(404).json({
					message: "The user could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error updating the user",
			})
		})
})

router.delete("/users/:id", (req, res) => {
	users.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The user has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The user could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error removing the user",
			})
		})
})

router.get("/users/:id/posts", (req, res) => {
	users.findById(req.params.id)
	.then((user) => {
		if(!user) {
			return res.status(404).json({
				message: "User not found",
			})
		}
		return users.findUserPosts(req.params.id)
	})
	.then((posts) => {
		res.json(posts)
	})
	.catch((error) => {
		console.log(error)
		res.status(500).json({
			message: "Error getting the user",
		})
	})
})

router.get("/users/:id/posts/:postID", (req, res) => {
	users.findUserPostById(req.params.id, req.params.postID)
	.then((post) => {
		if(post) {
			res.json(post)
		} else {
			res.status(404).json({
				message: "Post was not found",
			})
		}
	})
	.catch((error) => {
		console.log(error)
		res.status(500).json({
			message: "Error getting the user post",
		})
	})
})

module.exports = router