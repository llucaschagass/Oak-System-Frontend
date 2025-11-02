import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import ReactModal from 'react-modal';
import Swal from 'sweetalert2';
import styles from './CategoriasPage.module.css';
import api from '../../../services/api';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

ReactModal.setAppElement('#root');

interface Categoria {
  id: number;
  nome: string;
  tamanho: 'Pequeno' | 'Médio' | 'Grande';
  embalagem: 'Lata' | 'Vidro' | 'Plástico';
}

type CategoriaFormData = Omit<Categoria, 'id'>;

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoriaId, setCurrentCategoriaId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CategoriaFormData>({
    nome: '',
    tamanho: 'Médio',
    embalagem: 'Plástico',
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/api/categorias');
        setCategorias(response.data);
      } catch (err) {
        setError('Falha ao carregar as categorias.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const resetFormAndCloseModal = () => {
    setModalIsOpen(false);
    setIsEditing(false);
    setCurrentCategoriaId(null);
    setFormData({ nome: '', tamanho: 'Médio', embalagem: 'Plástico' });
  };
  
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ nome: '', tamanho: 'Médio', embalagem: 'Plástico' });
    setModalIsOpen(true);
  };

  const openEditModal = (categoria: Categoria) => {
    setIsEditing(true);
    setCurrentCategoriaId(categoria.id);
    setFormData({
      nome: categoria.nome,
      tamanho: categoria.tamanho,
      embalagem: categoria.embalagem,
    });
    setModalIsOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (isEditing) {
        const response = await api.put(`/api/categorias/${currentCategoriaId}`, formData);
        setCategorias(categorias.map(c => c.id === currentCategoriaId ? response.data : c));
        Swal.fire('Sucesso!', 'Categoria atualizada com sucesso.', 'success');
      } else {
        const response = await api.post('/api/categorias', formData);
        setCategorias([...categorias, response.data]);
        Swal.fire('Sucesso!', 'Categoria adicionada com sucesso.', 'success');
      }
      resetFormAndCloseModal();
    } catch (error) {
      Swal.fire('Erro!', `Não foi possível salvar a categoria.`, 'error');
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Isso pode afetar produtos existentes nesta categoria!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/categorias/${id}`);
          setCategorias(categorias.filter(c => c.id !== id));
          Swal.fire('Apagado!', 'A categoria foi apagada.', 'success');
        } catch (error) {
          Swal.fire('Erro!', 'Não foi possível apagar a categoria.', 'error');
        }
      }
    });
  };

  if (loading) return <div className={styles.pageContainer}><h1>Carregando...</h1></div>;
  if (error) return <div className={styles.pageContainer}><h1>{error}</h1></div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Gerenciar Categorias</h1>
        <button className={styles.addButton} onClick={openAddModal}>
          <MdAdd size={20} />
          Adicionar Categoria
        </button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tamanho</th>
              <th>Embalagem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.nome}</td>
                <td>{cat.tamanho}</td>
                <td>{cat.embalagem}</td>
                <td className={styles.actions}>
                  <button className={`${styles.iconButton} ${styles.editButton}`} onClick={() => openEditModal(cat)}>
                    <MdEdit size={20} />
                  </button>
                  <button className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => handleDelete(cat.id)}>
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={resetFormAndCloseModal}
        contentLabel={isEditing ? "Editar Categoria" : "Adicionar Categoria"}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 },
          content: {
            top: '50%', left: '50%', right: 'auto', bottom: 'auto',
            marginRight: '-50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: '500px',
            padding: '2rem', borderRadius: '8px', border: 'none'
          },
        }}
      >
        <form onSubmit={handleFormSubmit} className={styles.modalContent}>
          <h2>{isEditing ? "Editar Categoria" : "Adicionar Nova Categoria"}</h2>

          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="nome">Nome da Categoria</label>
              <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleFormChange} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tamanho">Tamanho</label>
              <select id="tamanho" name="tamanho" value={formData.tamanho} onChange={handleFormChange} required>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="embalagem">Embalagem</label>
              <select id="embalagem" name="embalagem" value={formData.embalagem} onChange={handleFormChange} required>
                <option value="Lata">Lata</option>
                <option value="Vidro">Vidro</option>
                <option value="Plástico">Plástico</option>
              </select>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={resetFormAndCloseModal}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Salvar</button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
};

export default CategoriasPage;