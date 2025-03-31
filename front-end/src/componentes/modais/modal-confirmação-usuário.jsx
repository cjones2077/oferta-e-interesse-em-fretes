import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { estilizarBotão, estilizarBotãoRemover, estilizarDivCampo, estilizarInlineFlex,
estilizarLabel, estilizarModal } from "../../utilitários/estilos";

export default function ModalConfirmaçãoUsuário() {
    const referênciaToast = useRef(null);
    const { setUsuárioLogado, confirmaçãoUsuário, setConfirmaçãoUsuário, setMostrarModalConfirmação }
        = useContext(ContextoUsuário);
    const dados = { cpf: confirmaçãoUsuário?.cpf, perfil: confirmaçãoUsuário?.perfil,
    nome: confirmaçãoUsuário?.nome, senha: confirmaçãoUsuário?.senha,
    email: confirmaçãoUsuário?.email, questão: confirmaçãoUsuário?.questão,
    resposta: confirmaçãoUsuário?.resposta, cor_tema: confirmaçãoUsuário?.cor_tema };
    const [redirecionar] = useState(false);
    const navegar = useNavigate();

    function labelOperação() {
        switch (confirmaçãoUsuário?.operação) {
            case "salvar": return "Salvar";
            default: return;
        }
    };

    function exibirPerfilFormatado() {
        switch (dados.perfil) {
            case "fazendeiro": return "Fazendeiro";
            default: return "";
        }
    };

    function fecharToast() {
        if (redirecionar) {
            setMostrarModalConfirmação(false);
            setConfirmaçãoUsuário({});
            if (confirmaçãoUsuário?.operação) setUsuárioLogado({}); // inseriu ?
            navegar("../pagina-inicial");
        }
    };

    function finalizarCadastro() {
        if (dados.perfil === "fazendeiro") {
            setUsuárioLogado({ ...dados, cadastrado: false });
            setMostrarModalConfirmação(false);
            navegar("../cadastrar-fazendeiro");
        }
    };

    function executarOperação() {
        switch (confirmaçãoUsuário.operação) {
            case "salvar":
                finalizarCadastro();
                break;
            default: break;
        }
    };

    function ocultar() {
        if (!redirecionar) {
            setConfirmaçãoUsuário({});
            setMostrarModalConfirmação(false);
        }
    };

    return (
        <div className={estilizarModal()}>
            <Toast ref={referênciaToast} onHide={fecharToast} position="bottom-center"/>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>Tipo de Perfil:</label>
                <label>{exibirPerfilFormatado()}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
                CPF -- nome de usuário:</label>
                <label>{dados.cpf}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>Nome Completo:</label>
                <label>{dados.nome}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>Email:</label>
                <label>{dados.email}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
                Questão de Segurança:</label>
                <label>{dados.questão}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>Resposta:</label>
                <label>{dados.resposta}</label>
            </div>
            <div className={estilizarInlineFlex()}>
                <Button label={labelOperação()} onClick={executarOperação}
                className={estilizarBotão(confirmaçãoUsuário?.cor_tema)}/>
                <Button label="Corrigir" onClick={ocultar}
                className={estilizarBotãoRemover(confirmaçãoUsuário?.cor_tema)}/>
            </div>
        </div>
    );
};