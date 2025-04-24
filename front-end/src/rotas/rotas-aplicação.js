import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarFazendeiro from "../páginas/fazendeiro/cadastrar-fazendeiro";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarTransportador from "../páginas/transportador/cadastrar-transportador";

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
    <Route element={<LogarUsuário />} path="/" />
    <Route element={<CadastrarUsuário />} path="criar-usuario" />
    <Route element={<RecuperarAcesso />} path="recuperar-acesso" /> {/* ← Aqui fora! */}

    <Route element={<RotasUsuárioLogado />}>
        <Route element={<PáginaInicial />} path="pagina-inicial" />
        <Route element={<CadastrarUsuário />} path="atualizar-usuario" />
        <Route element={<CadastrarFazendeiro />} path="cadastrar-fazendeiro" />
        <Route element={<CadastrarTransportador />} path="cadastrar-transportador" />
    </Route>
</Routes>

        </BrowserRouter>
    );
};