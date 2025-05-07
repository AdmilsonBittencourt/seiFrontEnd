import { useEffect, useState } from "react"
import api from "../api/axios"
import type { Professor } from "../types/interfaceProfessor"

export default function ProfessorList() {

    const [professoresAtivos, setProfessoresAtivos] = useState<Professor[]>([])
    const [professoresInativos, setProfessoresInativos] = useState<Professor[]>([])
    const [searchTermAtivos, setSearchTermAtivos] = useState<string>("")
    const [searchTermInativos, setSearchTermInativos] = useState<string>("")

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
    
    const filteredProfessoresAtivos = professoresAtivos.filter(prof =>
        prof.nome.toLowerCase().includes(searchTermAtivos.toLowerCase())
    );

    const filteredProfessoresInativos = professoresInativos.filter(prof =>
        prof.nome.toLowerCase().includes(searchTermInativos.toLowerCase())
    );
    
    return (
        <div>
        <h1>Lista de Professores Ativos</h1>
        <input
          type="text"
          placeholder="Buscar professor ativo..."
          value={searchTermAtivos}
          onChange={(e) => setSearchTermAtivos(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
        />
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
            {filteredProfessoresAtivos.map(prof => (
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
        <input
          type="text"
          placeholder="Buscar professor inativo..."
          value={searchTermInativos}
          onChange={(e) => setSearchTermInativos(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
        />
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
            {filteredProfessoresInativos.map(prof => (
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