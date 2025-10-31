import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { useAuth } from '../../../context/AuthContext';
import { 
  MdOutlineDashboard, 
  MdOutlineInventory2, 
  MdOutlineCategory, 
  MdOutlineSwapHoriz, 
  MdOutlineAssessment,
  MdOutlineLogout 
} from 'react-icons/md';
import logoBranca from '../../../assets/images/logo-oak-system-branca.png';

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <img src={logoBranca} alt="Oak System Logo" className={styles.sidebarLogo} />
        
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink to="/dashboard">
              <MdOutlineDashboard size={20} /> Dashboard
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/produtos">
              <MdOutlineInventory2 size={20} /> Produtos
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/categorias">
              <MdOutlineCategory size={20} /> Categorias
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/movimentacoes">
              <MdOutlineSwapHoriz size={20} /> Movimentações
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/relatorios">
              <MdOutlineAssessment size={20} /> Relatórios
            </NavLink>
          </li>
        </ul>
        
        <button className={styles.logoutButton} onClick={handleLogout}>
          <MdOutlineLogout size={20} /> Sair
        </button>
      </aside>
      
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;