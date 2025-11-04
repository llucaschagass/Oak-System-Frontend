import React, { useState, useEffect } from 'react';
import styles from './RelatoriosPage.module.css';
import api from '../../../services/api';
// Importamos os ícones para os cards
import { MdOutlineArrowUpward, MdOutlineArrowDownward } from 'react-icons/md';

// Interfaces (sem alteração)
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) return <div className={styles.pageContainer}><h1>Carregando relatórios...</h1></div>;
  if (error) return <div className={styles.pageContainer}><h1>{error}</h1></div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Relatórios</h1>
      </header>

      {/* Seção Maiores Movimentações */}
      <section className={styles.reportSection}>
        <h2>Visão Geral das Movimentações</h2>
        {maioresMovs && (
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', color: '#27ae60' }}>
                <MdOutlineArrowUpward size={28} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>Produto com Mais Entradas</div>
                {maioresMovs.produtoComMaisEntradas ? (
                  <div className={styles.cardValue}>
                    {maioresMovs.produtoComMaisEntradas.nomeProduto}
                    <span> ({maioresMovs.produtoComMaisEntradas.totalMovimentado})</span>
                  </div>
                ) : <div className={styles.cardValue}>-</div>}
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}>
                <MdOutlineArrowDownward size={28} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>Produto com Mais Saídas</div>
                {maioresMovs.produtoComMaisSaidas ? (
                  <div className={styles.cardValue}>
                    {maioresMovs.produtoComMaisSaidas.nomeProduto}
                    <span> ({maioresMovs.produtoComMaisSaidas.totalMovimentado})</span>
                  </div>
                ) : <div className={styles.cardValue}>-</div>}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Seção Balanço Físico/Financeiro */}
      <section className={styles.reportSection}>
        <h2>Balanço Físico/Financeiro</h2>
        {balancoGeral && (
          <>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th className={styles.textRight}>Qtd. Estoque</th>
                  <th className={styles.textRight}>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {balancoGeral.itens.map((item) => (
                  <tr key={item.nomeProduto}>
                    <td>{item.nomeProduto}</td>
                    <td className={styles.textRight}>{item.quantidadeEmEstoque}</td>
                    <td className={styles.textRight}>{formatCurrency(item.valorTotalProduto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.totalValue}>
              Valor Total do Estoque: {formatCurrency(balancoGeral.valorTotalEstoque)}
            </div>
          </>
        )}
      </section>

      <div className={styles.reportGrid}>
        {/* Seção Produtos Abaixo do Mínimo */}
        <section className={styles.reportSection}>
          <h2>Produtos Abaixo do Mínimo</h2>
          {abaixoMinimo.length > 0 ? (
            <table className={styles.dataTable}>
              <thead>
                <tr><th>Produto</th><th className={styles.textRight}>Mín.</th><th className={styles.textRight}>Atual</th></tr>
              </thead>
              <tbody>
                {abaixoMinimo.map((item) => (
                  <tr key={item.nomeProduto}>
                    <td>{item.nomeProduto}</td>
                    <td className={styles.textRight}>{item.quantidadeMinima}</td>
                    <td className={styles.textRight}>{item.quantidadeEmEstoque}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className={styles.noData}>Nenhum produto abaixo do estoque mínimo.</p>}
        </section>

        {/* Seção Produtos por Categoria */}
        <section className={styles.reportSection}>
          <h2>Produtos por Categoria</h2>
          <table className={styles.dataTable}>
            <thead>
              <tr><th>Categoria</th><th className={styles.textRight}>Qtd. Produtos</th></tr>
            </thead>
            <tbody>
              {porCategoria.map((item) => (
                <tr key={item.nomeCategoria}>
                  <td>{item.nomeCategoria}</td>
                  <td className={styles.textRight}>{item.quantidadeProdutos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Seção Lista de Preços */}
      <section className={styles.reportSection}>
        <h2>Lista de Preços Completa</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Produto</th>
              <th className={styles.textRight}>Preço</th>
              <th>Unidade</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {listaPrecos.map((item) => (
              <tr key={item.nomeProduto}>
                <td>{item.nomeProduto}</td>
                <td className={styles.textRight}>{formatCurrency(item.precoUnitario)}</td>
                <td>{item.unidade}</td>
                <td>{item.nomeCategoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
};

export default RelatoriosPage;