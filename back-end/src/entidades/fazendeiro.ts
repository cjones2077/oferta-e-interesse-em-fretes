import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from
"typeorm";

import Usuário from "./usuário";
import Frete from "./frete";

export enum Tipo_Produção {GRÃOS = "grãos", GADO = "gado", HORTALIÇAS = "hortaliças", FRUTAS = "frutas", CAFÉ = "café"};

@Entity()
export default class Fazendeiro extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Tipo_Produção })
    tipo_produção: Tipo_Produção;

    @Column()
    tamanho_propriedade: number;

    @OneToMany(() => Frete, (frete) => frete.fazendeiro)
    fretes: Frete[];

    @OneToOne(() => Usuário, (usuário) => usuário.fazendeiro, { onDelete: "CASCADE" })
    
    @JoinColumn()
    usuário: Usuário;
}