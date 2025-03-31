import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Usuário from "./usuário";
import Disponibilidade from "./disponibilidade";

export enum Tipo_Veículo {
    BITREM = "Bitrem",
    CARRETA = "Carreta",
    RODOTREM = "Rodotrem",
    BAÚ = "Baú",
};

@Entity()
export default class Transportador extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Tipo_Veículo })
    tipo_veículo: Tipo_Veículo;

    @Column()
    n_eixos_veículo: number;

    @Column()
    capacidade_carga_veículo: number;

    @OneToMany(() => Disponibilidade, (disponibilidade) => disponibilidade.transportador)
    disponibilidades: Disponibilidade[];

    @OneToOne(() => Usuário, usuário => usuário.transportador, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}