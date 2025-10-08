import React, { useState } from 'react';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const containerClasses = `${styles.container} ${isSignUpActive ? styles.rightPanelActive : ''}`;

  return (
    <div className={containerClasses} id="container">
      <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
        <form action="#">
          <h1>Criar Conta</h1>
          <input type="text" placeholder="Nome" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
          <button>Cadastrar</button>
        </form>
      </div>

      <div className={`${styles.formContainer} ${styles.signInContainer}`}>
        <form action="#">
          <h1>Entrar</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
          <a href="#">Esqueceu sua senha?</a>
          <button>Entrar</button>
        </form>
      </div>

      <div className={styles.overlayContainer}>
        <div className={styles.overlay}>
          <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
            <h1>Bem-vindo de Volta!</h1>
            <p>Para se manter conectado conosco, por favor, entre com suas informações pessoais</p>
            <button className={styles.ghost} onClick={() => setIsSignUpActive(false)}>
              Entrar
            </button>
          </div>
          <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
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