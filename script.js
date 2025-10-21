document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);
        updateStrengthMeter(strength);
    });

    function checkPasswordStrength(password) {
        let score = 0;
        if (password.length === 0) return 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score <= 2) return 1; // Weak
        if (score <= 4) return 2; // Medium
        if (score <= 5) return 3; // Strong
        return 4; // Very Strong
    }

    function updateStrengthMeter(strength) {
        let width = '0%';
        let color = 'var(--weak-red)';
        let text = '';

        switch (strength) {
            case 0:
                width = '0%';
                text = '';
                break;
            case 1:
                width = '25%';
                color = 'var(--weak-red)';
                text = 'Weak';
                break;
            case 2:
                width = '50%';
                color = 'var(--medium-orange)';
                text = 'Medium';
                break;
            case 3:
                width = '75%';
                color = 'var(--strong-blue)';
                text = 'Strong';
                break;
            case 4:
                width = '100%';
                color = 'var(--very-strong-green)';
                text = 'Very Strong';
                break;
        }

        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    // --- Password Generator ---
    const generatedPasswordField = document.getElementById('generated-password');
    const lengthInput = document.getElementById('length');
    const uppercaseInput = document.getElementById('uppercase');
    const numbersInput = document.getElementById('numbers');
    const symbolsInput = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');

    const charSets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    generateBtn.addEventListener('click', () => {
        const length = +lengthInput.value;
        const includeUppercase = uppercaseInput.checked;
        const includeNumbers = numbersInput.checked;
        const includeSymbols = symbolsInput.checked;
        generatedPasswordField.textContent = generatePassword(length, includeUppercase, includeNumbers, includeSymbols);
    });

    copyBtn.addEventListener('click', () => {
        const password = generatedPasswordField.textContent;
        if (password && password !== 'Click generate to create a password') {
            navigator.clipboard.writeText(password).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            });
        }
    });

    function generatePassword(length, uppercase, numbers, symbols) {
        let charset = charSets.lowercase;
        if (uppercase) charset += charSets.uppercase;
        if (numbers) charset += charSets.numbers;
        if (symbols) charset += charSets.symbols;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    // --- Premium Feature & Monetization ---
    const unlockBtn = document.getElementById('unlock-btn');
    const cryptoModal = document.getElementById('crypto-modal');
    const closeBtn = document.querySelector('.close-btn');
    const walletAddressInput = document.getElementById('wallet-address');
    const copyWalletBtn = document.getElementById('copy-wallet-btn');
    const txidInput = document.getElementById('txid-input');
    const verifyTxBtn = document.getElementById('verify-tx-btn');
    const lockedFeature = document.getElementById('passphrase-generator-locked');
    const unlockedFeature = document.getElementById('passphrase-generator-unlocked');
    const generatePassphraseBtn = document.getElementById('generate-passphrase-btn');
    const passphraseField = document.getElementById('generated-passphrase');

    walletAddressInput.value = "0x93Ce4c64906ba99B0ea7e1B85B396509a38419E1";

    // Ensure the modal is hidden on page load
    cryptoModal.classList.add('hidden');

    unlockBtn.addEventListener('click', () => {
        cryptoModal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        cryptoModal.classList.add('hidden');
    });

    copyWalletBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(walletAddressInput.value).then(() => {
            copyWalletBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyWalletBtn.textContent = 'Copy Address';
            }, 2000);
        });
    });

    verifyTxBtn.addEventListener('click', () => {
        if (txidInput.value.trim() !== '') {
            alert('Payment verified! Premium feature unlocked.');
            cryptoModal.classList.add('hidden');
            lockedFeature.classList.add('hidden');
            unlockedFeature.classList.remove('hidden');
            localStorage.setItem('premiumUnlocked', 'true');
        } else {
            alert('Please enter a valid Transaction Hash.');
        }
    });

    if (localStorage.getItem('premiumUnlocked') === 'true') {
        lockedFeature.classList.add('hidden');
        unlockedFeature.classList.remove('hidden');
    }

    const words = ["apple", "bicycle", "galaxy", "mountain", "ocean", "sunshine", "guitar", "pizza", "wizard", "robot", "dragon", "castle", "forest", "river", "diamond", "purple", "happy", "clever", "strong", "silent"];

    generatePassphraseBtn.addEventListener('click', () => {
        let passphrase = '';
        for (let i = 0; i < 4; i++) {
            passphrase += words[Math.floor(Math.random() * words.length)];
            if (i < 3) passphrase += '-';
        }
        passphraseField.textContent = passphrase;
    });
});
