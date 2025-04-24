import servidor from "./servidor";

export function serviçoCadastrarFazendeiro(fazendeiro)
    { return servidor.post("/fazendeiros", fazendeiro); };
export function serviçoBuscarFazendeiro(cpf) { return servidor.get(`/fazendeiros/${cpf}`); };
export function serviçoAtualizarFazendeiro(fazendeiro) { return servidor.patch("/fazendeiros", fazendeiro); };