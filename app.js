// GPAS 2.0 - Frontend JavaScript CORRIGIDO
// Sistema de conversão e monetização

// Configuração da API
const API_BASE_URL = 'https://gpas-2-backend.onrender.com/api';

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
}

// Autenticação
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('gpas_token', data.access_token);
            currentUser = data.user;
            isLoggedIn = true;
            
            closeModal('loginModal');
            showSuccessMessage('Login realizado com sucesso!');
            
            // Redirecionar para dashboard
            setTimeout(() => {
                loadDashboard();
            }, 1500);
            
        } else {
            showErrorMessage(data.error || 'Erro no login');
        }
    } catch (error) {
        console.error('Login error:', error);
        showErrorMessage('Erro de conexão. Tente novamente.');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('gpas_token', data.access_token);
            currentUser = data.user;
            isLoggedIn = true;
            
            closeModal('signupModal');
            showSuccessMessage('Conta criada com sucesso!');
            
            // Mostrar dashboard
            setTimeout(() => {
                loadDashboard();
            }, 1500);
            
        } else {
            showErrorMessage(data.error || 'Erro no registo');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showErrorMessage('Erro de conexão. Tente novamente.');
    }
}

// Validar token
async function validateToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            isLoggedIn = true;
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
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
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
        // Em produção, redirecionar para checkout
        showSuccessMessage(`Plano ${planType} selecionado! Redirecionando...`);
    }
}

// Dashboard
function loadDashboard() {
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
                        <h3>Receita Hoje</h3>
                        <div class="stat-value">€${(Math.random() * 1000).toFixed(2)}</div>
                        <div class="stat-change">+${(Math.random() * 50).toFixed(1)}%</div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>Oportunidades</h3>
                        <div class="stat-value">${Math.floor(Math.random() * 200)}</div>
                        <div class="stat-change">+${(Math.random() * 30).toFixed(1)}%</div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>ROI Médio</h3>
                        <div class="stat-value">${(Math.random() * 100).toFixed(1)}%</div>
                        <div class="stat-change">+${(Math.random() * 20).toFixed(1)}%</div>
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
                </div>
                
                <div id="dashboard-results" class="dashboard-results">
                    <p>Selecione uma ação acima para começar!</p>
                </div>
            </div>
        </div>
        
        <style>
            .dashboard {
                min-height: 100vh;
                background: var(--bg-primary, #0f0f23);
                color: var(--text-primary, #ffffff);
                padding: 20px;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #333;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: var(--bg-card, #1a1a2e);
                padding: 20px;
                border-radius: 12px;
                border: 1px solid #333;
            }
            
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                color: var(--accent, #6366f1);
                margin: 10px 0;
            }
            
            .stat-change {
                color: #10b981;
                font-size: 0.9rem;
            }
            
            .dashboard-actions {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }
            
            .dashboard-results {
                background: var(--bg-card, #1a1a2e);
                padding: 20px;
                border-radius: 12px;
                border: 1px solid #333;
                min-height: 200px;
            }
            
            .btn-primary {
                background: var(--accent, #6366f1);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .btn-primary:hover {
                background: var(--accent-hover, #5855eb);
                transform: translateY(-2px);
            }
            
            .btn-secondary {
                background: transparent;
                color: var(--text-secondary, #94a3b8);
                border: 1px solid #333;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
            }
        </style>
    `;
}

// Funções do dashboard
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

// Display functions
function displaySearchResults(results) {
    const resultsDiv = document.getElementById('dashboard-results');
    
    if (!results || results.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }
    
    const html = `
        <h3>🔍 Resultados da Pesquisa (${results.length} produtos)</h3>
        <div class="results-grid">
            ${results.map(product => `
                <div class="result-card">
                    <h4>${product.title}</h4>
                    <p><strong>Marketplace:</strong> ${product.marketplace}</p>
                    <p><strong>Preço:</strong> €${product.price}</p>
                    <p><strong>Rating:</strong> ${product.rating}/5 (${product.reviews} reviews)</p>
                    <p><strong>Disponibilidade:</strong> ${product.availability}</p>
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
                color: var(--accent, #6366f1);
            }
            
            .result-card p {
                margin: 5px 0;
                font-size: 0.9rem;
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
            ${opportunities.slice(0, 10).map(opp => `
                <div class="opportunity-card">
                    <h4>${opp.product_name}</h4>
                    <div class="opportunity-details">
                        <p><strong>Origem:</strong> ${opp.source.marketplace} - €${opp.source.price}</p>
                        <p><strong>Destino:</strong> ${opp.target.marketplace} - €${opp.target.price}</p>
                        <p class="profit"><strong>Lucro:</strong> €${opp.profit.net}</p>
                        <p class="roi"><strong>ROI:</strong> ${opp.profit.roi}%</p>
                        <p class="risk"><strong>Risco:</strong> ${opp.risk.level}</p>
                    </div>
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
                color: var(--accent, #6366f1);
            }
            
            .opportunity-details p {
                margin: 5px 0;
                font-size: 0.9rem;
            }
            
            .profit {
                color: #10b981;
                font-weight: bold;
            }
            
            .roi {
                color: #f59e0b;
                font-weight: bold;
            }
            
            .risk {
                color: #ef4444;
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
                <p>Hoje: €${data.revenue?.today || 0}</p>
                <p>Crescimento: ${data.revenue?.growth_rate || 0}%</p>
            </div>
            
            <div class="analytics-section">
                <h4>🎯 Oportunidades</h4>
                <p>Encontradas hoje: ${data.opportunities?.found_today || 0}</p>
                <p>Lucrativas: ${data.opportunities?.profitable || 0}</p>
                <p>ROI médio: ${data.opportunities?.avg_roi || 0}%</p>
                <p>Melhor ROI: ${data.opportunities?.best_roi || 0}%</p>
            </div>
            
            <div class="analytics-section">
                <h4>🤖 Automação</h4>
                <p>Scans ativos: ${data.automation?.active_scans || 0}</p>
                <p>Taxa de sucesso: ${data.automation?.success_rate || 0}%</p>
                <p>Tempo poupado: ${data.automation?.time_saved || '0 horas'}</p>
            </div>
            
            <div class="analytics-section">
                <h4>🧠 IA Insights</h4>
                <p>Precisão: ${data.ai_insights?.predictions_accuracy || 0}%</p>
                <p>Tendências: ${data.ai_insights?.trends_identified || 0}</p>
                <p>Alertas: ${data.ai_insights?.risk_alerts || 0}</p>
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
                color: var(--accent, #6366f1);
            }
            
            .analytics-section p {
                margin: 8px 0;
                font-size: 0.9rem;
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
    
    // Recarregar página
    window.location.reload();
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
    // Intersection Observer para animações de entrada
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
    
    // Observar elementos para animação
    document.querySelectorAll('.feature-card, .result-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Atualizar UI para utilizador logado
function updateUIForLoggedInUser() {
    // Atualizar botões de navegação
    const navActions = document.querySelector('.nav-actions');
    if (navActions && currentUser) {
        navActions.innerHTML = `
            <span>Olá, ${currentUser.name}!</span>
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
            background: var(--bg-card, #1a1a2e);
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
                        <span>Produto encontrado:</span>
                        <strong>iPhone 15 Case</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Preço Amazon:</span>
                        <span>€45.99</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Preço eBay:</span>
                        <span>€78.50</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #10b981; font-weight: bold;">
                        <span>Lucro potencial:</span>
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

