import { useRef, useState, type FormEvent, useImperativeHandle, forwardRef } from 'react';
import api from '../api/axios';
import type { Disciplina } from '../types/interfaceDisciplina';

// Interface para os dados do formulário de Disciplina
interface DisciplinaFormData {
    nome: string;
    codigo: string;
    carga_horaria: string; // Manter como string para o input, converter para número ao enviar
    ativo: boolean;
}

// Props do DisciplinaForm
interface DisciplinaFormProps {
    onFormSubmit: () => Promise<void> | void; // Chamado após adicionar ou editar
}

// Tipagem para as funções expostas pelo ref
// Adicionando 'id' à interface Disciplina para uso interno no formulário, assumindo que a API retorna um ID.
export interface DisciplinaWithId extends Disciplina {
    id?: number | string;
}
export interface DisciplinaFormHandles {
    openDialog: (mode: 'add' | 'edit', disciplina?: DisciplinaWithId) => void;
}

const defaultFormData: DisciplinaFormData = {
    nome: '',
    codigo: '',
    carga_horaria: '',
    ativo: true,
};

const DisciplinaForm = forwardRef<DisciplinaFormHandles, DisciplinaFormProps>(({ onFormSubmit }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState<DisciplinaFormData>(defaultFormData);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [editingDisciplinaId, setEditingDisciplinaId] = useState<string | number | undefined>(undefined);

    useImperativeHandle(ref, () => ({
        openDialog: (currentMode: 'add' | 'edit', disciplina?: DisciplinaWithId) => {
            setMode(currentMode);
            if (currentMode === 'edit' && disciplina) {
                setFormData({
                    nome: disciplina.nome,
                    codigo: disciplina.codigo,
                    carga_horaria: String(disciplina.carga_horaria), // Converter para string para o input
                    ativo: disciplina.ativo !== undefined ? disciplina.ativo : true,
                });
                setEditingDisciplinaId(disciplina.id);
            } else {
                setFormData(defaultFormData);
                setEditingDisciplinaId(undefined);
            }
            dialogRef.current?.showModal();
        }
    }));

    const closeDialog = () => {
        dialogRef.current?.close();
        setFormData(defaultFormData);
        setMode('add');
        setEditingDisciplinaId(undefined);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            carga_horaria: Number(formData.carga_horaria), // Converter para número antes de enviar
        };

        try {
            if (mode === 'edit' && editingDisciplinaId) {
                const response = await api.put(`/disciplinas/${editingDisciplinaId}`, payload);
                console.log("Disciplina editada:", response.data);
                alert("Disciplina editada com sucesso!");
            } else {
                const response = await api.post("/disciplinas", payload);
                console.log("Disciplina adicionada:", response.data);
                alert("Disciplina adicionada com sucesso!");
            }
            closeDialog();
            await onFormSubmit();
        } catch (error: any) {
            console.error(`Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} disciplina:`, error);
            const errorMessage = error.response?.data?.error || `Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} disciplina. Verifique o console.`;
            alert(errorMessage);
        }
    };

    return (
        <dialog ref={dialogRef}>
            <h2>{mode === 'edit' ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
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
                    <label htmlFor="codigo">Código:</label>
                    <input
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="carga_horaria">Carga Horária:</label>
                    <input
                        type="number" // Input type number, mas o estado é string para facilitar
                        id="carga_horaria"
                        name="carga_horaria"
                        value={formData.carga_horaria}
                        onChange={handleChange}
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
                <button type="submit">{mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Disciplina'}</button>
                <button type="button" onClick={closeDialog} style={{ marginLeft: '10px' }}>Cancelar</button>
            </form>
        </dialog>
    );
});

export default DisciplinaForm;