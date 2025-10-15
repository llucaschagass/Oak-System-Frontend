import React from 'react';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  // Usando dados estáticos para montar a interface.
  // No futuro, esses dados virão da API.
  const kpiData = {
    totalProdutos: 152,
    valorTotalEstoque: "R$ 15.780,50",
    produtosAbaixoMinimo: 12,
    ultimasMovimentacoes: 34
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Bem-vindo ao seu painel de controle de estoque, Usuário!</p>
      </header>

      <main>
        <div className={styles.kpiGrid}>
          {/* Card 1: Total de Produtos */}
          <div className={styles.kpiCard}>
            <span className={styles.cardIcon}>📦</span>
            <div>
              <div className={styles.cardTitle}>Produtos Cadastrados</div>
              <div className={styles.cardValue}>{kpiData.totalProdutos}</div>
            </div>
          </div>
          
          {/* Card 2: Valor do Estoque */}
          <div className={styles.kpiCard}>
            <span className={styles.cardIcon}>💰</span>
            <div>
              <div className={styles.cardTitle}>Valor Total do Estoque</div>
              <div className={styles.cardValue}>{kpiData.valorTotalEstoque}</div>
            </div>
          </div>

          {/* Card 3: Produtos em Alerta */}
          <div className={styles.kpiCard}>
            <span className={styles.cardIcon}>⚠️</span>
            <div>
              <div className={styles.cardTitle}>Produtos Abaixo do Mínimo</div>
              <div className={styles.cardValue}>{kpiData.produtosAbaixoMinimo}</div>
            </div>
          </div>
          
          {/* Card 4: Movimentações do Dia */}
          <div className={styles.kpiCard}>
            <span className={styles.cardIcon}>📊</span>
            <div>
              <div className={styles.cardTitle}>Movimentações (Hoje)</div>
              <div className={styles.cardValue}>{kpiData.ultimasMovimentacoes}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;