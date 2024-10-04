import {defineConfig} from "rollup"
import typescript from '@rollup/plugin-typescript';



export default defineConfig({
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        name:"a-multistep-form",
        sourcemap: true,
      },
     
    ],

    plugins: [typescript({ tsconfig: "tsconfig.json" })],
    external: ['react', 'react-dom', 'framer-motion'],
})