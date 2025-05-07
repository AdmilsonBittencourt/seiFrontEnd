import type { Disciplina } from "./interfaceDisciplina"
import type { Professor } from "./interfaceProfessor"
import type { Sala } from "./interfaceSalas"

export interface Turma {
    id?: number
    codigo: string
    semestre: string
    horario: string
    ativo: boolean
    id_sala: number
    id_professor: number
    id_disciplina: number
}

export interface TurmaInterfaces {
    id?: number
    codigo: string
    semestre: string
    horario: string
    ativo: boolean
    sala: Sala
    professor: Professor
    disciplina: Disciplina
}