import { spawn } from 'node:child_process'
import { openSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const logPath = resolve(root, '.tools/vite.log')
const out = openSync(logPath, 'a')

const child = spawn(
  process.execPath,
  [
    resolve(root, 'node_modules/vite/bin/vite.js'),
    '--host',
    '0.0.0.0',
    '--port',
    '8085',
    '--strictPort'
  ],
  {
    cwd: root,
    detached: true,
    windowsHide: true,
    stdio: ['ignore', out, out]
  }
)

child.unref()
console.log(`Vite 已启动，PID=${child.pid}，日志：.tools/vite.log`)