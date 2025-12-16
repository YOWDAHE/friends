module.exports = {
    theme: {
        extend: {
            fontFamily: {
                poppins: ['var(--font-poppins)'],
                rage: ['var(--font-rage)'],
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                marquee: 'marquee 30s linear infinite',
            },
        },
    },
};
