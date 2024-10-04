module.exports = {
    apps: [
      {
        name: 'battlebit-community',
        script: 'bun',
        args: 'start --port 3100',  // Set Bun to use port 3100
        cwd: '/home/ubuntu/projects/battlebit.community',  // Path to your project
        watch: false,  // Disable watching for changes
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  