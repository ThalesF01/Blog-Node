// Carregando módulos
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require('./routes/usuario')
    require("./models/Categoria")
    const Usuario = mongoose.model("usuarios")
    const passport = require("passport")
    require("./config/auth")(passport)  
    const db = require("./config/db")  

// Configurações

    // Sessão

        app.use(session({
            secret: "cursonode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())        

    //Middleware

        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })

    // Body Parser
        
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    // HandleBars

        app.engine('handlebars',handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');

    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect(db.mongoURI).then(()=>{
            console.log("Conectado ao mongo")
        }).catch((err)=>{
            console.log("Falha ao se conectar: "+err)
        })


    // Public

        app.use(express.static(path.join(__dirname,"public")))

        app.use((req,res,next)=>{
            console.log("Middleware")
            next()
        })


// Rotas

    app.use('/admin',admin)
    app.use('/usuarios',usuarios)

// Rota da pagina principal

    app.get('/', (req, res)=>{        
        Postagem.find().lean().populate("categoria").sort({data:"desc"}).limit(3).then((postagens)=>{                            
            res.render("index", {postagens: postagens})                                                          
        }).catch((err)=>{
          req.flash("error_msg", "houve um erro ao lista na pag. inicial")
          res.redirect("/404")
        })        
      })

// Rota de pagina não encontrada

    app.get("/404",(req,res)=>{
        res.send("Erro 404")
    })

//Rota LER MAIS pagina inicial

    app.get('/postagem/:slug', (req,res) => {
        const slug = req.params.slug
        Postagem.findOne({slug}).lean().then(postagem => {
                if(postagem){
                    const post = {
                        titulo: postagem.titulo,
                        data: postagem.data,
                        conteudo: postagem.conteudo
                    }
                    res.render('postagem/index', post)
                }else{
                    req.flash("error_msg", "Essa postagem nao existe")
                    res.redirect("/")
                }
            })
            .catch(err => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("/")
            })
    })

// Rota de listar as categorias

    app.get("/categorias", (req,res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("categorias/index",{categorias:categorias})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao listar as categorias")
            res.redirect("/")
        })
    })

// Rota listagem de categorias 

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).then( (categoria) => {

            if (categoria) {
                Postagem.find({categoria: categoria._id}).then((postagens)=>
                    {res.render('categorias/postagens', {postagens: postagens.map(Categoria=> Categoria.toJSON()),categoria:categoria})
                        }).catch( (erro) => {req.flash('error_msg', 'Houve um erro ao listar os posts')})
            } else {
                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/')
            }

        }).catch( (erro) => {
            req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria')
            res.redirect('/')
        })
    })

// Rota de listagem de postagens

    app.get("/lista",(req,res)=>{
        Postagem.find().lean().then((postagens)=>{
            res.render("lista/index",{postagens:postagens})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao listar as postagens")
            res.redirect("/")
        })
    })


// Outros
    const PORT = process.env.PORT || 8000
    app.listen(PORT,()=>{
        console.log("Servidor rodando, porta: "+PORT)
    })