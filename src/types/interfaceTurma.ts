import type { Disciplina } from "./interfaceDisciplina"
import type { Professor } from "./interfaceProfessor"
import type { Sala } from "./interfaceSalas"

export interface Turma {
    codigo: string
    semestre: string
    horario: string
    ativo: boolean
    id_sala: number
    id_professor: number
    id_disciplina: number
}