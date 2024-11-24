import express from "express"; // Importa o módulo Express para criar e gerenciar o servidor web.
import multer from "multer"; // Importa o módulo Multer para lidar com o upload de arquivos.
import {
  listarPosts,
  postarNovoPost,
  uploadImagem,
  atualizarNovoPost
} from "../controllers/postControlles.js"; // Importa as funções de controle (listarPosts, postarNovoPost, uploadImagem) do arquivo 'postControlles.js'.

import cors from "cors"
const corsOptions = {
  origin:"http://localhost:8000",
  optionsSuccessStatus: 200
}
const storage = multer.diskStorage({
  // Configura o armazenamento do Multer, definindo como e onde os arquivos serão salvos.
  destination: function (req, file, cb) {
    // Define a função que determina o diretório de destino para salvar os arquivos.
    cb(null, "uploads/"); // Define o diretório 'uploads/' como destino, onde os arquivos serão armazenados. O 'cb' é uma função de callback do Multer.
  },
  filename: function (req, file, cb) {
    // Define a função que determina o nome do arquivo a ser salvo.
    cb(null, file.originalname); // Define que o nome original do arquivo será usado ao salvar.
  },
});

const upload = multer({ dest: "./uploads", storage }); // Cria uma instância do Multer, configurando o diretório de destino padrão como './uploads' e usando a configuração 'storage' definida anteriormente.

const routes = (app) => {
  // Define uma função que recebe a instância do Express ('app') como parâmetro e configura as rotas.
  app.use(express.json()); // Configura o middleware 'express.json()' para que o servidor possa interpretar requisições com corpo no formato JSON.
  app.use(cors(corsOptions))
  app.get("/posts", listarPosts); // Define a rota GET '/posts', que, quando acessada, executará a função 'listarPosts' para buscar e retornar os posts.
  app.post("/posts", postarNovoPost); // Define a rota POST '/posts', que, quando acessada, executará a função 'postarNovoPost' para criar um novo post.
  app.post("/upload", upload.single("imagem"), uploadImagem); // Define a rota POST '/upload' para lidar com o upload de uma única imagem. O 'upload.single("imagem")' indica que apenas um arquivo com o nome de campo 'imagem' será aceito. Após o upload, a função 'uploadImagem' será executada.
  app.put("/upload/:id", atualizarNovoPost);
};

export default routes; // Exporta a função 'routes', que contém a configuração das rotas, para que possa ser utilizada em outros módulos da aplicação.
