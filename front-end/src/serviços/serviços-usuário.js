import servidor from "./servidor";

export function serviçoLogarUsuário(login) { return servidor.post("/usuarios/login", login); };
export function serviçoVerificarCpfExistente(cpf) { return servidor.post
    (`/usuarios/verificar-cpf/${cpf}`); };