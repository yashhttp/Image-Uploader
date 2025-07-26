import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from 'path'

const app = express();
// Configuration
cloudinary.config({
  cloud_name: "dimbe3dfj",
  api_key: "941879467887342",
  api_secret: "euvm-9viTzlIqRsMih0eaiA_RgI", // Click 'View API Keys' above to copy your API secret
});

mongoose
  .connect(
    "mongodb+srv://yashsainishamli12:TxJP1flsNeC9JNCb@cluster0.iwqzpkr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      dbName: "imageUploader",
    }
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("error is", err);
  });

app.get("/", (req, res) => {
  res.render("index.ejs", { url: null });
});

//Deskstorage
const storage = multer.diskStorage({
  // destination: './public/uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const imageSchema = new mongoose.Schema({
  filename:String,
  public_id:String,
  imgUrl:String
})
const File = mongoose.model("cloudinary", imageSchema)
app.post('/upload', upload.single('file'), async (req, res)=> {
    const file =req.file.path;

    const cloudinaryRes = await cloudinary.uploader.upload(file, {
      folder:"Images"
    })

    // save to db
    const db = await File.create({
      filename:file.originalname,
      public_id:cloudinaryRes.public_id,
      imgUrl:cloudinaryRes.secure_url
    })
    res.render("index.ejs", { url : cloudinaryRes.secure_url})
    // res.json({message :"file uploaded", cloudinaryRes})
  
})
const port = 3000;
app.listen(port, () => {
  console.log(`server is runing on port ${port}`);
});
