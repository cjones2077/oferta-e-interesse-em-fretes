import servidor from "./servidor";

export function serviçoCadastrarTransportador(transportador) { return servidor.post("/transportadores", transportador); };
export function serviçoAtualizarTransportador(transportador) { return servidor.patch("/transportadores", transportador); };
export function serviçoBuscarTransportador(cpf) { return servidor.get(`/transportadores/${cpf}`); };