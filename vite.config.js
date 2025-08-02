import path from 'node:path';

export default {
  root: path.resolve(__dirname),
  server: {
    port: 3000,
    hot: true, 
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  }
}