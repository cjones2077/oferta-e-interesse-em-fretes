import { Perfil } from "../entidades/usuário";

export default function verificarPerfilFazendeiro(request, response, next) {
    if (request.perfil === Perfil.FAZENDEIRO) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};