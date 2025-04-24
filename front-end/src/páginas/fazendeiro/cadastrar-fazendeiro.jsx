import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoCadastrarFazendeiro, serviçoBuscarFazendeiro, serviçoAtualizarFazendeiro }
    from "../../serviços/serviços-fazendeiro";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";
import {estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
    estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel }
    from "../../utilitários/estilos";

export default function CadastrarFazendeiro() {
    const referênciaToast = useRef(null);
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({ tipo_produção: "", tamanho_propriedade: "" });
    const [erros, setErros] = useState({});
    const [cpfExistente, setCpfExistente] = useState(false);
    const navegar = useNavigate();
    const opçõesProdução = [{ label: "Grãos", value: "grãos" },
    { label: "Gado", value: "gado" },
    {label: "Hortaliças", value: "hortaliças"},
    {label: "Frutas", value: "frutas"},
    {label: "Café", value: "café"}];

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };

    function validarCampos() {
        let errosCamposObrigatórios;
        errosCamposObrigatórios = validarCamposObrigatórios(dados);
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function títuloFormulário() {
        if (usuárioLogado?.cadastrado) return "Alterar Fazendeiro";
        else return "Cadastrar Fazendeiro";
    };

    async function atualizarFazendeiro() {
        if (validarCampos()) {
            try {
                const response = await serviçoAtualizarFazendeiro({ ...dados, cpf: usuárioLogado.cpf });
                if (response) mostrarToast(referênciaToast, "Fazendeiro atualizado com sucesso!", "sucesso");
            } catch (error) {
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    };

    async function cadastrarFazendeiro() {
        if (validarCampos()) {
            try {
                const response = await serviçoCadastrarFazendeiro({ ...dados, usuário_info: usuárioLogado,
                    tamanho_propriedade: dados.tamanho_propriedade,
                    tipo_produção: dados.tipo_produção});
                if (response.data)
                    setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status,
                        token: response.data.token }));
                mostrarToast(referênciaToast, "Fazendeiro cadastrado com sucesso!", "sucesso");
            } catch (error) {
                setCpfExistente(true);
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    };

    function labelBotãoSalvar() {
        if (usuárioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    };

    function açãoBotãoSalvar() {
        if (usuárioLogado?.cadastrado) atualizarFazendeiro();
        else cadastrarFazendeiro();
        };

    function redirecionar() {
        if (cpfExistente) {
            setUsuárioLogado(null);
            navegar("/criar-usuario");
        } else {
            setUsuárioLogado(usuárioLogado => ({ ...usuárioLogado, cadastrado: true }));
            navegar("/pagina-inicial");
        }
    };

    useEffect(() => {
        let desmontado = false;
        async function buscarDadosFazendeiro() {
            try {
                const response = await serviçoBuscarFazendeiro(usuárioLogado.cpf);
                if (!desmontado && response.data) {
                    setDados(dados => ({ ...dados, tamanho_propriedade: response.data.tamanho_propriedade,
                        tipo_produção: response.data.tipo_produção }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "erro");
            }
        }
        if (usuárioLogado?.cadastrado) buscarDadosFazendeiro();
        return () => desmontado = true;
    }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);


        return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center"/>
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tipo de Produção*:</label>
                    <Dropdown name="tipo_produção"
                        className={estilizarDropdown(erros.tipo_produção, usuárioLogado.cor_tema)}
                        value={dados.tipo_produção} options={opçõesProdução} onChange={alterarEstado}
                        placeholder="-- Selecione --"/>
                    <MostrarMensagemErro mensagem={erros.tipo_produção}/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>
                         Tamanho da Propiedade (ha)*:</label>
                    <InputNumber name="tamanho_propriedade" size={5}
                        value={dados.tamanho_propriedade}
                        onValueChange={alterarEstado} mode="decimal"
                        inputClassName={estilizarInputNumber(erros.tamanho_propriedade,
                            usuárioLogado.cor_tema)}/>
                <MostrarMensagemErro mensagem={erros.tamanho_propriedade}/>
            </div>
            <Divider className={estilizarDivider(dados.cor_tema)}/>
            <div className={estilizarInlineFlex()}>
                <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
                <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar}/>
            </div>
            </Card>
        </div>
        );
        };