import { useContext } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import ContextoUsuário from "../../contextos/contexto-usuário";
import caminhão from "../../imagens/caminhão.jpg";
import { estilizarCard, estilizarCardHeaderCentralizado, estilizarPáginaÚnica }
from "../../utilitários/estilos";

export default function PáginaInicial() {

    const { usuárioLogado } = useContext(ContextoUsuário);

    function HeaderCentralizado() {
        return (<div className={estilizarCardHeaderCentralizado()}>
            Sistema de Oferta e Interesse em Fretes</div>)
    };

    return (
    <div className={estilizarPáginaÚnica()}>
        <Card header={HeaderCentralizado} className={estilizarCard(usuárioLogado.cor_tema)}>
            <Image src={caminhão} alt="Venha fazer a diferença!" width={1100} />
        </Card>
    </div>
    );
};