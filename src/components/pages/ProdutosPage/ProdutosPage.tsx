import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import ReactModal from 'react-modal';
import Swal from 'sweetalert2';
import styles from './ProdutosPage.module.css';
import api from '../../../services/api';

ReactModal.setAppElement('#root');

interface Categoria {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  precoUnitario: number;
  unidade: string;
  quantidadeEmEstoque: number;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  categoria: Categoria;
}

type ProdutoFormData = Omit<Produto, 'id' | 'categoria'> & {
  categoriaId: string;
};


const ProdutosPage = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProdutoId, setCurrentProdutoId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ProdutoFormData>({
    nome: '',
    precoUnitario: 0,
    unidade: '',
    quantidadeEmEstoque: 0,
    quantidadeMinima: 0,
    quantidadeMaxima: 0,
    categoriaId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produtosResponse, categoriasResponse] = await Promise.all([
          api.get('/api/produtos'),
          api.get('/api/categorias')
        ]);
        setProdutos(produtosResponse.data);
        setCategorias(categoriasResponse.data);
      } catch (err) {
        setError('Falha ao carregar os dados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetFormAndCloseModal = () => {
    setModalIsOpen(false);
    setIsEditing(false);
    setCurrentProdutoId(null);
    setFormData({
      nome: '', precoUnitario: 0, unidade: '', quantidadeEmEstoque: 0,
      quantidadeMinima: 0, quantidadeMaxima: 0, categoriaId: '',
    });
  };
  
  const openAddModal = () => {
    setIsEditing(false);
    setModalIsOpen(true);
  };

  const openEditModal = (produto: Produto) => {
    setIsEditing(true);
    setCurrentProdutoId(produto.id);
    setFormData({
      nome: produto.nome,
      precoUnitario: produto.precoUnitario,
      unidade: produto.unidade,
      quantidadeEmEstoque: produto.quantidadeEmEstoque,
      quantidadeMinima: produto.quantidadeMinima,
      quantidadeMaxima: produto.quantidadeMaxima,
      categoriaId: String(produto.categoria.id),
    });
    setModalIsOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const productPayload = {
      ...formData,
      precoUnitario: parseFloat(String(formData.precoUnitario)),
      quantidadeEmEstoque: parseInt(String(formData.quantidadeEmEstoque), 10),
      quantidadeMinima: parseInt(String(formData.quantidadeMinima), 10),
      quantidadeMaxima: parseInt(String(formData.quantidadeMaxima), 10),
      categoria: { id: parseInt(formData.categoriaId, 10) },
    };

    try {
      if (isEditing) {
        const response = await api.put(`/api/produtos/${currentProdutoId}`, productPayload);
        setProdutos(produtos.map(p => p.id === currentProdutoId ? response.data : p));
        Swal.fire('Sucesso!', 'Produto atualizado com sucesso.', 'success');
      } else {
        const response = await api.post('/api/produtos', productPayload);
        setProdutos([...produtos, response.data]);
        Swal.fire('Sucesso!', 'Produto adicionado com sucesso.', 'success');
      }
      resetFormAndCloseModal();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Swal.fire('Erro!', `Não foi possível ${isEditing ? 'atualizar' : 'adicionar'} o produto.`, 'error');
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/produtos/${id}`);
          setProdutos(produtos.filter(p => p.id !== id));
          Swal.fire('Apagado!', 'O produto foi apagado com sucesso.', 'success');
        } catch (error) {
          console.error('Erro ao apagar produto:', error);
          Swal.fire('Erro!', 'Não foi possível apagar o produto.', 'error');
        }
      }
    });
  };


  if (loading) return <div className={styles.produtosContainer}><h1>Carregando...</h1></div>;
  if (error) return <div className={styles.produtosContainer}><h1>{error}</h1></div>;

  return (
    <div className={styles.produtosContainer}>
      <header className={styles.header}>
        <h1>Gerenciar Produtos</h1>
        <button className={styles.addButton} onClick={openAddModal}>+ Adicionar Produto</button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço Unitário</th>
              <th>Qtd. em Estoque</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>R$ {produto.precoUnitario.toFixed(2)}</td>
                <td>{produto.quantidadeEmEstoque}</td>
                <td>{produto.categoria.nome}</td>
                <td className={styles.actions}>
                  <a onClick={() => openEditModal(produto)}>Editar</a>
                  <a onClick={() => handleDelete(produto.id)} className={styles.deleteLink}>Excluir</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={resetFormAndCloseModal}
        contentLabel={isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
        style={{}}
      >
        <form onSubmit={handleFormSubmit} className={styles.modalContent}>
          <h2>{isEditing ? "Editar Produto" : "Adicionar Novo Produto"}</h2>
          <input name="nome" type="text" placeholder="Nome do Produto" value={formData.nome} onChange={handleFormChange} required />
          <input name="precoUnitario" type="number" placeholder="Preço Unitário" value={formData.precoUnitario} onChange={handleFormChange} required />
          <input name="unidade" type="text" placeholder="Unidade (ex: Kg, Un)" value={formData.unidade} onChange={handleFormChange} required />
          <input name="quantidadeEmEstoque" type="number" placeholder="Qtd. em Estoque" value={formData.quantidadeEmEstoque} onChange={handleFormChange} required />
          <input name="quantidadeMinima" type="number" placeholder="Qtd. Mínima" value={formData.quantidadeMinima} onChange={handleFormChange} required />
          <input name="quantidadeMaxima" type="number" placeholder="Qtd. Máxima" value={formData.quantidadeMaxima} onChange={handleFormChange} required />
          <select name="categoriaId" value={formData.categoriaId} onChange={handleFormChange} required>
            <option value="">Selecione uma Categoria</option>
            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
          </select>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={resetFormAndCloseModal}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Salvar</button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
};

export default ProdutosPage;