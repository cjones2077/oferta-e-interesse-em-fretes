import { Router } from "express";

import ServiçosUsuário from "../serviços/serviços-usuário";

const RotasUsuário = Router();

export default RotasUsuário;

RotasUsuário.post("/login", ServiçosUsuário.logarUsuário);
RotasUsuário.post("/verificar-cpf/:cpf", ServiçosUsuário.verificarCpfExistente);