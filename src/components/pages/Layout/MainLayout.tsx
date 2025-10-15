import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <h2>Oak System</h2>
        <ul className={styles.navList}>
          <li className={styles.navItem}><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li className={styles.navItem}><NavLink to="/produtos">Produtos</NavLink></li>
          <li className={styles.navItem}><NavLink to="/categorias">Categorias</NavLink></li>
          <li className={styles.navItem}><NavLink to="/movimentacoes">Movimentações</NavLink></li>
          <li className={styles.navItem}><NavLink to="/relatorios">Relatórios</NavLink></li>
        </ul>
        <button className={styles.logoutButton} onClick={handleLogout}>Sair</button>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;