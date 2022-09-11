import { AppDataSource } from "./src/data-source";
import { Blogs } from "./src/entity/Blogs";
import express from "express";
import bodyParser from 'body-parser';
import multer from 'multer';
const upload = multer();

const PORT = 3000;

AppDataSource.initialize().then(async connection => {
    const app = express();
    app.use(bodyParser.json());
    const BlogsRepo = connection.getRepository(Blogs);
    app.set("view engine", "ejs");
    app.set("views", "./src/views");

    app.get('/blogs/create', (req, res) => {
        res.render('create');
    })

    app.post("/blogs/create", upload.none(), async (req, res) => {
        try {
            const blogData = {
                title: req.body.title,
                content: req.body.content
            };
            const blog = await BlogsRepo.save(blogData);
            if (blog) {
                res.redirect('list');
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    });

    app.get('/blogs/update', async(req, res) => {
        let blog = await BlogsRepo.findOneBy({ id: +req.query.id });
        res.render('update', {blog: blog});
    })

    app.post("/blogs/update",upload.none(), async (req, res) => {
        let blogId = +req.query.id;
        try {
            let blogSearch = await BlogsRepo.findOneBy({ id: blogId });
            if (!blogSearch) {
                res.status(500).json({
                    message: "Blog không tồn tại"
                })
            }
            const newBlogData = {
                title: req.body.title,
                content: req.body.content
            };
            const blog = await BlogsRepo.update({ id: blogId }, newBlogData);
            res.redirect('list');
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    });

    app.get("/blogs/delete", async (req, res) => {
        try {
            let blogId = +req.query.id;
            let blogSearch = await BlogsRepo.findOneBy({ id: blogId });
            if (!blogSearch) {
                res.status(500).json({
                    message: "Blog không tồn tại"
                })
            }
            const blog = await BlogsRepo.delete({ id: blogId });
            res.redirect('list');
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    });

    app.get("/blogs/list", async (req, res) => {
        try {
            const blogs = await BlogsRepo.find();
            if (blogs) {
                res.render('list', {blogs: blogs});
            }
        } catch (err) {
            res.status(500).json({ message: err.mesage })
        }
    });

    app.listen(PORT, () => {
        console.log("App running with port: " + PORT)
    })
});