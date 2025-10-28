import CryptoJS from 'crypto-js';

// Chave secreta para criptografia (em produção, deve vir de variáveis de ambiente)
const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET || 'cartografia-social-2024-secret-key';

// Senha do admin definida no .env
const DEFAULT_ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'Política Social';

class AuthService {
  constructor() {
    // Gera um salt único para esta instância
    this.salt = CryptoJS.lib.WordArray.random(128/8).toString();
  }

  /**
   * Gera um hash da senha usando PBKDF2 com salt
   * @param {string} password - Senha em texto plano
   * @param {string} salt - Salt para a criptografia (opcional)
   * @returns {string} Hash da senha
   */
  hashPassword(password, salt = null) {
    const usedSalt = salt || this.salt;
    return CryptoJS.PBKDF2(password, usedSalt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
  }

  /**
   * Verifica se a senha fornecida corresponde ao hash armazenado
   * @param {string} password - Senha em texto plano
   * @param {string} hashedPassword - Hash armazenado
   * @param {string} salt - Salt usado na criptografia
   * @returns {boolean} True se a senha estiver correta
   */
  verifyPassword(password, hashedPassword, salt) {
    const hashToVerify = this.hashPassword(password, salt);
    return hashToVerify === hashedPassword;
  }

  /**
   * Gera credenciais padrão do admin (hash + salt)
   * @returns {object} Objeto com hash e salt
   */
  generateDefaultAdminCredentials() {
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const hashedPassword = this.hashPassword(DEFAULT_ADMIN_PASSWORD, salt);
    
    return {
      hash: hashedPassword,
      salt: salt,
      password: DEFAULT_ADMIN_PASSWORD // Apenas para referência, não deve ser armazenado
    };
  }

  /**
   * Autentica o usuário admin
   * @param {string} enteredPassword - Senha digitada pelo usuário
   * @returns {boolean} True se a autenticação for bem-sucedida
   */
  authenticateAdmin(enteredPassword) {
    // Em um sistema real, você buscaria o hash e salt do banco de dados
    // Por enquanto, vamos usar credenciais padrão
    const adminCredentials = this.getStoredAdminCredentials();
    
    if (!adminCredentials) {
      // Se não há credenciais armazenadas, cria as padrão
      const newCredentials = this.generateDefaultAdminCredentials();
      this.storeAdminCredentials(newCredentials);
      return this.verifyPassword(enteredPassword, newCredentials.hash, newCredentials.salt);
    }
    
    return this.verifyPassword(enteredPassword, adminCredentials.hash, adminCredentials.salt);
  }

  /**
   * Armazena as credenciais do admin no localStorage
   * @param {object} credentials - Objeto com hash e salt
   */
  storeAdminCredentials(credentials) {
    const credentialsToStore = {
      hash: credentials.hash,
      salt: credentials.salt,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('admin_credentials', JSON.stringify(credentialsToStore));
  }

  /**
   * Recupera as credenciais do admin do localStorage
   * @returns {object|null} Credenciais ou null se não existirem
   */
  getStoredAdminCredentials() {
    try {
      const stored = localStorage.getItem('admin_credentials');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erro ao recuperar credenciais:', error);
      return null;
    }
  }

  /**
   * Altera a senha do admin
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @returns {boolean} True se a alteração foi bem-sucedida
   */
  changeAdminPassword(currentPassword, newPassword) {
    const currentCredentials = this.getStoredAdminCredentials();
    
    if (!currentCredentials) {
      return false;
    }
    
    // Verifica se a senha atual está correta
    if (!this.verifyPassword(currentPassword, currentCredentials.hash, currentCredentials.salt)) {
      return false;
    }
    
    // Gera novas credenciais com a nova senha
    const newCredentials = {
      hash: this.hashPassword(newPassword),
      salt: this.salt,
      createdAt: new Date().toISOString()
    };
    
    this.storeAdminCredentials(newCredentials);
    return true;
  }

  /**
   * Limpa as credenciais armazenadas (logout)
   */
  clearCredentials() {
    localStorage.removeItem('admin_credentials');
  }

  /**
   * Verifica se há credenciais armazenadas
   * @returns {boolean} True se há credenciais válidas
   */
  hasStoredCredentials() {
    const credentials = this.getStoredAdminCredentials();
    return credentials && credentials.hash && credentials.salt;
  }
}

// Exporta uma instância singleton
export default new AuthService();