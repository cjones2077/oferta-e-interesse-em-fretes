import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilTransportador from "../middlewares/verificar-perfil-transportador";
import ServiçosTransportador from "../serviços/serviços-transportador";
const RotasTransportador = Router();
export default RotasTransportador;
RotasTransportador.post("/", ServiçosTransportador.cadastrarTransportador);
RotasTransportador.patch("/", verificarToken, verificarPerfilTransportador, ServiçosTransportador.atualizarTransportador);
RotasTransportador.get("/:cpf", verificarToken, verificarPerfilTransportador, ServiçosTransportador.buscarTransportador);