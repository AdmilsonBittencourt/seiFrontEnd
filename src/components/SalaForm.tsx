import { useRef, useState, type FormEvent, useImperativeHandle, forwardRef } from 'react';
import api from '../api/axios';
import type { Sala } from '../types/interfaceSalas'; // Alterado para interfaceSalas

// Interface para os dados do formulário de Sala
interface SalaFormData {
    nome: string;
    capacidade: string; // Manter como string para o input, converter para número ao enviar
    tipo: string; // Ex: Laboratório, Auditório, Comum
    ativo: boolean;
}

// Props do SalaForm
interface SalaFormProps {
    onFormSubmit: () => Promise<void> | void; // Chamado após adicionar ou editar
}

// Tipagem para as funções expostas pelo ref
// Adicionando 'id' à interface Sala para uso interno no formulário, assumindo que a API retorna um ID.
export interface SalaWithId extends Sala {
    id?: number | string;
}
export interface SalaFormHandles {
    openDialog: (mode: 'add' | 'edit', sala?: SalaWithId) => void;
}

const defaultFormData: SalaFormData = {
    nome: '',
    capacidade: '',
    tipo: '',
    ativo: true,
};

const SalaForm = forwardRef<SalaFormHandles, SalaFormProps>(({ onFormSubmit }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState<SalaFormData>(defaultFormData);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [editingSalaId, setEditingSalaId] = useState<string | number | undefined>(undefined);

    useImperativeHandle(ref, () => ({
        openDialog: (currentMode: 'add' | 'edit', sala?: SalaWithId) => {
            setMode(currentMode);
            if (currentMode === 'edit' && sala) {
                setFormData({
                    nome: sala.nome,
                    capacidade: String(sala.capacidade), // Converter para string para o input
                    tipo: sala.tipo,
                    ativo: sala.ativo !== undefined ? sala.ativo : true,
                });
                setEditingSalaId(sala.id);
            } else {
                setFormData(defaultFormData);
                setEditingSalaId(undefined);
            }
            dialogRef.current?.showModal();
        }
    }));

    const closeDialog = () => {
        dialogRef.current?.close();
        setFormData(defaultFormData);
        setMode('add');
        setEditingSalaId(undefined);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked; // Para o checkbox
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            capacidade: Number(formData.capacidade), // Converter para número antes de enviar
        };

        try {
            if (mode === 'edit' && editingSalaId) {
                const response = await api.put(`/salas/${editingSalaId}`, payload);
                console.log("Sala editada:", response.data);
                alert("Sala editada com sucesso!");
            } else {
                const response = await api.post("/salas", payload);
                console.log("Sala adicionada:", response.data);
                alert("Sala adicionada com sucesso!");
            }
            closeDialog();
            await onFormSubmit();
        } catch (error: any) {
            console.error(`Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} sala:`, error);
            const errorMessage = error.response?.data?.error || `Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} sala. Verifique o console.`;
            alert(errorMessage);
        }
    };

    return (
        <dialog ref={dialogRef}>
            <h2>{mode === 'edit' ? 'Editar Sala' : 'Adicionar Nova Sala'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome/Número da Sala:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="capacidade">Capacidade:</label>
                    <input
                        type="number"
                        id="capacidade"
                        name="capacidade"
                        value={formData.capacidade}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="tipo">Tipo:</label>
                    <input // Poderia ser um select se os tipos forem predefinidos
                        type="text"
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        placeholder="Ex: Laboratório, Auditório, Comum"
                        required
                    />
                </div>
                {/* O campo 'ativo' pode ser controlado aqui se necessário, ou gerenciado apenas na lista */}
                {/* <div>
                    <label htmlFor="ativo">Ativo:</label>
                    <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={handleChange}
                    />
                </div> */}
                <button type="submit">{mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Sala'}</button>
                <button type="button" onClick={closeDialog} style={{ marginLeft: '10px' }}>Cancelar</button>
            </form>
        </dialog>
    );
});

export default SalaForm;