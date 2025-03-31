import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import md5 from "md5";
import { sign } from "jsonwebtoken";
import Usuário, { Perfil } from "../entidades/usuário";
import Fazendeiro from "../entidades/fazendeiro";
import Transportador from "../entidades/transportador";

dotenv.config();
const SALT = 10;
const SENHA_JWT = process.env.SENHA_JWT;

export default class ServiçosUsuário {
    constructor() {}

    static async verificarCpfExistente(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const usuário = await Usuário.findOne(cpf_encriptado);
            if (usuário) return response.status(404).json({ erro: "CPF já cadastrado." });
            else return response.json();
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD: verificarCpfCadastrado" });
        }
    }

    static async verificarCadastroCompleto(usuário: Usuário) {
        switch (usuário.perfil) {
            case Perfil.FAZENDEIRO:
                const fazendeiro = await Fazendeiro.findOne({ where: { usuário: usuário.cpf }, relations: ["usuário"] });
                if (!fazendeiro) return false;
                return true;
            case Perfil.TRANSPORTADOR:
                const transportador = await Transportador.findOne({ where: { usuário: usuário.cpf }, relations: ["usuário"] });
                if (!transportador) return false;
                return true;
            default:
                return;
        }
    }

    static async logarUsuário(request, response) {
        try {
            const { nome_login, senha } = request.body;
            const cpf_encriptado = md5(nome_login);
            const usuário = await Usuário.findOne(cpf_encriptado);
            if (!usuário) return response.status(404).json({ erro: "Nome de usuário não cadastrado." });
            const cadastro_completo = await ServiçosUsuário.verificarCadastroCompleto(usuário);
            if (!cadastro_completo) {
                await Usuário.remove(usuário);
                return response.status(400).json({ erro: "Cadastro incompleto. Por favor, realize o cadastro novamente." });
            }
            const senha_correta = await bcrypt.compare(senha, usuário.senha);
            if (!senha_correta) return response.status(401).json({ erro: "Senha incorreta." });
            const token = sign({ perfil: usuário.perfil, email: usuário.email }, SENHA_JWT, { subject: usuário.nome, expiresIn: "1d" });
            return response.json({
                usuárioLogado: {
                    nome: usuário.nome,
                    perfil: usuário.perfil,
                    email: usuário.email,
                    questão: usuário.questão,
                    status: usuário.status,
                    cor_tema: usuário.cor_tema,
                    token
                }
            });
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD: logarUsuário" });
        }
    }

    static async cadastrarUsuário(usuário_informado) {
        try {
            const { cpf, nome, perfil, email, senha, questão, resposta, cor_tema } = usuário_informado;
            const cpf_encriptado = md5(cpf);
            const senha_encriptada = await bcrypt.hash(senha, SALT);
            const resposta_encriptada = await bcrypt.hash(resposta, SALT);
            const usuário = Usuário.create({
                cpf: cpf_encriptado,
                nome,
                perfil,
                email,
                senha: senha_encriptada,
                questão,
                resposta: resposta_encriptada,
                cor_tema
            });
            const token = sign({ perfil: usuário.perfil, email: usuário.email }, SENHA_JWT, { subject: usuário.nome, expiresIn: "1d" });
            return { usuário, senha, token };
        } catch (error) {
            throw new Error("Erro BD: cadastrarUsuário");
        }
    }
}