import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

import DisciplinaForm, { type DisciplinaFormHandles, type DisciplinaWithId } from "./DisciplinaForm"; // Importar handles e interface com ID

export default function DisciplinaList() {
    const [disciplinasAtivas, setDisciplinasAtivas] = useState<DisciplinaWithId[]>([]);
    const [disciplinasInativas, setDisciplinasInativas] = useState<DisciplinaWithId[]>([]);
    const [searchTermAtivos, setSearchTermAtivos] = useState<string>("");
    const [searchTermInativos, setSearchTermInativos] = useState<string>("");
    const disciplinaFormRef = useRef<DisciplinaFormHandles>(null);

    const fetchDisciplinas = async () => {
        try {
            const res = await api.get("/disciplinas");
            // Assumindo que a API retorna um ID para cada disciplina
            const disciplinas = res.data.sort((a: DisciplinaWithId, b: DisciplinaWithId) => {
                // Ordenar por ID se existir, caso contrário, não ordenar ou ordenar por nome
                if (a.id && b.id) {
                    return Number(a.id) - Number(b.id);
                }
                return a.nome.localeCompare(b.nome);
            });
            const ativos = disciplinas.filter((disc: DisciplinaWithId) => disc.ativo);
            const inativos = disciplinas.filter((disc: DisciplinaWithId) => !disc.ativo);
            setDisciplinasAtivas(ativos);
            setDisciplinasInativas(inativos);
        } catch (error) {
            console.error("Erro ao buscar disciplinas:", error);
        }
    };

    useEffect(() => {
        fetchDisciplinas();
    }, []);

    const filteredDisciplinasAtivas = disciplinasAtivas.filter(disc =>
        disc.nome.toLowerCase().includes(searchTermAtivos.toLowerCase()) ||
        disc.codigo.toLowerCase().includes(searchTermAtivos.toLowerCase())
    );

    const filteredDisciplinasInativas = disciplinasInativas.filter(disc =>
        disc.nome.toLowerCase().includes(searchTermInativos.toLowerCase()) ||
        disc.codigo.toLowerCase().includes(searchTermInativos.toLowerCase())
    );

    const handleDeactivate = async (id: string | number | undefined) => {
        if (!id) return;
        if (!window.confirm("Tem certeza que deseja desativar esta disciplina?")) {
            return;
        }
        try {
            await api.patch(`/disciplinas/${id}/desativar`);
            await fetchDisciplinas();
            alert("Disciplina desativada com sucesso!");
        } catch (error: any) {
            console.error("Erro ao desativar disciplina:", error);
            alert(error.response?.data?.error || "Erro ao desativar disciplina.");
        }
    };

    const handleReactivate = async (id: string | number | undefined) => {
        if (!id) return;
        if (!window.confirm("Tem certeza que deseja reativar esta disciplina?")) {
            return;
        }
        try {
            await api.patch(`/disciplinas/${id}/reativar`);
            await fetchDisciplinas();
            alert("Disciplina reativada com sucesso!");
        } catch (error: any) {
            console.error("Erro ao reativar disciplina:", error);
            alert(error.response?.data?.error || "Erro ao reativar disciplina.");
        }
    };

    const handleFormSubmit = async () => {
        await fetchDisciplinas();
    };

    const handleOpenAddForm = () => {
        disciplinaFormRef.current?.openDialog('add');
    };

    const handleOpenEditForm = (disciplina: DisciplinaWithId) => {
        disciplinaFormRef.current?.openDialog('edit', disciplina);
    };

    return (
        <div>
            <button onClick={handleOpenAddForm} style={{ marginBottom: '20px', padding: '10px' }}>
                Adicionar Nova Disciplina
            </button>

            <h1>Lista de Disciplinas Ativas</h1>
            <input
                type="text"
                placeholder="Buscar disciplina ativa (nome ou código)..."
                value={searchTermAtivos}
                onChange={(e) => setSearchTermAtivos(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Nome</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Código</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Carga Horária</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDisciplinasAtivas.map(disc => (
                        <tr key={disc.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disc.nome}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disc.codigo}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disc.carga_horaria}h</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button onClick={() => handleOpenEditForm(disc)} style={{ marginRight: '5px' }}>Editar</button>
                                <button onClick={() => handleDeactivate(disc.id)}>Desativar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h1>Lista de Disciplinas Inativas</h1>
            <input
                type="text"
                placeholder="Buscar disciplina inativa (nome ou código)..."
                value={searchTermInativos}
                onChange={(e) => setSearchTermInativos(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Nome</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Código</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Carga Horária</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDisciplinasInativas.map(disc => (
                        <tr key={disc.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disc.nome}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disc.codigo}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disc.carga_horaria}h</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button onClick={() => handleReactivate(disc.id)}>Reativar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DisciplinaForm ref={disciplinaFormRef} onFormSubmit={handleFormSubmit} />
        </div>
    );
}