import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Transportador from '../entidades/transportador';
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosTransportador {
    constructor() {}

    static async cadastrarTransportador(request, response) {
        try {
            const { usuário_info, tipo_veículo, n_eixos_veículo, capacidade_carga_veículo } = request.body;
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();

            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const transportador = Transportador.create({ usuário, tipo_veículo, n_eixos_veículo, capacidade_carga_veículo });
                await transactionManager.save(transportador);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) {
            return response.status(500).json({ erro: error });
        }
    }

    static async atualizarTransportador(request, response) {
        try {
            const { cpf, tipo_veículo, n_eixos_veículo, capacidade_carga_veículo } = request.body;
            const cpf_encriptado = md5(cpf);

            await Transportador.update(
                { usuário: { cpf: cpf_encriptado } },
                { tipo_veículo, n_eixos_veículo, capacidade_carga_veículo }
            );

            return response.json();
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : atualizarTransportador" });
        }
    }

    static async buscarTransportador(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const transportador = await Transportador.findOne({
                where: { usuário: cpf_encriptado },
                relations: ["usuário"]
            });

            if (!transportador) {
                return response.status(404).json({ erro: "Transportador não encontrado." });
            }

            return response.json({
                nome: transportador.usuário.nome,
                email: transportador.usuário.email,
                curso: transportador.tipo_veículo,
                ano_ingresso: transportador.n_eixos_veículo,
                data_nascimento: transportador.capacidade_carga_veículo
            });
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD : buscarTransportador" });
        }
    }
}