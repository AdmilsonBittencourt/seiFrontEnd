import { useRef, useState, type FormEvent } from 'react';
import api from '../api/axios';

interface ProfessorFormData {
    nome: string;
    email: string;
    telefone: string;
    CPF: string;
    departamento: string;
    ativo: boolean;
}

interface ProfessorFormProps {
    onProfessorAdded: () => Promise<void> | void;
}

export default function ProfessorForm({ onProfessorAdded }: ProfessorFormProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState<ProfessorFormData>({
        nome: '',
        email: '',
        telefone: '',
        CPF: '',
        departamento: '',
        ativo: true,
    });

    const openDialog = () => {
        // Reset form data when opening for a new entry, in case it was somehow pre-filled
        setFormData({
            nome: '',
            email: '',
            telefone: '',
            CPF: '',
            departamento: '',
            ativo: true,
        });
        dialogRef.current?.showModal();
    };

    const closeDialog = () => {
        dialogRef.current?.close();
        // Limpar o formulário ao fechar
        setFormData({
            nome: '',
            email: '',
            telefone: '',
            CPF: '',
            departamento: '',
            ativo: true,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevenir o comportamento padrão do formulário
        try {
            const response = await api.post("/professores", formData);
            console.log("Professor adicionado:", response.data);
            alert("Professor adicionado com sucesso!");
            closeDialog();
            await onProfessorAdded(); // Chamar a função passada via props para atualizar a lista
        } catch (error) {
            console.error("Erro ao adicionar professor:", error);
            alert("Erro ao adicionar professor. Verifique o console para mais detalhes.");
        }
    };

    return (
        <div>
            <button onClick={openDialog}>
                Adicionar Novo Professor
            </button>
            <dialog ref={dialogRef}>
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
                    <button type="submit">Enviar</button>
                </form>
                <button onClick={closeDialog} style={{ marginTop: '10px' }}>Fechar</button>
            </dialog>
        </div>
    );
}
