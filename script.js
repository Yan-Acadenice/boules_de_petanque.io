// Boules de Pétanque Virtuelles - JavaScript
class BoulesDeBoules {
    constructor() {
        this.boules = document.querySelectorAll('.boule');
        this.cochonnet = document.getElementById('cochonnet');
        this.terrain = document.querySelector('.terrain');
        this.lancerBtn = document.getElementById('lancerBoules');
        this.resetBtn = document.getElementById('resetTerrain');
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.placerCochonnetAleatoire();
        this.placerBoulesAleatoires();
        this.ajouterSonsVirtuels();
    }
    
    addEventListeners() {
        // Clic sur les boules individuelles
        this.boules.forEach(boule => {
            boule.addEventListener('click', (e) => {
                this.roulerBoule(e.target);
            });
        });
        
        // Bouton lancer toutes les boules
        this.lancerBtn.addEventListener('click', () => {
            this.lancerToutesLesBoules();
        });
        
        // Bouton reset
        this.resetBtn.addEventListener('click', () => {
            this.resetTerrain();
        });
        
        // Effet de survol pour le cochonnet
        this.cochonnet.addEventListener('mouseenter', () => {
            this.cochonnet.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        this.cochonnet.addEventListener('mouseleave', () => {
            this.cochonnet.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    roulerBoule(boule) {
        // Empêcher multiple clics
        if (boule.classList.contains('rolling')) return;
        
        boule.classList.add('rolling');
        
        // Son virtuel
        this.jouerSon('roulement');
        
        // Nouvelle position aléatoire
        setTimeout(() => {
            this.deplacerBouleAleatoire(boule);
            boule.classList.remove('rolling');
        }, 2000);
    }
    
    lancerToutesLesBoules() {
        this.lancerBtn.disabled = true;
        this.lancerBtn.textContent = '🎯 Lancement en cours...';
        
        this.boules.forEach((boule, index) => {
            setTimeout(() => {
                this.lancerBoule(boule);
            }, index * 300);
        });
        
        // Réactiver le bouton après toutes les animations
        setTimeout(() => {
            this.lancerBtn.disabled = false;
            this.lancerBtn.textContent = '🎯 Lancer les boules!';
        }, this.boules.length * 300 + 3000);
    }
    
    lancerBoule(boule) {
        // Position aléatoire pour l'animation
        const randomX = (Math.random() - 0.5) * 200;
        boule.style.setProperty('--random-x', randomX + 'px');
        
        boule.classList.add('launched');
        
        setTimeout(() => {
            this.deplacerBouleAleatoire(boule);
            boule.classList.remove('launched');
        }, 3000);
    }
    
    deplacerBouleAleatoire(boule) {
        const terrainRect = this.terrain.getBoundingClientRect();
        const bouleSize = 60; // Taille de la boule
        
        // Limites pour rester dans le terrain
        const maxLeft = terrainRect.width - bouleSize - 20;
        const maxTop = terrainRect.height - bouleSize - 20;
        
        const newLeft = Math.random() * maxLeft + 10;
        const newTop = Math.random() * maxTop + 10;
        
        boule.style.left = newLeft + 'px';
        boule.style.top = newTop + 'px';
        
        // Calculer la distance au cochonnet pour les effets
        this.calculerScore(boule);
    }
    
    placerCochonnetAleatoire() {
        const terrain = this.terrain.getBoundingClientRect();
        
        // Zone centrale pour le cochonnet
        const centerX = Math.random() * (terrain.width * 0.6) + (terrain.width * 0.2);
        const centerY = Math.random() * (terrain.height * 0.6) + (terrain.height * 0.2);
        
        this.cochonnet.style.left = centerX + 'px';
        this.cochonnet.style.top = centerY + 'px';
        this.cochonnet.style.transform = 'translate(-50%, -50%)';
    }
    
    placerBoulesAleatoires() {
        this.boules.forEach((boule, index) => {
            // Disposer les boules en bas du terrain
            const baseY = 80; // Pourcentage du bas
            const spacing = 100 / (this.boules.length + 1);
            const baseX = spacing * (index + 1);
            
            // Ajouter un peu de variation
            const randomOffsetX = (Math.random() - 0.5) * 30;
            const randomOffsetY = (Math.random() - 0.5) * 20;
            
            boule.style.left = (baseX + randomOffsetX) + '%';
            boule.style.top = (baseY + randomOffsetY) + '%';
        });
    }
    
    calculerScore(boule) {
        const bouleRect = boule.getBoundingClientRect();
        const cochonnetRect = this.cochonnet.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(bouleRect.left - cochonnetRect.left, 2) + 
            Math.pow(bouleRect.top - cochonnetRect.top, 2)
        );
        
        // Effet visuel selon la distance
        if (distance < 100) {
            boule.style.boxShadow = '0 0 20px #FFD700, 0 6px 12px rgba(0, 0, 0, 0.4)';
            this.jouerSon('proche');
        } else if (distance < 200) {
            boule.style.boxShadow = '0 0 15px #FFA500, 0 6px 12px rgba(0, 0, 0, 0.4)';
        } else {
            boule.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        }
        
        // Reset l'effet après un moment
        setTimeout(() => {
            boule.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4), inset 0 3px 6px rgba(255, 255, 255, 0.3)';
        }, 2000);
    }
    
    resetTerrain() {
        // Animation de reset
        this.terrain.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.placerCochonnetAleatoire();
            this.placerBoulesAleatoires();
            
            // Reset des effets visuels
            this.boules.forEach(boule => {
                boule.classList.remove('rolling', 'launched');
                boule.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4), inset 0 3px 6px rgba(255, 255, 255, 0.3)';
            });
            
            this.terrain.style.transform = 'scale(1)';
        }, 200);
        
        this.jouerSon('reset');
    }
    
