import multer from 'multer'

const storage = multer.diskStorage( {
    destination : (req, file, cb) => {
          cb(null, 'uploads/')
    },
    filename : (req, file, cb) => {
        const uploadedFileName = `${Date.now()}-${file.originalname}`
        req.uploadedFileName = uploadedFileName
        cb(null, `${uploadedFileName}`)
    },
})


// file Filter

const fileFilter = (req,file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'] 
    console.log(file)
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else {
        cb(null, false)
       return cb(new Error('Only .jpeg .jpg and .png formats are allowed'), false)
    }
}

const upload = multer({storage, fileFilter})
// const upload = multer({storage})


export default upload 