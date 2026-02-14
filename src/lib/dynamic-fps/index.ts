import raf from 'raf';
import createRAF, { targetFPS } from '@solid-primitives/raf';
import { LOCKABLE_FPS } from '../../constants';

export type LoopableFunction = (dt: number, runtime: number) => void;

export default class DynamicFps {
  public static IS_LOCK = true;

  private loop_function: LoopableFunction;
  private last_time: number;
  private begin_time: number;
  private primitiveRaf: ReturnType<typeof createRAF>;

  constructor() {
    this.last_time = 0;
    this.begin_time = 0;
    this.loop_function = (dt: number, runtime: number) => void 0;
    this.primitiveRaf = createRAF(targetFPS(this.loop.bind(this), LOCKABLE_FPS));
  }

  public add_loop_function(fn: LoopableFunction): void {
    this.loop_function = fn;
  }

  private loop() {
    const current = performance.now();
    const dt = (current - this.last_time) / 1000;

    this.last_time = current;

    this.loop_function(dt, (current - this.begin_time) / 1000);

    if (!DynamicFps.IS_LOCK) {
      this.primitiveRaf[2](); // Stop Primitive Raf
      raf(this.loop.bind(this));
    } else {
      this.primitiveRaf[1]();
    }
  }

  public start() {
    this.last_time = performance.now();
    this.begin_time = this.last_time;

    if (!this.primitiveRaf[0]()) {
      this.primitiveRaf[1]();
    }
  }
}
