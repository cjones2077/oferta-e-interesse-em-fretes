import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Transportador from "./transportador";
import Frete from "./frete";

@Entity()
    export default class Disponibilidade extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "float" })
    valor_proposto: string;

    @CreateDateColumn()
    data_manifestação: Date;

    @ManyToOne(() => Frete, (frete) => frete.disponibilidades, { onDelete: "CASCADE" })
    frete: Frete;

    @ManyToOne(() => Transportador, (transportador) => transportador.disponibilidades, { onDelete: "CASCADE" })
    transportador: Transportador;
}