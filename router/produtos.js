const express = require('express');
const { send } = require('express/lib/response');
const res = require('express/lib/response');
const router = express.Router()
const mysql = require('../mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString + file.originalname);
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
    storage: storage
    /*limits: {
        fileSize: 1024 * 1024 * 5 // 1024 x 1024 ------> 1M
    },
    fileFilter: fileFilter*/
})

router.get('/', (req, res, next) => {
    mysql.getConnection((error,conn) => {
        if(error){return res.status(500).send({error:error})}
        conn.query(
            "SELECT * FROM produtos",
            (error, results) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    quantidade : results.length, 
                    produto: results.map((prod) => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            foto: prod.imagem_produto,
                            request: {
                                tipo: "GET",
                                descricao: 'Retorna todos os produtos',
                                URL: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                res.status(200).send(response);
            }
        );
    });
}); 

router.post('/', upload.single('produto_imagem'),(req, res, next) => {
    mysql.getConnection((error,conn) => {
        console.log(req.file);
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            "INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)", 
            [
                req.body.nome, 
                req.body.preco, 
                req.file.path
            ],
            (error, results) => {
                conn.release();
                if(error) {return res.status(500).send({error:error, response: null})}
                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: results.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        foto: req.file.path,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url:'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
});

router.get('/:id_produto',(req, res, next) => {
    mysql.getConnection( (error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(   
            "SELECT * FROM produtos WHERE id_produto = ?;",
            [req.params.id_produto],
            (error, results, fields)=> {
                if(error) {return res.status(500).send({error: error})}

                if (results.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    });
                }
                const response = {
                    produto: {
                        id_produto: results[0].id_produto,
                        nome: results[0].nome,
                        preco: results[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto',
                            url:'http://localhost:3000/produtos'
                        }
                    }
                }
            return res.status(200).send(response);
        })
    });
})

router.patch('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `UPDATE produtos 
                SET nome   = ?,
                    preco  = ?
            WHERE id_produto = ?`,
            [
                req.body.nome, 
                req.body.preco, 
                req.body.id_produto
            ], 
            (error, results, fields) => {
                conn.release();
                if(error){return res.status(500).send({error:error})}
                const response = {
                    mensagem: "Produto atualizado com sucesos",
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os detalhes de um produto específico',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produto
                        }
                    }
                }
                res.status(202).send(response);
            }
        );
    })
})

router.delete('/',(req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM produtos WHERE nome = ?`,
            [req.body.nome], 
            (error, result, fields) => {
                conn.release();
                if(error){return res.status(404).send({error:error})}

                const response = {
                    mensagem: "Produto removido com sucesso",
                    request: {
                        tipo: "POST",
                        descricao: "Insere um produto",
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                res.status(202).send(response);
            }
        ); 
    });
});

module.exports = router