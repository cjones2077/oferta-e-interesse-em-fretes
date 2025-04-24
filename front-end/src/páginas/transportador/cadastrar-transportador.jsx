import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import {
    serviçoCadastrarTransportador,
    serviçoAtualizarTransportador,
    serviçoBuscarTransportador,
} from "../../serviços/serviços-transportador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
    MostrarMensagemErro,
    checarListaVazia,
    validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
    TAMANHOS,
    estilizarBotão,
    estilizarBotãoRetornar,
    estilizarCard,
    estilizarDivCampo,
    estilizarDivider,
    estilizarDropdown,
    estilizarFlex,
    estilizarInlineFlex,
    estilizarInputMask,
    estilizarInputNumber,
    estilizarInputText,
    estilizarLabel,
} from "../../utilitários/estilos";
import { InputNumber } from "primereact/inputnumber";

export default function CadastrarTransportador() {
    const referênciaToast = useRef(null);
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({
        n_eixos_veículo: "",
        capacidade_carga_veículo: "",
    });
    const [erros, setErros] = useState({});
    const [cpfExistente, setCpfExistente] = useState(false);
    const navegar = useNavigate();
    const opçõesTipoVeículo = [
        { label: "Bitrem", value: "Bitrem" },
        { label: "Carreta", value: "Carreta"},
        { label: "Rodotrem", value: "Rodotrem"},
        { label: "Baú", value: "Baú"}
    ];

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        console.log("alterarEstado called with key:", chave, "and value:", valor); // Debug log
        setDados({ ...dados, [chave]: valor });
    }

    function validarCampos() {
        let errosCamposObrigatórios;
        errosCamposObrigatórios = validarCamposObrigatórios(dados);
        setErros(errosCamposObrigatórios);
        console.log("Validating fields, errors:", errosCamposObrigatórios); // Debug log
        return checarListaVazia(errosCamposObrigatórios);
    }

    function títuloFormulário() {
        if (usuárioLogado?.cadastrado) return "Alterar Transportador";
        else return "Cadastrar Transportador";
    }

    async function cadastrarTransportador() {
        if (validarCampos()) {
            try {
                console.log("Attempting to register transportador with data:", dados); // Debug log
                const response = await serviçoCadastrarTransportador({
                    ...dados,
                    usuário_info: usuárioLogado,
                    tipo_veículo: dados.tipo_veículo,
                    n_eixos_veículo: dados.n_eixos_veículo,
                    capacidade_carga_veículo: dados.capacidade_carga_veículo,
                });
                console.log("Response from serviceCadastrarTransportador:", response); // Debug log
                if (response.data)
                    setUsuárioLogado((usuário) => ({
                        ...usuário,
                        status: response.data.status,
                        token: response.data.token,
                    }));
                mostrarToast(referênciaToast, "Transportador cadastrado com sucesso!", "sucesso");
            } catch (error) {
                setCpfExistente(true);
                console.error("Error during registration:", error); // Debug log
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    }

    async function atualizarTransportador() {
        if (validarCampos()) {
            try {
                console.log("Attempting to update transportador with data:", dados); // Debug log
                const response = await serviçoAtualizarTransportador({
                    ...dados,
                    cpf: usuárioLogado.cpf,
                });
                console.log("Response from serviceAtualizarTransportador:", response); // Debug log
                if (response)
                    mostrarToast(referênciaToast, "Transportador atualizado com sucesso!", "sucesso");
            } catch (error) {
                console.error("Error during update:", error); // Debug log
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    }

    function labelBotãoSalvar() {
        if (usuárioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    }

    function açãoBotãoSalvar() {
        console.log("Button clicked, user registered:", usuárioLogado?.cadastrado); // Debug log
        if (usuárioLogado?.cadastrado) atualizarTransportador();
        else cadastrarTransportador();
    }

    function redirecionar() {
        console.log("Redirecting, CPF Exists:", cpfExistente); // Debug log
        if (cpfExistente) {
            setUsuárioLogado(null);
            navegar("/criar-usuario");
        } else {
            setUsuárioLogado((usuárioLogado) => ({
                ...usuárioLogado,
                cadastrado: true,
            }));
            navegar("/pagina-inicial");
        }
    }

    useEffect(() => {
        let desmontado = false;
        async function buscarDadosTransportador() {
            try {
                console.log("Fetching transportador data for CPF:", usuárioLogado?.cpf); // Debug log
                const response = await serviçoBuscarTransportador(usuárioLogado.cpf);
                console.log("Response from serviceBuscarTransportador:", response); // Debug log
                if (!desmontado && response.data) {
                    setDados((dados) => ({
                        ...dados,
                        tipo_veículo: response.data.curso,
                        n_eixos_veículo: response.data.ano_ingresso,
                        capacidade_carga_veículo: response.data.data_nascimento,
                    }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                console.error("Error during data fetch:", erro); // Debug log
                if (erro) mostrarToast(referênciaToast, erro, "erro");
            }
        }
        if (usuárioLogado?.cadastrado) buscarDadosTransportador();
        return () => (desmontado = true);
    }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Toast
                ref={referênciaToast}
                onHide={redirecionar}
                position="bottom-center"
            />
            <Card
                title={títuloFormulário()}
                className={estilizarCard(usuárioLogado.cor_tema)}
            >
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>
                        Tipo de Veículo*:
                    </label>
                    <Dropdown
                        name="tipo_veículo"
                        className={estilizarDropdown(erros.tipo_veículo, usuárioLogado.cor_tema)}
                        value={dados.tipo_veículo}
                        options={opçõesTipoVeículo}
                        onChange={alterarEstado}
                        placeholder="-- Selecione --"
                    />
                    <MostrarMensagemErro mensagem={erros.tipo_veículo} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>
                        Número de Eixos do Veículo*:
                    </label>
                    <InputNumber
                        name="n_eixos_veículo"
                        value={dados.n_eixos_veículo}
                        onValueChange={alterarEstado} 
                        size={TAMANHOS.N_EIXOS}
                        InputClassName={estilizarInputNumber(
                            erros.n_eixos_veículo,
                            usuárioLogado.cor_tema
                        )}
                        
                    />
                    <MostrarMensagemErro mensagem={erros.n_eixos_veículo} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>
                        Capacidade de Carga do Veículo (tons)*:
                    </label>
                    <InputNumber
                        name="capacidade_carga_veículo"
                        size={TAMANHOS.N_EIXOS}
                        value={dados.capacidade_carga_veículo}
                        onValueChange={alterarEstado} 
                        InputClassName={estilizarInputNumber(
                            erros.capacidade_carga_veículo,
                            usuárioLogado.cor_tema
                        )}
                    />
                    <MostrarMensagemErro mensagem={erros.capacidade_carga_veículo} />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <div className={estilizarInlineFlex()}>
                    <Button
                        className={estilizarBotãoRetornar()}
                        label="Retornar"
                        onClick={redirecionar}
                    />
                    <Button
                        className={estilizarBotão()}
                        label={labelBotãoSalvar()}
                        onClick={açãoBotãoSalvar}
                    />
                </div>
            </Card>
        </div>
    );
}
