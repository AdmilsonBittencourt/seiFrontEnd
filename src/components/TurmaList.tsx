import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import type { Turma } from "../types/interfaceTurma";
import TurmaForm, { type TurmaFormHandles } from "./TurmaForm";

export default function TurmaList() {
    const [turmasAtivas, setTurmasAtivas] = useState<Turma[]>([]);
    const [turmasInativas, setTurmasInativas] = useState<Turma[]>([]);
    const [searchTermAtivos, setSearchTermAtivos] = useState<string>("");
    const [searchTermInativos, setSearchTermInativos] = useState<string>("");
    const turmaFormRef = useRef<TurmaFormHandles>(null);

    const fetchTurmas = async () => {
        try {
            const res = await api.get("/turmas");
            const turmas = res.data.sort((a: Turma, b: Turma) => a.codigo.localeCompare(b.codigo));
            const ativas = turmas.filter((turma: Turma) => turma.ativo);
            const inativas = turmas.filter((turma: Turma) => !turma.ativo);
            setTurmasAtivas(ativas);
            setTurmasInativas(inativas);
        } catch (error) {
            console.error("Erro ao buscar turmas:", error);
        }
    };

    useEffect(() => {
        fetchTurmas();
    }, []);
    
    const filteredTurmasAtivas = turmasAtivas.filter(turma =>
        turma.codigo.toLowerCase().includes(searchTermAtivos.toLowerCase()) ||
        turma.semestre.toLowerCase().includes(searchTermAtivos.toLowerCase())
    );

    const filteredTurmasInativas = turmasInativas.filter(turma =>
        turma.codigo.toLowerCase().includes(searchTermInativos.toLowerCase()) ||
        turma.semestre.toLowerCase().includes(searchTermInativos.toLowerCase())
    );

    const handleDeactivate = async (codigo: string | undefined) => {
        if (!codigo) return;
    
        if (!window.confirm("Tem certeza que deseja desativar esta turma?")) {
            return;
        }
    
        try {
            const response = await api.patch(`/turmas/${codigo}/desativar`);
            if (response.status === 200 || response.status === 204) {
                await fetchTurmas();
                alert("Turma desativada com sucesso!");
            }
        } catch (error: any) {
            console.error("Erro ao desativar turma:", error);
            alert(error.response?.data?.error || "Erro ao desativar turma.");
        }
    };

    const handleReactivate = async (codigo: string | undefined) => {
        if (!codigo) return;
    
        if (!window.confirm("Tem certeza que deseja reativar esta turma?")) {
            return;
        }
    
        try {
            const response = await api.patch(`/turmas/${codigo}/reativar`);
            if (response.status === 200 || response.status === 204) {
                await fetchTurmas();
                alert("Turma reativada com sucesso!");
            }
        } catch (error: any) {
            console.error("Erro ao reativar turma:", error);
            alert(error.response?.data?.error || "Erro ao reativar turma.");
        }
    };

    const handleFormSubmit = async () => {
        await fetchTurmas();
    };

    const handleOpenAddForm = () => {
        turmaFormRef.current?.openDialog('add');
    };

    const handleOpenEditForm = (turma: Turma) => {
        turmaFormRef.current?.openDialog('edit', turma);
    };
    
    return (
        <div>
            <button onClick={handleOpenAddForm} style={{ marginBottom: '20px', padding: '10px' }}>
                Adicionar Nova Turma
            </button>

            <h1>Lista de Turmas Ativas</h1>
            <input
              type="text"
              placeholder="Buscar turma ativa (código ou semestre)..."
              value={searchTermAtivos}
              onChange={(e) => setSearchTermAtivos(e.target.value)}
              style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Código</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Semestre</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Horário</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Sala</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Professor</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Disciplina</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Ações</th> 
                </tr>
              </thead>
              <tbody>
                {filteredTurmasAtivas.map(turma => (
                  <tr key={turma.codigo}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.codigo}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.semestre}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.horario}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.id_sala}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.id_professor}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.id_disciplina}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}> 
                        <button onClick={() => handleOpenEditForm(turma)} style={{ marginRight: '5px' }}>Editar</button>
                        <button onClick={() => handleDeactivate(turma.codigo)}>Desativar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h1>Lista de Turmas Inativas</h1>
            <input
              type="text"
              placeholder="Buscar turma inativa (código ou semestre)..."
              value={searchTermInativos}
              onChange={(e) => setSearchTermInativos(e.target.value)}
              style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Código</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Semestre</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Horário</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Sala</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Professor</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Disciplina</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTurmasInativas.map(turma => (
                  <tr key={turma.codigo}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.codigo}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.semestre}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.horario}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.id_sala}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.id_professor}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{turma.id_disciplina}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}> 
                        <button onClick={() => handleReactivate(turma.codigo)}>Reativar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TurmaForm ref={turmaFormRef} onFormSubmit={handleFormSubmit} />
        </div>
    );
}