    ajouterSonsVirtuels() {
        // Créer des éléments audio virtuels (sans fichiers audio réels)
        this.sons = {
            roulement: this.creerSonVirtuel('roulement'),
            proche: this.creerSonVirtuel('proche'),
            reset: this.creerSonVirtuel('reset')
        };
    }
    
    creerSonVirtuel(type) {
        // Simuler des sons avec des vibrations visuelles
        return {
            play: () => {
                switch(type) {
                    case 'roulement':
                        this.afficherNotification('🎵 *bruit de roulement*');
                        break;
                    case 'proche':
                        this.afficherNotification('🎯 Proche du cochonnet!');
                        break;
                    case 'reset':
                        this.afficherNotification('🔄 Nouveau terrain!');
                        break;
                }
            }
        };
    }
    
    jouerSon(type) {
        if (this.sons[type]) {
            this.sons[type].play();
        }
    }
    
    afficherNotification(message) {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Supprimer après 2 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Méthode pour obtenir les statistiques du jeu
    obtenirStats() {
        const stats = {
            boulesRouges: Array.from(this.boules).filter(b => b.classList.contains('boule-rouge')).length,
            boulesBleues: Array.from(this.boules).filter(b => b.classList.contains('boule-bleue')).length,
            cochonnetPosition: {
                x: this.cochonnet.style.left,
                y: this.cochonnet.style.top
            }
        };
        
        console.log('📊 Stats du terrain:', stats);
        return stats;
    }
}

// Animations CSS supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const jeu = new BoulesDeBoules();
    
    // Rendre l'instance globale pour le débogage
    window.boulesdeboules = jeu;
    
    // Message de bienvenue
    console.log('🎯 Boules de Pétanque Virtuelles chargées!');
    console.log('💡 Tapez window.boulesdeboules.obtenirStats() pour voir les stats');
    
    // Effet de chargement
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg - Konami Code pour des effets spéciaux
let konamiCode = '';
const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';

document.addEventListener('keydown', (e) => {
    konamiCode += e.code;
    if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
    }
    
    if (konamiCode === konamiSequence) {
        // Mode disco pour les boules
        document.querySelectorAll('.boule').forEach(boule => {
            boule.style.animation = 'rainbow 2s infinite, roulement 1s infinite';
        });
        
        console.log('🎉 Mode Disco activé! Les boules sont en fête!');
        konamiCode = '';
    }
});

// Animation rainbow pour l'easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { background: radial-gradient(circle at 30% 30%, #FF6B6B, #CC0000); }
        16% { background: radial-gradient(circle at 30% 30%, #FFA500, #FF4500); }
        33% { background: radial-gradient(circle at 30% 30%, #FFD700, #FFA500); }
        50% { background: radial-gradient(circle at 30% 30%, #32CD32, #008000); }
        66% { background: radial-gradient(circle at 30% 30%, #4ECDC4, #0066CC); }
        83% { background: radial-gradient(circle at 30% 30%, #8A2BE2, #4B0082); }
        100% { background: radial-gradient(circle at 30% 30%, #FF1493, #DC143C); }
    }
`;
document.head.appendChild(rainbowStyle);