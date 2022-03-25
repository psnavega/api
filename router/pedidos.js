const { response } = require('express');
const express = require('express');
const { restart } = require('nodemon');
const router = express.Router()
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error,conn)=> {
        if(error){return res.status(500).send({error: error})}
        conn.query(
            `SELECT pedidos.id_pedido,
	                pedidos.quantidade,
	                produtos.id_produto,
	                produtos.nome,
	                produtos.preco
            FROM    pedidos
        INNER JOIN  produtos
                ON 	produtos.id_produto = pedidos.id_produto;`,
            (error, results, fields) => {
                conn.release()
                if(error){return res.status(500).send({error:error})}
                const response = {
                    produtos: results.map((pedido) => {
                        return {
                            id_pedido: pedido.id_pedido,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            nome: pedido.nome,
                            preco: pedido.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os detalhes de um pedido específico',
                                url: 'http://localhost:3000/pedidos/'+pedido.id_pedido
                            }
                        } 
                    })
                }
                res.status(200).send(response);
            }
        );
    });
});

router.post('/',(req, res) => {
    mysql.getConnection( (error, conn) => {
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            "INSERT INTO pedidos (id_produto, quantidade) VALUES(?,?)",
            [
                req.body.id_produto, 
                req.body.quantidade
            ],
            (error, results,fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}   
                const response = {
                    mensagem: "Pedido inserido com sucesso",
                    pedidoCriado: {
                        id_pedido: results.id_produto,
                        nome: results.quantidade,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um pedido',
                            url:'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
});

router.get('/:id_pedido',(req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
           `SELECT * FROM pedidos WHERE id_pedido = ?`,
           [req.params.id_pedido],
           (error, results) => {
                if(error) {return res.status(500).send({error:error})}
                
                if (results.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    });
                }
                const response = {
                    pedido: {
                        id_pedido: results[0].id_pedido,
                        preco: results[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um pedido',
                            url:'http://localhost:3000/pedidos'
                        }
                    }
                }
            return res.status(200).send(response);
        })
    });
})
 
router.patch('/',(req,res, next) => {
    mysql.getConnection((error, conne) => {
        if(error){return res.status(500).send({error: error})}
        conne.query(
            `UPDATE pedidos 
                SET quantidade = ? 
                WHERE id_pedido = ?`,
            [
                req.body.quantidade, 
                req.body.id_pedido
            ],
            (error, results, fields) => { 
                conne.release();
                if(error) {return res.status(500).send({error:error}) }
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
        if (error) { return res.status(500).send({error:error})}
        conn.query(            
            "DELETE FROM pedidos WHERE id_pedido = ?",
            [req.body.id_pedido],
            (error, results, fields) => {
                conn.release();
                if(error) { return res.status(500).send({error: error})}
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