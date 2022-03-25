const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');

router.post('/cadastro', (req,res) =>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
            if(error) {return res.status(500).send({error: error}) }
            if( results.length > 0 ) {
                res.status(409).send({mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(error) {return res.status(500).send({error: errBcrypt})}
                    conn.query(
                    `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
                    [req.body.email, hash],
                    (error, results, fields) => {
                        conn.release();
                        if(error) { return res.status(500).send({error:error}) }
                        const response = {
                            mensagem: "Usuário inserido com sucesso",
                            usuarioCriado : {
                                id_usuario: results.insertId,
                                mail: req.body.email
                            }
                        }
                        return res.status(201).send(response)
                    });
                });
            }
        });
    });
});


            
  
module.exports = router;