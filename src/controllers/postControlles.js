import { getTodosPosts, criarPost, atualizarpost } from "../models/postModels.js"; // Importa as funções 'getTodosPosts' e 'criarPost' do arquivo 'postModels.js', que são responsáveis por interagir com o banco de dados.
import fs from "fs"; // Importa o módulo 'fs' (filesystem) para manipular arquivos no sistema de arquivos.
import gerarDescricaoComGemini from "../services/geminiservices.js";

export async function listarPosts(req, res) {
  // Define uma função assíncrona chamada 'listarPosts' para lidar com requisições GET para listar posts.
  const posts = await getTodosPosts(); // Chama a função 'getTodosPosts' para buscar todos os posts no banco de dados e armazena o resultado na variável 'posts'.
  res.status(200).json(posts); // Envia uma resposta com status 200 (OK) e os posts encontrados no formato JSON.
}

export async function postarNovoPost(req, res) {
  // Define uma função assíncrona chamada 'postarNovoPost' para lidar com requisições POST para criar um novo post.
  const novoPost = req.body; // Obtém os dados do novo post do corpo da requisição (req.body).
  try {
    const postCiado = await criarPost(novoPost); // Chama a função 'criarPost' para adicionar o novo post ao banco de dados e armazena o resultado na variável 'postCiado'.
    res.status(200).json(postCiado); // Envia uma resposta com status 200 (OK) e os dados do post criado.
  } catch (erro) {
    // Captura qualquer erro que possa ocorrer durante a criação do post.
    console.error(erro.message); // Imprime a mensagem de erro no console.
    res.status(500).json({ erro: "Falha na requisição" }); // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro em formato JSON.
  }
}

export async function uploadImagem(req, res) {
  // Define uma função assíncrona chamada 'uploadImagem' para lidar com o upload de imagens.
  const novoPost = {
    // Cria um objeto 'novoPost' com os dados iniciais do post, incluindo a descrição vazia, o nome original do arquivo como URL da imagem e o texto alternativo vazio.
    descricao: "",
    imagemurl: req.file.originalname,
    alt: "",
  };
  try {
    const postCiado = await criarPost(novoPost); // Chama a função 'criarPost' para adicionar o novo post (com a imagem) ao banco de dados e armazena o resultado em 'postCiado'.
    const imagemAtualizada = `uploads/${postCiado.insertedId}.png`; // Define o novo nome do arquivo de imagem, usando o ID do post criado e a extensão .png.
    fs.renameSync(req.file.path, imagemAtualizada); // Renomeia o arquivo da imagem no sistema de arquivos, movendo-o da pasta temporária para a pasta 'uploads' com o novo nome.
    res.status(200).json(postCiado); // Envia uma resposta com status 200 (OK) e os dados do post criado.
  } catch (erro) {
    // Captura qualquer erro que possa ocorrer durante o processo.
    console.error(erro.message); // Imprime a mensagem de erro no console.
    res.status(500).json({ erro: "Falha na requisição" }); // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro em formato JSON.
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`
  
  try {
    
    const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
    const descricao = await gerarDescricaoComGemini(imageBuffer)
    
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postCiado = await atualizarpost(id, post);
    res.status(200).json(postCiado); // Envia uma resposta com status 200 (OK) e os dados do post criado.
  } catch (erro) {
    // Captura qualquer erro que possa ocorrer durante a criação do post.
    console.error(erro.message); // Imprime a mensagem de erro no console.
    res.status(500).json({ erro: "Falha na requisição" }); // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro em formato JSON.
  }
}
