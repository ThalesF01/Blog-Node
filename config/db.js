if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://Thales:Thales15935746@cluster0.k9yay.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}