import { Router } from "express";

import verificarToken from "../middlewares/verificar-token";
import verificarPerfilFazendeiro from "../middlewares/verificar-perfil-fazendeiro";
import ServiçosFazendeiro from "../serviços/serviços-fazendeiro";

const RotasFazendeiro = Router();

export default RotasFazendeiro;

RotasFazendeiro.post("/", ServiçosFazendeiro.cadastrarFazendeiro);
RotasFazendeiro.get("/:cpf", verificarToken, verificarPerfilFazendeiro,
    ServiçosFazendeiro.buscarFazendeiro);