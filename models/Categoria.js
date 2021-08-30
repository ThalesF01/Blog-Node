const mongoose = require('mongoose')
const Schema = mongoose.Schema
function dataAtualFormatada(){
    let data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

const Categoria = new Schema({
    nome:{
        type: String,
        require: true
    },
    slug:{
        type: String,
        require: true
    },
    date:{
        type: String,
        required: true,
        default: dataAtualFormatada()
    }
})

mongoose.model("categorias",Categoria)