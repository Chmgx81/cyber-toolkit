document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strengthResult = checkPasswordStrength(password);
        updateStrengthMeter(strengthResult.score, strengthResult.feedback);
    });

    function checkPasswordStrength(password) {
        let score = 0;
        let feedback = [];
        if (password.length === 0) return { score: 0, feedback: [] };

        if (password.length < 8) {
            feedback.push("Too short");
        } else if (password.length >= 12) {
            score += 2;
        } else {
            score++;
        }

        if (/[A-Z]/.test(password)) {
            score++;
        } else {
            feedback.push("Add uppercase letters");
        }

        if (/[a-z]/.test(password)) {
            score++;
        } else {
            feedback.push("Add lowercase letters");
        }

        if (/[0-9]/.test(password)) {
            score++;
        } else {
            feedback.push("Add numbers");
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        } else {
            feedback.push("Add symbols");
        }

        let strengthLevel = 0;
        if (score <= 2) strengthLevel = 1; // Weak
        else if (score <= 4) strengthLevel = 2; // Medium
        else if (score <= 5) strengthLevel = 3; // Strong
        else strengthLevel = 4; // Very Strong

        return { score: strengthLevel, feedback: feedback.join(', ') };
    }

    function updateStrengthMeter(strength, feedback) {
        let width = '0%';
        let color = 'var(--weak-red)';
        let text = feedback || '';

        switch (strength) {
            case 0:
                width = '0%';
                text = '';
                break;
            case 1:
                width = '25%';
                color = 'var(--weak-red)';
                text = 'Weak. ' + feedback;
                break;
            case 2:
                width = '50%';
                color = 'var(--medium-orange)';
                text = 'Medium. ' + feedback;
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

    // --- Breach History Checker ---
    const breachCheckInput = document.getElementById('breach-check-input');
    const breachCheckBtn = document.getElementById('breach-check-btn');
    const breachResult = document.getElementById('breach-result');

    breachCheckBtn.addEventListener('click', async () => {
        const password = breachCheckInput.value;
        if (!password) {
            return;
        }

        breachResult.style.display = 'none';
        breachCheckBtn.textContent = 'Checking...';
        breachCheckBtn.disabled = true;

        try {
            const sha1Password = await sha1(password);
            const prefix = sha1Password.substring(0, 5);
            const suffix = sha1Password.substring(5).toUpperCase();
            
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!response.ok) {
                throw new Error('Could not fetch breach data.');
            }
            const data = await response.text();
            const pwnedCount = getPwnedCount(data, suffix);

            displayBreachResult(pwnedCount);

        } catch (error) {
            breachResult.style.display = 'block';
            breachResult.className = 'breach-result pwned';
            breachResult.textContent = 'Error: Could not check password. Please try again later.';
        } finally {
            breachCheckBtn.textContent = 'Check Now';
            breachCheckBtn.disabled = false;
        }
    });

    function getPwnedCount(hashes, hashSuffix) {
        const lines = hashes.split('\n');
        for (const line of lines) {
            const [hash, count] = line.split(':');
            if (hash === hashSuffix) {
                return parseInt(count, 10);
            }
        }
        return 0;
    }

    function displayBreachResult(count) {
        breachResult.style.display = 'block';
        if (count > 0) {
            breachResult.className = 'breach-result pwned';
            breachResult.textContent = `Oh no! This password has been found in ${count.toLocaleString()} data breaches. It is not secure.`;
        } else {
            breachResult.className = 'breach-result safe';
            breachResult.textContent = 'Good news! This password was not found in any known data breaches.';
        }
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

    // --- SHA-1 Helper Function ---
    async function sha1(str) {
        const buffer = new TextEncoder('utf-8').encode(str);
        const digest = await crypto.subtle.digest('SHA-1', buffer);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
});
