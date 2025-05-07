import { useRef, useState, type FormEvent, useImperativeHandle, forwardRef } from 'react';
import api from '../api/axios';
import type { Turma } from '../types/interfaceTurma';

// Interface para os dados do formulário
interface TurmaFormData {
    codigo: string;
    semestre: string;
    horario: string;
    id_sala: string; // Usar string para input, converter para number ao enviar
    id_professor: string; // Usar string para input, converter para number ao enviar
    id_disciplina: string; // Usar string para input, converter para number ao enviar
    ativo: boolean;
}

// Props do TurmaForm
interface TurmaFormProps {
    onFormSubmit: () => Promise<void> | void; // Chamado após adicionar ou editar
}

// Tipagem para as funções expostas pelo ref
export interface TurmaFormHandles {
    openDialog: (mode: 'add' | 'edit', turma?: Turma) => void;
}

const defaultFormData: TurmaFormData = {
    codigo: '',
    semestre: '',
    horario: '',
    id_sala: '',
    id_professor: '',
    id_disciplina: '',
    ativo: true,
};

const TurmaForm = forwardRef<TurmaFormHandles, TurmaFormProps>(({ onFormSubmit }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState<TurmaFormData>(defaultFormData);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [editingTurmaCodigo, setEditingTurmaCodigo] = useState<string | undefined>(undefined);

    useImperativeHandle(ref, () => ({
        openDialog: (currentMode: 'add' | 'edit', turma?: Turma) => {
            setMode(currentMode);
            if (currentMode === 'edit' && turma) {
                setFormData({
                    codigo: turma.codigo,
                    semestre: turma.semestre,
                    horario: turma.horario,
                    id_sala: String(turma.id_sala),
                    id_professor: String(turma.id_professor),
                    id_disciplina: String(turma.id_disciplina),
                    ativo: turma.ativo !== undefined ? turma.ativo : true,
                });
                setEditingTurmaCodigo(turma.id?.toString());
            } else {
                setFormData(defaultFormData);
                setEditingTurmaCodigo(undefined);
            }
            dialogRef.current?.showModal();
        }
    }));

    const closeDialog = () => {
        dialogRef.current?.close();
        setFormData(defaultFormData);
        setMode('add');
        setEditingTurmaCodigo(undefined);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            id_sala: Number(formData.id_sala),
            id_professor: Number(formData.id_professor),
            id_disciplina: Number(formData.id_disciplina),
        };

        try {
            if (mode === 'edit' && editingTurmaCodigo) {
                const response = await api.put(`/turmas/${editingTurmaCodigo}`, payload);
                console.log("Turma editada:", response.data);
                alert("Turma editada com sucesso!");
            } else {
                // Para adicionar, o 'codigo' não deve ser editável se for gerado pelo backend
                // ou deve ser validado para unicidade.
                // Se o código é parte do payload de criação:
                const response = await api.post("/turmas", payload);
                console.log("Turma adicionada:", response.data);
                alert("Turma adicionada com sucesso!");
            }
            closeDialog();
            await onFormSubmit();
        } catch (error: any) {
            console.error(`Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} turma:`, error);
            const errorMessage = error.response?.data?.error || `Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} turma. Verifique o console.`;
            alert(errorMessage);
        }
    };

    return (
        <dialog ref={dialogRef}>
            <h2>{mode === 'edit' ? 'Editar Turma' : 'Adicionar Nova Turma'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="codigo">Código:</label>
                    <input
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        required
                        // Se o código não puder ser editado após a criação:
                        // disabled={mode === 'edit'}
                    />
                </div>
                <div>
                    <label htmlFor="semestre">Semestre:</label>
                    <input
                        type="text"
                        id="semestre"
                        name="semestre"
                        value={formData.semestre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="horario">Horário:</label>
                    <input
                        type="text"
                        id="horario"
                        name="horario"
                        value={formData.horario}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="id_sala">ID da Sala:</label>
                    <input
                        type="number"
                        id="id_sala"
                        name="id_sala"
                        value={formData.id_sala}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="id_professor">ID do Professor:</label>
                    <input
                        type="number"
                        id="id_professor"
                        name="id_professor"
                        value={formData.id_professor}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="id_disciplina">ID da Disciplina:</label>
                    <input
                        type="number"
                        id="id_disciplina"
                        name="id_disciplina"
                        value={formData.id_disciplina}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* <div>
                    <label htmlFor="ativo">Ativo:</label>
                    <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={e => setFormData(prev => ({ ...prev, ativo: (e.target as HTMLInputElement).checked }))}
                    />
                </div> */}
                <button type="submit">{mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Turma'}</button>
                <button type="button" onClick={closeDialog} style={{ marginLeft: '10px' }}>Cancelar</button>
            </form>
        </dialog>
    );
});

export default TurmaForm;