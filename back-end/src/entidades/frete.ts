import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import Fazendeiro from "./fazendeiro";
import Disponibilidade from "./disponibilidade";

export enum Categoria {
    CARGA_LEVE = "Carga Leve",
    CARGA_PESADA = "Carga Pesada",
    FRIGORIFICA = "Frigorífica",
    PERIGOSA = "Perigosa"
  }
  
  export enum Tipo_Carga {
    ALIMENTOS = "Alimentos",
    PRODUTOS_QUIMICOS = "Produtos Químicos",
    ELETRONICOS = "Eletrônicos",
    MATERIAS_PRIMAS = "Matérias-Primas"
  }
  

@Entity()
export default class Frete extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    origem: string;

    @Column({ type: "enum", enum: Categoria })
    categoria: Categoria;

    @Column({ type: "enum", enum: Tipo_Carga })
    tipo_carga: Tipo_Carga;

    @Column({ type: "float" })
    valor: number;

    @Column({ type: "date" })
    data_início: Date;

    @Column({ type: "date" })
    prazo: Date;

    @ManyToOne(() => Fazendeiro, (fazendeiro) => fazendeiro.fretes, { onDelete: "CASCADE" })
    fazendeiro: Fazendeiro;

    @OneToMany(() => Disponibilidade, (disponibilidade) => disponibilidade.frete)
    disponibilidades: Disponibilidade[];
}