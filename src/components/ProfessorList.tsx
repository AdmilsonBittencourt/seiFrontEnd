import { useEffect, useState } from "react"
import api from "../api/axios"
import type { Professor } from "../types/interfaceProfessor"

export default function ProfessorList() {

    const [professores, setProfessores] = useState<Professor[]>([])

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await api.get("/professores")
        setProfessores(response.data)
      } catch (error) {
        console.error("Erro ao buscar professores:", error)
      }
    }

    fetchProfessores()
  }, [])
    
    return (
        <div>
        <h1>Lista de Professores</h1>
        <ul>
          {professores.map(prof => (
            <li key={prof.id}>{prof.nome} - {prof.email}</li>
          ))}
        </ul>
      </div>
    )
  }