import * as migration_20260122_012810 from './20260122_012810';

export const migrations = [
  {
    up: migration_20260122_012810.up,
    down: migration_20260122_012810.down,
    name: '20260122_012810'
  },
];
