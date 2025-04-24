import { Perfil } from '../entidades/usuário';

export default function verificarPerfilTransportador(request, response, next) {
    if (request.perfil === Perfil.TRANSPORTADOR) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};