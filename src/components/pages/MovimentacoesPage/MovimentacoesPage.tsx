import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import ReactModal from 'react-modal';
import Swal from 'sweetalert2';
import styles from './MovimentacoesPage.module.css';
import api from '../../../services/api';
import { MdAdd } from 'react-icons/md';

ReactModal.setAppElement('#root');

interface Produto {
  id: number;
  nome: string;
}

interface Movimentacao {
  id: number;
  produto: Produto;
  dataMovimentacao: string;
  quantidadeMovimentada: number;
  tipoMovimentacao: 'ENTRADA' | 'SAIDA';
}

interface MovimentacaoFormData {
  produtoId: string;
  quantidadeMovimentada: number;
  tipoMovimentacao: 'ENTRADA' | 'SAIDA';
}

const MovimentacoesPage = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState<MovimentacaoFormData>({
    produtoId: '',
    quantidadeMovimentada: 1,
    tipoMovimentacao: 'ENTRADA',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movResponse, prodResponse] = await Promise.all([
          api.get('/api/movimentacoes'),
          api.get('/api/produtos')
        ]);
        setMovimentacoes(movResponse.data);
        setProdutos(prodResponse.data);
      } catch (err) {
        setError('Falha ao carregar os dados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = () => {
    setFormData({ produtoId: '', quantidadeMovimentada: 1, tipoMovimentacao: 'ENTRADA' });
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData.produtoId) {
        Swal.fire('Atenção', 'Selecione um produto.', 'warning');
        return;
    }
    const payload = {
        produto: { id: parseInt(formData.produtoId, 10) },
        quantidadeMovimentada: parseInt(String(formData.quantidadeMovimentada), 10),
        tipoMovimentacao: formData.tipoMovimentacao
    };

    try {
        const response = await api.post('/api/movimentacoes', payload);
        setMovimentacoes([response.data, ...movimentacoes]);
        closeModal();
        Swal.fire('Sucesso!', 'Movimentação registrada com sucesso.', 'success');
    } catch (error: any) {
        console.error('Erro ao registrar movimentação:', error);
        const errorMessage = error.response?.data?.message || 'Não foi possível registrar a movimentação.';
        Swal.fire('Erro!', errorMessage, 'error');
    }
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleString('pt-BR', options);
    } catch (e) {
      return isoString;
    }
  };

  if (loading) return <div className={styles.pageContainer}><h1>Carregando...</h1></div>;
  if (error) return <div className={styles.pageContainer}><h1>{error}</h1></div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Movimentações de Estoque</h1>
        <button className={styles.addButton} onClick={openModal}>
          <MdAdd size={20} />
          Registrar Movimentação
        </button>
      </header>

      <div className={styles.tableContainer}>
        <h2>Histórico</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th className={styles.textRight}>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((mov) => (
              <tr key={mov.id}>
                <td>{formatDateTime(mov.dataMovimentacao)}</td>
                <td>{mov.produto.nome}</td>
                <td className={mov.tipoMovimentacao === 'ENTRADA' ? styles.tipoEntrada : styles.tipoSaida}>
                  {mov.tipoMovimentacao}
                </td>
                <td className={styles.textRight}>{mov.quantidadeMovimentada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Registrar Nova Movimentação"
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
          <h2>Registrar Nova Movimentação</h2>
          
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="produtoId">Produto</label>
              <select id="produtoId" name="produtoId" value={formData.produtoId} onChange={handleFormChange} required>
                <option value="">Selecione um Produto...</option>
                {produtos.map(prod => (
                  <option key={prod.id} value={prod.id}>{prod.nome}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="quantidadeMovimentada">Quantidade</label>
              <input id="quantidadeMovimentada" name="quantidadeMovimentada" type="number" min="1" value={formData.quantidadeMovimentada} onChange={handleFormChange} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tipoMovimentacao">Tipo de Movimentação</label>
              <select id="tipoMovimentacao" name="tipoMovimentacao" value={formData.tipoMovimentacao} onChange={handleFormChange} required>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
            </div>
          </div>
          
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={closeModal}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Registrar</button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
};

export default MovimentacoesPage;