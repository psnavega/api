const mysql =  require('../mysql').pool;

exports.getProduto = (req, res, next) => {
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
}

exports.getUmProduto = (req, res, next) => {
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
}

exports.postProduto = (req, res, next) => {
    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send({ error:error })}
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
                            url:'http://localhost:3001/produtos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
}

exports.patchProduto = (req, res, next) => {
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
}

exports.deleteProduto = (req ,res, next) =>{
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
}