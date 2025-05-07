import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import type { Sala } from "../types/interfaceSalas"; // Alterado para interfaceSalas
import SalaForm, { type SalaFormHandles, type SalaWithId } from "./SalaForm"; // Importar handles e interface com ID

export default function SalaList() {
    const [salasAtivas, setSalasAtivas] = useState<SalaWithId[]>([]);
    const [salasInativas, setSalasInativas] = useState<SalaWithId[]>([]);
    const [searchTermAtivos, setSearchTermAtivos] = useState<string>("");
    const [searchTermInativos, setSearchTermInativos] = useState<string>("");
    const salaFormRef = useRef<SalaFormHandles>(null);

    const fetchSalas = async () => {
        try {
            const res = await api.get("/salas");
            // Assumindo que a API retorna um ID para cada sala
            const salas = res.data.sort((a: SalaWithId, b: SalaWithId) => {
                // Ordenar por ID se existir, caso contrário, não ordenar ou ordenar por nome
                if (a.id && b.id) {
                    return Number(a.id) - Number(b.id);
                }
                return a.nome.localeCompare(b.nome);
            });
            const ativos = salas.filter((sala: SalaWithId) => sala.ativo);
            const inativos = salas.filter((sala: SalaWithId) => !sala.ativo);
            setSalasAtivas(ativos);
            setSalasInativas(inativos);
        } catch (error) {
            console.error("Erro ao buscar salas:", error);
        }
    };

    useEffect(() => {
        fetchSalas();
    }, []);

    const filteredSalasAtivas = salasAtivas.filter(sala =>
        sala.nome.toLowerCase().includes(searchTermAtivos.toLowerCase()) ||
        sala.tipo.toLowerCase().includes(searchTermAtivos.toLowerCase())
    );

    const filteredSalasInativas = salasInativas.filter(sala =>
        sala.nome.toLowerCase().includes(searchTermInativos.toLowerCase()) ||
        sala.tipo.toLowerCase().includes(searchTermInativos.toLowerCase())
    );

    const handleDeactivate = async (id: string | number | undefined) => {
        if (!id) return;
        if (!window.confirm("Tem certeza que deseja desativar esta sala?")) {
            return;
        }
        try {
            await api.patch(`/salas/${id}/desativar`);
            await fetchSalas();
            alert("Sala desativada com sucesso!");
        } catch (error: any) {
            console.error("Erro ao desativar sala:", error);
            alert(error.response?.data?.error || "Erro ao desativar sala.");
        }
    };

    const handleReactivate = async (id: string | number | undefined) => {
        if (!id) return;
        if (!window.confirm("Tem certeza que deseja reativar esta sala?")) {
            return;
        }
        try {
            await api.patch(`/salas/${id}/reativar`);
            await fetchSalas();
            alert("Sala reativada com sucesso!");
        } catch (error: any) {
            console.error("Erro ao reativar sala:", error);
            alert(error.response?.data?.error || "Erro ao reativar sala.");
        }
    };

    const handleFormSubmit = async () => {
        await fetchSalas();
    };

    const handleOpenAddForm = () => {
        salaFormRef.current?.openDialog('add');
    };

    const handleOpenEditForm = (sala: SalaWithId) => {
        salaFormRef.current?.openDialog('edit', sala);
    };

    return (
        <div>
            <button onClick={handleOpenAddForm} style={{ marginBottom: '20px', padding: '10px' }}>
                Adicionar Nova Sala
            </button>

            <h1>Lista de Salas Ativas</h1>
            <input
                type="text"
                placeholder="Buscar sala ativa (nome ou tipo)..."
                value={searchTermAtivos}
                onChange={(e) => setSearchTermAtivos(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Nome/Número</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Capacidade</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Tipo</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSalasAtivas.map(sala => (
                        <tr key={sala.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sala.nome}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sala.capacidade}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sala.tipo}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button onClick={() => handleOpenEditForm(sala)} style={{ marginRight: '5px' }}>Editar</button>
                                <button onClick={() => handleDeactivate(sala.id)}>Desativar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h1>Lista de Salas Inativas</h1>
            <input
                type="text"
                placeholder="Buscar sala inativa (nome ou tipo)..."
                value={searchTermInativos}
                onChange={(e) => setSearchTermInativos(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: 'calc(100% - 16px)' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Nome/Número</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Capacidade</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Tipo</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSalasInativas.map(sala => (
                        <tr key={sala.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sala.nome}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sala.capacidade}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sala.tipo}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button onClick={() => handleReactivate(sala.id)}>Reativar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <SalaForm ref={salaFormRef} onFormSubmit={handleFormSubmit} />
        </div>
    );
}