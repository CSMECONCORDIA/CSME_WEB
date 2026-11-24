import * as migration_20260805_193122 from './20260805_193122';
import * as migration_20260805_203908 from './20260805_203908';

export const migrations = [
  {
    up: migration_20260805_193122.up,
    down: migration_20260805_193122.down,
    name: '20260805_193122',
  },
  {
    up: migration_20260805_203908.up,
    down: migration_20260805_203908.down,
    name: '20260805_203908'
  },
];
