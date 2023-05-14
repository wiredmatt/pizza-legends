<div align="center">
  <br/>
  <br/>
  <img src="./public/images/logo.png" alt="header" width="100" />

  <h1>Pizza Legends</h1>
  <br/>
</div>

This is a [Pizza Legends](https://www.youtube.com/watch?v=fyi4vfbKEeo) clone made with [TypeScript](https://www.typescriptlang.org/) and [Rollup](https://rollupjs.org) with ⚡️ lightning fast HMR through [Vite](https://vitejs.dev/).


This is not a fully featured game and it won't be. It's just a remake of Drew's Pizza Legends with Typescript, the sole idea of this project is to help web developers understand core game development concepts and functionalities (such as the game loop).

Don't look much at the code lol, I thought it would've been possible to make this clean while keeping it as close as possible as he designed the original codebase; many improvements can be made but honestly I learned what I needed, completely recommend following his series on web game development.

## Available Commands

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `pnpm i`         | Install project dependencies                             |
| `pnpm dev`       | Builds project and open web server, watching for changes |
| `pnpm build`     | Builds code bundle with production settings              |
| `pnpm serve`     | Run a web server to serve built code bundle              |

## Development

After cloning the repo, run `pnpm i` from your project directory. Then, you can start the local development
server by running `pnpm dev` and navigate to <http://localhost:3000>.

## Production

After running `pnpm build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `pnpm serve` and navigate to <http://localhost:5000>

## Credits

- [geocine/phaser3-rollup-typescript](https://github.com/geocine/phaser3-rollup-typescript)
- [Drew Conley - Pizza Legends](https://www.youtube.com/watch?v=fyi4vfbKEeo&list=PLcjhmZ8oLT0r9dSiIK6RB_PuBWlG1KSq_)