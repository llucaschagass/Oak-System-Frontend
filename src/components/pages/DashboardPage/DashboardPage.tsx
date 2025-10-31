import { useState, useEffect } from 'react';
import styles from './DashboardPage.module.css';
import api from '../../../services/api';

import { 
  MdOutlineInventory2, 
  MdOutlineMonetizationOn, 
  MdOutlineWarningAmber, 
  MdOutlineSwapHoriz 
} from 'react-icons/md';

interface KpiData {
  totalProdutos: number;
  valorTotalEstoque: string;
  produtosAbaixoMinimo: number;
  totalMovimentacoes: number;
}

interface BalancoGeralDTO { valorTotalEstoque: number; itens: any[] }
interface ProdutoAbaixoMinimoDTO { nomeProduto: string; }
interface ProdutosPorCategoriaDTO { nomeCategoria: string; quantidadeProdutos: number; }
interface Movimentacao { id: number; }

const DashboardPage = () => {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          balancoRes,
          abaixoMinimoRes,
          porCategoriaRes,
          movimentacoesRes
        ] = await Promise.all([
          api.get<BalancoGeralDTO>('/api/relatorios/balanco-financeiro'),
          api.get<ProdutoAbaixoMinimoDTO[]>('/api/relatorios/produtos-abaixo-minimo'),
          api.get<ProdutosPorCategoriaDTO[]>('/api/relatorios/produtos-por-categoria'),
          api.get<Movimentacao[]>('/api/movimentacoes')
        ]);

        const valorTotal = formatCurrency(balancoRes.data.valorTotalEstoque);
        const totalAbaixoMinimo = abaixoMinimoRes.data.length;
        const totalMovimentacoes = movimentacoesRes.data.length;
        
        const totalProdutos = porCategoriaRes.data.reduce(
          (acc, categoria) => acc + categoria.quantidadeProdutos, 0
        );

        setKpiData({
          totalProdutos: totalProdutos,
          valorTotalEstoque: valorTotal,
          produtosAbaixoMinimo: totalAbaixoMinimo,
          totalMovimentacoes: totalMovimentacoes,
        });

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Bem-vindo ao seu painel de controle de estoque!</p>
      </header>

      <main>
        {loading && <div className={styles.loading}>Carregando dados...</div>}
        {error && <div className={styles.error}>{error}</div>}
        
        {kpiData && (
          <div className={styles.kpiGrid}>
            {/* Card 1: Total de Produtos */}
            <div className={styles.kpiCard}>
              <div className={styles.cardIconWrapper}>
                <MdOutlineInventory2 size={28} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>Produtos Cadastrados</div>
                <div className={styles.cardValue}>{kpiData.totalProdutos}</div>
              </div>
            </div>
            
            {/* Card 2: Valor do Estoque */}
            <div className={styles.kpiCard}>
              <div className={styles.cardIconWrapper}>
                <MdOutlineMonetizationOn size={28} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>Valor Total do Estoque</div>
                <div className={styles.cardValue}>{kpiData.valorTotalEstoque}</div>
              </div>
            </div>

            {/* Card 3: Produtos em Alerta */}
            <div className={styles.kpiCard}>
              <div className={styles.cardIconWrapper}>
                <MdOutlineWarningAmber size={28} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>Produtos Abaixo do Mínimo</div>
                <div className={styles.cardValue}>{kpiData.produtosAbaixoMinimo}</div>
              </div>
            </div>
            
            {/* Card 4: Total de Movimentações */}
            <div className={styles.kpiCard}>
              <div className={styles.cardIconWrapper}>
                <MdOutlineSwapHoriz size={28} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>Total de Movimentações</div>
                <div className={styles.cardValue}>{kpiData.totalMovimentacoes}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;