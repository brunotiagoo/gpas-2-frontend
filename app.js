// GPAS 2.0 - Frontend JavaScript CORRIGIDO PARA LOGIN
// Configuração da API - ATUALIZAR COM O TEU URL DO BACKEND
const API_BASE_URL = 'https://gpas-2-backend.onrender.com/api'; // SUBSTITUI PELO TEU URL

// Estado da aplicação
let currentUser = null;
let isLoggedIn = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 GPAS 2.0 Inicializado');
    initializeApp();
    setupEventListeners();
    
    // Remove loading screen após 2 segundos
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2000);
});

// Inicialização da aplicação
function initializeApp() {
    // Verifica se utilizador está logado
    const token = localStorage.getItem('gpas_token');
    if (token) {
        validateToken(token);
    }
    
    // Setup de animações básicas
    initializeAnimations();
    
    // Setup do toggle de preços
    setupPricingToggle();
    
    // Criar modais se não existirem
    createModals();
}

// Criar modais dinamicamente
function createModals() {
    // Modal de Login
    if (!document.getElementById('loginModal')) {
        const loginModal = document.createElement('div');
        loginModal.id = 'loginModal';
        loginModal.className = 'modal';
        loginModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚀 Login GPAS 2.0</h3>
                    <button class="modal-close" onclick="closeModal('loginModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email:</label>
                            <input type="email" id="loginEmail" required placeholder="user1@example.com">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password:</label>
                            <input type="password" id="loginPassword" required placeholder="password">
                        </div>
                        <button type="submit" class="btn-primary">Entrar</button>
                        <p style="margin-top: 15px; text-align: center;">
                            Não tens conta? 
                            <a href="#" onclick="openSignupModal()" style="color: var(--accent);">Regista-te aqui</a>
                        </p>
                        <div style="margin-top: 15px; padding: 10px; background: #2a2a3e; border-radius: 8px; font-size: 0.9rem;">
                            <strong>Demo:</strong><br>
                            Email: user1@example.com<br>
                            Password: password
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(loginModal);
    }
    
    // Modal de Registo
    if (!document.getElementById('signupModal')) {
        const signupModal = document.createElement('div');
        signupModal.id = 'signupModal';
        signupModal.className = 'modal';
        signupModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚀 Registo GPAS 2.0</h3>
                    <button class="modal-close" onclick="closeModal('signupModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="signupForm">
                        <div class="form-group">
                            <label for="signupName">Nome:</label>
                            <input type="text" id="signupName" required placeholder="O teu nome">
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email:</label>
                            <input type="email" id="signupEmail" required placeholder="o.teu.email@exemplo.com">
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password:</label>
                            <input type="password" id="signupPassword" required placeholder="Mínimo 6 caracteres">
                        </div>
                        <button type="submit" class="btn-primary">Criar Conta</button>
                        <p style="margin-top: 15px; text-align: center;">
                            Já tens conta? 
                            <a href="#" onclick="openLoginModal()" style="color: var(--accent);">Faz login aqui</a>
                        </p>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(signupModal);
    }
    
    // Adicionar estilos dos modais
    if (!document.getElementById('modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .modal.active {
                display: flex;
            }
            
            .modal-content {
                background: var(--bg-card, #1a1a2e);
                padding: 30px;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                color: white;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .modal-header {
                margin-bottom: 20px;
                text-align: center;
            }
            
            .modal-header h3 {
                margin: 0;
                color: var(--accent, #6366f1);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            
            .form-group input {
                width: 100%;
                padding: 12px;
                border: 1px solid #444;
                border-radius: 8px;
                background: #2a2a3e;
                color: white;
                font-size: 16px;
                box-sizing: border-box;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: var(--accent, #6366f1);
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
            }
            
            .btn-primary {
                width: 100%;
                background: var(--accent, #6366f1);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            
            .btn-primary:hover {
                background: var(--accent-hover, #5855eb);
                transform: translateY(-2px);
            }
            
            .btn-primary:disabled {
                background: #666;
                cursor: not-allowed;
                transform: none;
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

// Event Listeners
function setupEventListeners() {
    // Navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Fechar modais ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Setup dos formulários após criação dos modais
    setTimeout(() => {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
        }
    }, 100);
}

// Autenticação
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Desabilitar botão durante o processo
    submitButton.disabled = true;
    submitButton.textContent = 'Entrando...';
    
    console.log('🔐 Tentando login:', email);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('📡 Resposta do servidor:', response.status);
        
        const data = await response.json();
        console.log('📊 Dados recebidos:', data);
        
        if (response.ok) {
            localStorage.setItem('gpas_token', data.access_token);
            currentUser = data.user;
            isLoggedIn = true;
            
            closeModal('loginModal');
            showSuccessMessage('Login realizado com sucesso!');
            updateUIForLoggedInUser();
            
            // Aguardar um pouco e carregar dashboard
            setTimeout(() => {
                loadDashboard();
            }, 1000);
            
        } else {
            showErrorMessage(data.error || 'Erro no login');
        }
    } catch (error) {
        console.error('❌ Erro no login:', error);
        showErrorMessage('Erro de conexão. Verifica se o backend está online.');
    } finally {
        // Reabilitar botão
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Validação básica
    if (password.length < 6) {
        showErrorMessage('Password deve ter pelo menos 6 caracteres');
        return;
    }
    
    // Desabilitar botão durante o processo
    submitButton.disabled = true;
    submitButton.textContent = 'Criando conta...';
    
    console.log('📝 Tentando registo:', email);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        console.log('📡 Resposta do servidor:', response.status);
        
        const data = await response.json();
        console.log('📊 Dados recebidos:', data);
        
        if (response.ok) {
            localStorage.setItem('gpas_token', data.access_token);
            currentUser = data.user;
            isLoggedIn = true;
            
            closeModal('signupModal');
            showSuccessMessage('Conta criada com sucesso!');
            updateUIForLoggedInUser();
            
            // Aguardar um pouco e carregar dashboard
            setTimeout(() => {
                loadDashboard();
            }, 1000);
            
        } else {
            showErrorMessage(data.error || 'Erro no registo');
        }
    } catch (error) {
        console.error('❌ Erro no registo:', error);
        showErrorMessage('Erro de conexão. Verifica se o backend está online.');
    } finally {
        // Reabilitar botão
        submitButton.disabled = false;
        submitButton.textContent = 'Criar Conta';
    }
}

// Validar token
async function validateToken(token) {
    try {
        // Como não temos endpoint de validação, vamos tentar fazer uma chamada autenticada
        const response = await fetch(`${API_BASE_URL}/stats/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            isLoggedIn = true;
            // Simular dados do utilizador
            currentUser = {
                name: 'Utilizador',
                email: 'user@example.com',
                plan: 'professional'
            };
            updateUIForLoggedInUser();
        } else {
            localStorage.removeItem('gpas_token');
        }
    } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('gpas_token');
    }
}

// Funções de modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('📱 Modal aberto:', modalId);
    } else {
        console.error('❌ Modal não encontrado:', modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('📱 Modal fechado:', modalId);
    }
}

function openLoginModal() {
    closeModal('signupModal');
    openModal('loginModal');
}

function openSignupModal() {
    closeModal('loginModal');
    openModal('signupModal');
}

// Funções principais de CTA
function startFreeTrial() {
    console.log('🚀 Iniciando teste grátis');
    
    if (isLoggedIn) {
        loadDashboard();
    } else {
        openSignupModal();
    }
}

function watchDemo() {
    console.log('🎬 Assistindo demo');
    showDemoModal();
}

function selectPlan(planType) {
    console.log('💰 Plano selecionado:', planType);
    
    if (!isLoggedIn) {
        localStorage.setItem('selected_plan', planType);
        openSignupModal();
    } else {
        showSuccessMessage(`Plano ${planType} selecionado! Redirecionando...`);
        setTimeout(() => {
            loadDashboard();
        }, 1500);
    }
}

// Dashboard
function loadDashboard() {
    console.log('📊 Carregando dashboard...');
    
    // Simular carregamento do dashboard
    document.body.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1>🚀 GPAS 2.0 Dashboard</h1>
                <div class="user-info">
                    <span>Bem-vindo, ${currentUser?.name || 'Utilizador'}!</span>
                    <button onclick="logout()" class="btn-secondary">Logout</button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>💰 Receita Hoje</h3>
                        <div class="stat-value">€${(Math.random() * 1000).toFixed(2)}</div>
                        <div class="stat-change">+${(Math.random() * 50).toFixed(1)}%</div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>🎯 Oportunidades</h3>
                        <div class="stat-value">${Math.floor(Math.random() * 200)}</div>
                        <div class="stat-change">+${(Math.random() * 30).toFixed(1)}%</div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>📈 ROI Médio</h3>
                        <div class="stat-value">${(Math.random() * 100).toFixed(1)}%</div>
                        <div class="stat-change">+${(Math.random() * 20).toFixed(1)}%</div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>🤖 IA Status</h3>
                        <div class="stat-value">Ativa</div>
                        <div class="stat-change">94.7% precisão</div>
                    </div>
                </div>
                
                <div class="dashboard-actions">
                    <button onclick="searchProducts()" class="btn-primary">
                        <i class="fas fa-search"></i> Pesquisar Produtos
                    </button>
                    <button onclick="viewOpportunities()" class="btn-primary">
                        <i class="fas fa-chart-line"></i> Ver Oportunidades
                    </button>
                    <button onclick="viewAnalytics()" class="btn-primary">
                        <i class="fas fa-analytics"></i> Analytics
                    </button>
                    <button onclick="testAPI()" class="btn-secondary">
                        <i class="fas fa-cog"></i> Testar API
                    </button>
                </div>
                
                <div id="dashboard-results" class="dashboard-results">
                    <div class="welcome-message">
                        <h3>🎉 Bem-vindo ao GPAS 2.0!</h3>
                        <p>O teu sistema de arbitragem inteligente está pronto para gerar lucro!</p>
                        <p>Seleciona uma ação acima para começar a explorar as funcionalidades.</p>
                        
                        <div class="quick-stats">
                            <div class="quick-stat">
                                <span class="stat-icon">🌍</span>
                                <span class="stat-text">15+ Marketplaces conectados</span>
                            </div>
                            <div class="quick-stat">
                                <span class="stat-icon">🧠</span>
                                <span class="stat-text">IA com 94.7% de precisão</span>
                            </div>
                            <div class="quick-stat">
                                <span class="stat-icon">⚡</span>
                                <span class="stat-text">Análise em tempo real</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .dashboard {
                min-height: 100vh;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
                color: #ffffff;
                padding: 20px;
                font-family: 'Inter', sans-serif;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #333;
            }
            
            .dashboard-header h1 {
                margin: 0;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                padding: 25px;
                border-radius: 16px;
                border: 1px solid #333;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
            }
            
            .stat-card h3 {
                margin: 0 0 15px 0;
                font-size: 1rem;
                color: #94a3b8;
            }
            
            .stat-value {
                font-size: 2.5rem;
                font-weight: bold;
                color: #6366f1;
                margin: 10px 0;
            }
            
            .stat-change {
                color: #10b981;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .dashboard-actions {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }
            
            .dashboard-results {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                padding: 30px;
                border-radius: 16px;
                border: 1px solid #333;
                min-height: 300px;
            }
            
            .welcome-message {
                text-align: center;
            }
            
            .welcome-message h3 {
                color: #6366f1;
                margin-bottom: 15px;
            }
            
            .welcome-message p {
                color: #94a3b8;
                margin-bottom: 15px;
                line-height: 1.6;
            }
            
            .quick-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            
            .quick-stat {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 15px;
                background: rgba(99, 102, 241, 0.1);
                border-radius: 12px;
                border: 1px solid rgba(99, 102, 241, 0.2);
            }
            
            .stat-icon {
                font-size: 1.5rem;
            }
            
            .stat-text {
                font-weight: 500;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
            }
            
            .btn-secondary {
                background: transparent;
                color: #94a3b8;
                border: 1px solid #333;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-secondary:hover {
                background: rgba(99, 102, 241, 0.1);
                border-color: #6366f1;
                color: #6366f1;
            }
            
            @media (max-width: 768px) {
                .dashboard {
                    padding: 15px;
                }
                
                .dashboard-header {
                    flex-direction: column;
                    gap: 15px;
                    text-align: center;
                }
                
                .dashboard-actions {
                    justify-content: center;
                }
                
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;
    
    console.log('✅ Dashboard carregado com sucesso!');
}

// Função para testar API
async function testAPI() {
    const resultsDiv = document.getElementById('dashboard-results');
    resultsDiv.innerHTML = '<p>🔧 Testando conexão com API...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (response.ok) {
            resultsDiv.innerHTML = `
                <h3>✅ API Funcionando!</h3>
                <div style="background: #2a2a3e; padding: 20px; border-radius: 12px; margin-top: 20px;">
                    <pre style="color: #10b981; margin: 0;">${JSON.stringify(data, null, 2)}</pre>
                </div>
                <p style="margin-top: 15px; color: #94a3b8;">
                    Backend URL: <code>${API_BASE_URL}</code>
                </p>
            `;
        } else {
            resultsDiv.innerHTML = `<p>❌ Erro na API: ${response.status}</p>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = `
            <h3>❌ Erro de Conexão</h3>
            <p>Não foi possível conectar ao backend.</p>
            <p><strong>URL testado:</strong> ${API_BASE_URL}</p>
            <p><strong>Erro:</strong> ${error.message}</p>
            <div style="background: #2a2a3e; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p><strong>Possíveis soluções:</strong></p>
                <ul>
                    <li>Verifica se o backend está online</li>
                    <li>Confirma o URL do backend no código</li>
                    <li>Verifica as configurações de CORS</li>
                </ul>
            </div>
        `;
    }
}

// Funções do dashboard (simplificadas para demonstração)
async function searchProducts() {
    const query = prompt('Digite o produto que deseja pesquisar:');
    if (!query) return;
    
    const resultsDiv = document.getElementById('dashboard-results');
    resultsDiv.innerHTML = '<p>🔍 Pesquisando produtos...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('gpas_token')}`
            },
            body: JSON.stringify({ query })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displaySearchResults(data.results);
        } else {
            resultsDiv.innerHTML = `<p>❌ Erro: ${data.error}</p>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>❌ Erro de conexão</p>';
    }
}

async function viewOpportunities() {
    const resultsDiv = document.getElementById('dashboard-results');
    resultsDiv.innerHTML = '<p>📊 Carregando oportunidades...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/arbitrage/opportunities`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('gpas_token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayOpportunities(data.opportunities);
        } else {
            resultsDiv.innerHTML = `<p>❌ Erro: ${data.error}</p>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>❌ Erro de conexão</p>';
    }
}

async function viewAnalytics() {
    const resultsDiv = document.getElementById('dashboard-results');
    resultsDiv.innerHTML = '<p>📈 Carregando analytics...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/stats/dashboard`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('gpas_token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayAnalytics(data);
        } else {
            resultsDiv.innerHTML = `<p>❌ Erro: ${data.error}</p>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>❌ Erro de conexão</p>';
    }
}

// Display functions (simplificadas)
function displaySearchResults(results) {
    const resultsDiv = document.getElementById('dashboard-results');
    
    if (!results || results.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }
    
    const html = `
        <h3>🔍 Resultados da Pesquisa (${results.length} produtos)</h3>
        <div class="results-grid">
            ${results.slice(0, 6).map(product => `
                <div class="result-card">
                    <h4>${product.title}</h4>
                    <p><strong>Marketplace:</strong> ${product.marketplace}</p>
                    <p><strong>Preço:</strong> €${product.price}</p>
                    <p><strong>Rating:</strong> ${product.rating}/5</p>
                </div>
            `).join('')}
        </div>
        
        <style>
            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            
            .result-card {
                background: #2a2a3e;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #444;
            }
            
            .result-card h4 {
                margin: 0 0 10px 0;
                color: #6366f1;
            }
        </style>
    `;
    
    resultsDiv.innerHTML = html;
}

function displayOpportunities(opportunities) {
    const resultsDiv = document.getElementById('dashboard-results');
    
    if (!opportunities || opportunities.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhuma oportunidade encontrada.</p>';
        return;
    }
    
    const html = `
        <h3>💰 Oportunidades de Arbitragem (${opportunities.length})</h3>
        <div class="opportunities-grid">
            ${opportunities.slice(0, 6).map(opp => `
                <div class="opportunity-card">
                    <h4>${opp.product_name}</h4>
                    <p><strong>Origem:</strong> ${opp.source.marketplace} - €${opp.source.price}</p>
                    <p><strong>Destino:</strong> ${opp.target.marketplace} - €${opp.target.price}</p>
                    <p class="profit"><strong>Lucro:</strong> €${opp.profit.net}</p>
                    <p class="roi"><strong>ROI:</strong> ${opp.profit.roi}%</p>
                </div>
            `).join('')}
        </div>
        
        <style>
            .opportunities-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            
            .opportunity-card {
                background: #2a2a3e;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #444;
            }
            
            .opportunity-card h4 {
                margin: 0 0 10px 0;
                color: #6366f1;
            }
            
            .profit {
                color: #10b981;
                font-weight: bold;
            }
            
            .roi {
                color: #f59e0b;
                font-weight: bold;
            }
        </style>
    `;
    
    resultsDiv.innerHTML = html;
}

function displayAnalytics(data) {
    const resultsDiv = document.getElementById('dashboard-results');
    
    const html = `
        <h3>📈 Analytics Dashboard</h3>
        <div class="analytics-grid">
            <div class="analytics-section">
                <h4>💰 Receita</h4>
                <p>Total: €${data.revenue?.total || 0}</p>
                <p>Este mês: €${data.revenue?.this_month || 0}</p>
                <p>Crescimento: ${data.revenue?.growth_rate || 0}%</p>
            </div>
            
            <div class="analytics-section">
                <h4>🎯 Oportunidades</h4>
                <p>Encontradas: ${data.opportunities?.found_today || 0}</p>
                <p>ROI médio: ${data.opportunities?.avg_roi || 0}%</p>
            </div>
            
            <div class="analytics-section">
                <h4>🤖 Automação</h4>
                <p>Taxa de sucesso: ${data.automation?.success_rate || 0}%</p>
                <p>Tempo poupado: ${data.automation?.time_saved || '0 horas'}</p>
            </div>
        </div>
        
        <style>
            .analytics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .analytics-section {
                background: #2a2a3e;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #444;
            }
            
            .analytics-section h4 {
                margin: 0 0 15px 0;
                color: #6366f1;
            }
        </style>
    `;
    
    resultsDiv.innerHTML = html;
}

// Logout
function logout() {
    localStorage.removeItem('gpas_token');
    localStorage.removeItem('selected_plan');
    currentUser = null;
    isLoggedIn = false;
    
    showSuccessMessage('Logout realizado com sucesso!');
    
    // Recarregar página após 1 segundo
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Setup do toggle de preços
function setupPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            const priceAmounts = document.querySelectorAll('.price-amount');
            const isAnnual = this.checked;
            
            priceAmounts.forEach(amount => {
                const monthly = amount.dataset.monthly;
                const annual = amount.dataset.annual;
                
                if (monthly && annual) {
                    amount.textContent = isAnnual ? annual : monthly;
                }
            });
        });
    }
}

// Animações básicas
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .result-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Atualizar UI para utilizador logado
function updateUIForLoggedInUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions && currentUser) {
        navActions.innerHTML = `
            <span style="color: #94a3b8;">Olá, ${currentUser.name}!</span>
            <button class="btn-primary" onclick="loadDashboard()">Dashboard</button>
            <button class="btn-secondary" onclick="logout()">Logout</button>
        `;
    }
}

// Mensagens de feedback
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 300);
    }, 5000);
}

// Demo modal
function showDemoModal() {
    const demoModal = document.createElement('div');
    demoModal.className = 'modal active';
    demoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    demoModal.innerHTML = `
        <div class="modal-content" style="
            background: #1a1a2e;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            color: white;
        ">
            <div class="modal-header" style="margin-bottom: 20px;">
                <h3>🎬 Demo GPAS 2.0</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                ">&times;</button>
            </div>
            <div class="modal-body">
                <div style="font-size: 4rem; margin-bottom: 20px;">🚀</div>
                <h4>Demo Interativo</h4>
                <p style="margin: 20px 0; color: #94a3b8;">
                    Vê como o GPAS 2.0 encontra oportunidades de €500+ em segundos
                </p>
                <div style="background: #2a2a3e; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Produto:</span>
                        <strong>iPhone 15 Case</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Amazon:</span>
                        <span>€45.99</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>eBay:</span>
                        <span>€78.50</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #10b981; font-weight: bold;">
                        <span>Lucro:</span>
                        <span>€27.50</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #f59e0b; font-weight: bold;">
                        <span>ROI:</span>
                        <span>59.8%</span>
                    </div>
                </div>
                <button onclick="startFreeTrial(); this.closest('.modal').remove();" style="
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    margin-top: 20px;
                ">
                    🚀 Começar Agora Grátis
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(demoModal);
}

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .loading-screen.hidden {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(style);

// Log de inicialização
console.log('🚀 GPAS 2.0 JavaScript carregado!');
console.log('🔗 API URL:', API_BASE_URL);
console.log('📱 Modais serão criados dinamicamente');
console.log('🔐 Sistema de autenticação ativo');

