const mongoose = require('mongoose')
const Schema = mongoose.Schema
function dataAtualFormatada(){
    let data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required:true
    },
    data:{
        type: String,
        required: true,
        default: dataAtualFormatada()
    }
})

mongoose.model("postagens",Postagem)