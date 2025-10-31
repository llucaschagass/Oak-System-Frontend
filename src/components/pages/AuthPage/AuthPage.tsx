import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './AuthPage.module.css';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

import logoTransparente from '../../../assets/images/logo-oak-system-transparente.png';
import logoBranca from '../../../assets/images/logo-oak-system-branca.png';

const AuthPage = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estados para o formulário de Login
  const [signInUsuario, setSignInUsuario] = useState('');
  const [signInSenha, setSignInSenha] = useState('');

  // Estados para o formulário de Registro
  const [signUpNome, setSignUpNome] = useState('');
  const [signUpUsuario, setSignUpUsuario] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpTelefone, setSignUpTelefone] = useState('');
  const [signUpSenha, setSignUpSenha] = useState('');

  const containerClasses = `${styles.container} ${isSignUpActive ? styles.rightPanelActive : ''}`;

  const handleSignInSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post('/api/auth/login', {
        usuario: signInUsuario,
        senha: signInSenha,
      });
      const token = response.data.token;

      login(token);
      navigate('/dashboard');

    } catch (error) {
      console.error('Erro no login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Falha no login. Verifique seu usuário e senha.',
      });
    }
  };

  const handleSignUpSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post('/api/auth/register', {
        nome: signUpNome,
        usuario: signUpUsuario,
        email: signUpEmail,
        telefone: signUpTelefone,
        senha: signUpSenha,
      });
      const token = response.data.token;

      login(token);
      navigate('/dashboard');

    } catch (error) {
      console.error('Erro no registro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro no Registro',
        text: 'Não foi possível registrar o usuário. Verifique os dados.',
      });
    }
  };

  return (
    <div className={containerClasses} id="container">
      {/* --- Formulário de Registro --- */}
      <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
        <form onSubmit={handleSignUpSubmit}>
          <img src={logoTransparente} alt="Logo Oak System" className={styles.logo} />
          <h1>Criar Conta</h1>
          <input type="text" placeholder="Nome" value={signUpNome} onChange={e => setSignUpNome(e.target.value)} required />
          <input type="text" placeholder="Usuário" value={signUpUsuario} onChange={e => setSignUpUsuario(e.target.value)} required />
          <input type="email" placeholder="Email" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} required />
          <input type="tel" placeholder="Telefone" value={signUpTelefone} onChange={e => setSignUpTelefone(e.target.value)} />
          <input type="password" placeholder="Senha" value={signUpSenha} onChange={e => setSignUpSenha(e.target.value)} required />
          <button type="submit">Cadastrar</button>
        </form>
      </div>

      {/* --- Formulário de Login --- */}
      <div className={`${styles.formContainer} ${styles.signInContainer}`}>
        <form onSubmit={handleSignInSubmit}>
          <img src={logoTransparente} alt="Logo Oak System" className={styles.logo} />
          <h1>Entrar</h1>
          <input type="text" placeholder="Usuário" value={signInUsuario} onChange={e => setSignInUsuario(e.target.value)} required />
          <input type="password" placeholder="Senha" value={signInSenha} onChange={e => setSignInSenha(e.target.value)} required />
          <a href="#">Esqueceu sua senha?</a>
          <button type="submit">Entrar</button>
        </form>
      </div>

      <div className={styles.overlayContainer}>
        <div className={styles.overlay}>
          <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
            <img src={logoBranca} alt="Logo Oak System" className={styles.logo} />
            <h1>Bem-vindo de Volta!</h1>
            <p>Para se manter conectado conosco, por favor, entre com suas informações pessoais</p>
            <button className={styles.ghost} onClick={() => setIsSignUpActive(false)}>
              Entrar
            </button>
          </div>
          <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
            <img src={logoBranca} alt="Logo Oak System" className={styles.logo} />
            <h1>Olá, Amigo!</h1>
            <p>Insira seus dados pessoais e comece sua jornada conosco</p>
            <button className={styles.ghost} onClick={() => setIsSignUpActive(true)}>
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;