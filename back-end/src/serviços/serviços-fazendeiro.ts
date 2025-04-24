import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Fazendeiro from "../entidades/fazendeiro";
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosFazendeiro {
    constructor() {}

    static async atualizarFazendeiro(request, response) {
        try {
            const { cpf, tipo_produção, tamanho_propriedade } = request.body;
            const cpf_encriptado = md5(cpf);
            await Fazendeiro.update({ usuário: { cpf: cpf_encriptado } },
                { tipo_produção, tamanho_propriedade });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarFazendeiro" }); }
    };

    static async cadastrarFazendeiro(request, response) {
        try {
            const { usuário_info, tamanho_propriedade, tipo_produção } = request.body;
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();
            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const fazendeiro = Fazendeiro.create({ usuário, tamanho_propriedade, tipo_produção });
                await transactionManager.save(fazendeiro);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) {
            return response.status(500).json({ erro: error });
        }
    }

    static async buscarFazendeiro(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const fazendeiro = await Fazendeiro.findOne({ where: { usuário: cpf_encriptado }, relations: ["usuário"] });
            if (!fazendeiro) return response.status(404).json({ erro: "Fazendeiro não encontrado." });
            return response.json({
                nome: fazendeiro.usuário.nome,
                email: fazendeiro.usuário.email,
                tipo_produção: fazendeiro.tipo_produção,
                tamanho_propriedade: fazendeiro.tamanho_propriedade
            });
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : buscarFazendeiro" });
        }
    }
}