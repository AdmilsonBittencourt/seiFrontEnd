import { useEffect, useState } from "react"
import api from "../api/axios"
import type { Professor } from "../types/interfaceProfessor"

export default function ProfessorList() {

    const [professoresAtivos, setProfessoresAtivos] = useState<Professor[]>([])
    const [professoresInativos, setProfessoresInativos] = useState<Professor[]>([])

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const res = await api.get("/professores")
        const professores = res.data.sort((a: Professor, b: Professor) => {
            if (a.id && b.id) {
              return Number(a.id) - Number(b.id)
            }
            return 0
          })
        const ativos = professores.filter((prof: Professor) => prof.ativo)
        const inativos = professores.filter((prof: Professor) => !prof.ativo)
        setProfessoresAtivos(ativos)
        setProfessoresInativos(inativos)
      } catch (error) {
        console.error("Erro ao buscar professores:", error)
      }
    }

    fetchProfessores()
  }, [])
    
    return (
        <div>
        <h1>Lista de Professores</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Nome</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Telefone</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>CPF</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Departamento</th>
            </tr>
          </thead>
          <tbody>
            {professoresAtivos.map(prof => (
              <tr key={prof.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.nome}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.telefone}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.CPF}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.departamento}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1>Lista de Professores Inativos</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Nome</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Telefone</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>CPF</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Departamento</th>
            </tr>
          </thead>
          <tbody>
            {professoresInativos.map(prof => (
              <tr key={prof.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.nome}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.telefone}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.CPF}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.departamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }