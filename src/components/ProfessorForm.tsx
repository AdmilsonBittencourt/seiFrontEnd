import { useRef, useState, type FormEvent, useImperativeHandle, forwardRef } from 'react';
import api from '../api/axios';
import type { Professor } from '../types/interfaceProfessor'; // Supondo que você tenha essa tipagem

// Interface para os dados do formulário
interface ProfessorFormData {
    nome: string;
    email: string;
    telefone: string;
    CPF: string;
    departamento: string;
    ativo: boolean;
}

// Props do ProfessorForm
interface ProfessorFormProps {
    onFormSubmit: () => Promise<void> | void; // Chamado após adicionar ou editar
}

// Tipagem para as funções expostas pelo ref
export interface ProfessorFormHandles {
    openDialog: (mode: 'add' | 'edit', professor?: Professor) => void;
}

const defaultFormData: ProfessorFormData = {
    nome: '',
    email: '',
    telefone: '',
    CPF: '',
    departamento: '',
    ativo: true,
};

const ProfessorForm = forwardRef<ProfessorFormHandles, ProfessorFormProps>(({ onFormSubmit }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState<ProfessorFormData>(defaultFormData);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [editingProfessorId, setEditingProfessorId] = useState<string | number | undefined>(undefined);

    useImperativeHandle(ref, () => ({
        openDialog: (currentMode: 'add' | 'edit', professor?: Professor) => {
            setMode(currentMode);
            if (currentMode === 'edit' && professor) {
                setFormData({
                    nome: professor.nome,
                    email: professor.email,
                    telefone: professor.telefone,
                    CPF: professor.CPF,
                    departamento: professor.departamento,
                    ativo: professor.ativo !== undefined ? professor.ativo : true,
                });
                setEditingProfessorId(professor.id);
            } else {
                setFormData(defaultFormData);
                setEditingProfessorId(undefined);
            }
            dialogRef.current?.showModal();
        }
    }));

    const closeDialog = () => {
        dialogRef.current?.close();
        // Resetar o formulário para o estado padrão ao fechar
        setFormData(defaultFormData);
        setMode('add');
        setEditingProfessorId(undefined);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (mode === 'edit' && editingProfessorId) {
                const response = await api.put(`/professores/${editingProfessorId}`, formData);
                console.log("Professor editado:", response.data);
                alert("Professor editado com sucesso!");
            } else {
                const response = await api.post("/professores", formData);
                console.log("Professor adicionado:", response.data);
                alert("Professor adicionado com sucesso!");
            }
            closeDialog();
            await onFormSubmit();
        } catch (error: any) { // Adicionado ': any' para acessar error.response
            console.error(`Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} professor:`, error);
            // Verifica se a resposta de erro e a mensagem específica existem
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : `Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} professor. Verifique o console.`;
            alert(errorMessage);
        }
    };

    return (
        <dialog ref={dialogRef}>
            <h2>{mode === 'edit' ? 'Editar Professor' : 'Adicionar Novo Professor'}</h2>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="telefone">Telefone:</label>
                    <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cpf">CPF:</label>
                    <input
                        type="text"
                        id="cpf"
                        name="CPF"
                        value={formData.CPF}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="departamento">Departamento:</label>
                    <input
                        type="text"
                        id="departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Campo Ativo (opcional, dependendo se você quer editar isso no formulário) */}
                {/* <div>
                    <label htmlFor="ativo">Ativo:</label>
                    <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={e => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                    />
                </div> */}
                <button type="submit">{mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Professor'}</button>
                <button type="button" onClick={closeDialog} style={{ marginLeft: '10px' }}>Cancelar</button>
            </form>
        </dialog>
    );
});

export default ProfessorForm;
