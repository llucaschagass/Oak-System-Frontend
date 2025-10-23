import React, { useState, useEffect } from 'react';
import styles from './RelatoriosPage.module.css';
import api from '../../../services/api';

// Interfaces para os DTOs dos relatórios
interface ListaPrecoDTO {
  nomeProduto: string;
  precoUnitario: number;
  unidade: string;
  nomeCategoria: string;
}

interface BalancoItemDTO {
  nomeProduto: string;
  quantidadeEmEstoque: number;
  valorTotalProduto: number;
}

interface BalancoGeralDTO {
  valorTotalEstoque: number;
  itens: BalancoItemDTO[];
}

interface ProdutoAbaixoMinimoDTO {
  nomeProduto: string;
  quantidadeMinima: number;
  quantidadeEmEstoque: number;
}

interface ProdutosPorCategoriaDTO {
  nomeCategoria: string;
  quantidadeProdutos: number;
}

interface ProdutoMovimentacaoDTO {
  nomeProduto: string;
  totalMovimentado: number;
}

interface RelatorioMovimentacaoDTO {
  produtoComMaisSaidas: ProdutoMovimentacaoDTO | null;
  produtoComMaisEntradas: ProdutoMovimentacaoDTO | null;
}

const RelatoriosPage = () => {
  // Estados para cada relatório
  const [listaPrecos, setListaPrecos] = useState<ListaPrecoDTO[]>([]);
  const [balancoGeral, setBalancoGeral] = useState<BalancoGeralDTO | null>(null);
  const [abaixoMinimo, setAbaixoMinimo] = useState<ProdutoAbaixoMinimoDTO[]>([]);
  const [porCategoria, setPorCategoria] = useState<ProdutosPorCategoriaDTO[]>([]);
  const [maioresMovs, setMaioresMovs] = useState<RelatorioMovimentacaoDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatorios = async () => {
      setLoading(true);
      setError(null);
      try {
        // Busca todos os relatórios em paralelo
        const responses = await Promise.all([
          api.get('/api/relatorios/lista-de-precos'),
          api.get('/api/relatorios/balanco-financeiro'),
          api.get('/api/relatorios/produtos-abaixo-minimo'),
          api.get('/api/relatorios/produtos-por-categoria'),
          api.get('/api/relatorios/maiores-movimentacoes')
        ]);

        setListaPrecos(responses[0].data);
        setBalancoGeral(responses[1].data);
        setAbaixoMinimo(responses[2].data);
        setPorCategoria(responses[3].data);
        setMaioresMovs(responses[4].data);

      } catch (err) {
        setError('Falha ao carregar os relatórios.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, []);

  if (loading) return <div className={styles.pageContainer}><h1>Carregando relatórios...</h1></div>;
  if (error) return <div className={styles.pageContainer}><h1>{error}</h1></div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Relatórios</h1>
      </header>

      {/* Seção Lista de Preços */}
      <section className={styles.reportSection}>
        <h2>Lista de Preços</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr><th>Produto</th><th>Preço</th><th>Unidade</th><th>Categoria</th></tr>
          </thead>
          <tbody>
            {listaPrecos.map((item, index) => (
              <tr key={index}><td>{item.nomeProduto}</td><td>R$ {item.precoUnitario.toFixed(2)}</td><td>{item.unidade}</td><td>{item.nomeCategoria}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Seção Balanço Físico/Financeiro */}
      <section className={styles.reportSection}>
        <h2>Balanço Físico/Financeiro</h2>
        {balancoGeral && (
          <>
            <table className={styles.dataTable}>
              <thead>
                <tr><th>Produto</th><th>Qtd. Estoque</th><th>Valor Total</th></tr>
              </thead>
              <tbody>
                {balancoGeral.itens.map((item, index) => (
                  <tr key={index}><td>{item.nomeProduto}</td><td>{item.quantidadeEmEstoque}</td><td>R$ {item.valorTotalProduto.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
            <div className={styles.totalValue}>
              Valor Total do Estoque: R$ {balancoGeral.valorTotalEstoque.toFixed(2)}
            </div>
          </>
        )}
      </section>

      {/* Seção Produtos Abaixo do Mínimo */}
      <section className={styles.reportSection}>
        <h2>Produtos Abaixo do Mínimo</h2>
        {abaixoMinimo.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr><th>Produto</th><th>Qtd. Mínima</th><th>Qtd. Atual</th></tr>
            </thead>
            <tbody>
              {abaixoMinimo.map((item, index) => (
                <tr key={index}><td>{item.nomeProduto}</td><td>{item.quantidadeMinima}</td><td>{item.quantidadeEmEstoque}</td></tr>
              ))}
            </tbody>
          </table>
        ) : <p>Nenhum produto abaixo do estoque mínimo.</p>}
      </section>

      {/* Seção Produtos por Categoria */}
      <section className={styles.reportSection}>
        <h2>Produtos por Categoria</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr><th>Categoria</th><th>Quantidade de Produtos</th></tr>
          </thead>
          <tbody>
            {porCategoria.map((item, index) => (
              <tr key={index}><td>{item.nomeCategoria}</td><td>{item.quantidadeProdutos}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Seção Maiores Movimentações */}
      <section className={styles.reportSection}>
        <h2>Maiores Movimentações</h2>
        {maioresMovs && (
          <div className={styles.championContainer}>
            <div className={styles.championCard}>
              <h3>Produto com Mais Entradas</h3>
              {maioresMovs.produtoComMaisEntradas ? (
                <span>{maioresMovs.produtoComMaisEntradas.nomeProduto} ({maioresMovs.produtoComMaisEntradas.totalMovimentado})</span>
              ) : <span>Nenhuma entrada registrada.</span>}
            </div>
            <div className={styles.championCard}>
              <h3>Produto com Mais Saídas</h3>
              {maioresMovs.produtoComMaisSaidas ? (
                <span>{maioresMovs.produtoComMaisSaidas.nomeProduto} ({maioresMovs.produtoComMaisSaidas.totalMovimentado})</span>
              ) : <span>Nenhuma saída registrada.</span>}
            </div>
          </div>
        )}
      </section>

    </div>
  );
};

export default RelatoriosPage;