const express = require('express');
const { send } = require('express/lib/response');
const res = require('express/lib/response');
const router = express.Router()
const multer = require('multer');
const login = require('../middleware/login');
const produtosControllers = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
      cb(null,  file.originalname + '-' + Date.now() + '.jpeg' );
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
} 

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 1024 x 1024 ------> 1M
    },
    fileFilter: fileFilter
});

router.get('/', produtosControllers.getProduto); 

router.post('/', 
            login, 
            upload.single('produto_imagem'),
            produtosControllers.postProduto
);

router.get('/:id_produto', produtosControllers.getUmProduto);

router.patch('/', produtosControllers.patchProduto);

router.delete('/', produtosControllers.deleteProduto);

module.exports = router