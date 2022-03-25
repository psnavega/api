const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const routerPedidos = require("./router/pedidos");
const routerProdutos = require("./router/produtos");
const routerUsuarios = require("./router/usuarios");

app.use(morgan('dev'));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json()); //json entrada no body

/* ******************************* CASO ESTEJA USANDO UM SERVIDOR EXTERNO *****************************
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Acess-Control-Allow-Header',
        'Origin, X-Resqurested-With, Content-Type, Accept,Authorization'
    );

    if(req.method == 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).send({});
    }

    next();
});
*/

app.use('/produtos', routerProdutos);
app.use('/pedidos', routerPedidos);
app.use('/usuarios', routerUsuarios);

//tratamento de erro 
app.use((req,res,next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((req,res,next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;