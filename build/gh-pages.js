module.exports = {
    all: {
        options: {
            base: 'dist',
            add: true,
            message: 'Auto-generated commit',
        },
        src: global.branch ? [global.branch_prefix + global.branch + '/**'] : ['**', '!' + global.branch_prefix + '*/**']
    }
};
