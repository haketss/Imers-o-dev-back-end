// import { ObjectId } from "mongodb";
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js"; // Importa a função 'conectarAoBanco' do arquivo 'dbConfig.js', responsável por conectar ao banco de dados.
import dotenv from "dotenv"; // Importa o módulo 'dotenv' para carregar variáveis de ambiente de um arquivo '.env'.
dotenv.config(); // Carrega as variáveis de ambiente do arquivo '.env'.
const conexao = await conectarAoBanco(process.env.EXTING_CONEXAO); // Conecta ao banco de dados usando a string de conexão presente na variável de ambiente 'EXTING_CONEXAO' e armazena a conexão na variável 'conexao'.

export async function getTodosPosts() {
  // Define uma função assíncrona chamada 'getTodosPosts' para buscar todos os posts do banco de dados.
  const db = conexao.db("imersao-dev-alura"); // Obtém a referência ao banco de dados "imersao-dev-alura" a partir da conexão estabelecida.
  const colecao = db.collection("posts"); // Obtém a referência à coleção "posts" dentro do banco de dados.
  return colecao.find().toArray(); // Busca todos os documentos na coleção "posts", converte o resultado em um array e o retorna.
}

export async function criarPost(novoPost) {
  // Define uma função assíncrona chamada 'criarPost' para adicionar um novo post ao banco de dados.
  const db = conexao.db("imersao-dev-alura"); // Obtém a referência ao banco de dados "imersao-dev-alura".
  const colecao = db.collection("posts"); // Obtém a referência à coleção "posts".
  return colecao.insertOne(novoPost); // Insere um novo documento na coleção "posts" com os dados fornecidos em 'novoPost' e retorna o resultado da operação.
}

export async function atualizarpost(id, novoPost) {
  const db = conexao.db("imersao-dev-alura");
  const colecao = db.collection("posts");
  const objID = ObjectId.createFromHexString(id)
  return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}
