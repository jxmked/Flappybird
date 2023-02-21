/**
 * Interactive
 */

import Game from './game';
import WebSfx from './lib/web-sfx';

export type IEventParam = MouseEvent | TouchEvent | KeyboardEvent;

export default (Game: Game) => {
  interface IMouse {
    down: boolean;
    position: ICoordinate;
  }

  let clicked: boolean = false;

  // Trigger the event once
  let hasMouseDown: boolean = false;
  let hasMouseUp: boolean = true;

  const mouse: IMouse = {
    down: false,
    position: {
      x: 0,
      y: 0
    }
  };

  const getBoundedPosition = ({ x, y }: ICoordinate): ICoordinate => {
    const { left, top, width, height } = Game.canvas.getBoundingClientRect();
    const dx: number = ((x - left) / width) * Game.canvas.width;
    const dy: number = ((y - top) / height) * Game.canvas.height;

    return { x: dx, y: dy };
  };

  const likeClickedEvent = () => {
    if (clicked) return;

    Game.onClick(mouse.position);
    clicked = true;
  };

  const mouseMove = ({ x, y }: ICoordinate, evt: IEventParam): void => {
    evt.preventDefault();
    mouse.position = getBoundedPosition({ x, y });
  };

  const mouseUP = (
    { x, y }: ICoordinate,
    evt: IEventParam,
    isRetreive: boolean
  ): void => {
    if (hasMouseUp) return;
    hasMouseUp = true;
    hasMouseDown = false;

    /**
     * Required due to autoplay restriction
     * */
    WebSfx.init();

    evt.preventDefault();
    if (!isRetreive) mouse.position = getBoundedPosition({ x, y });

    Game.mouseUp(mouse.position);
    mouse.down = false;
    clicked = false;
  };

  const mouseDown = ({ x, y }: ICoordinate, evt: IEventParam): void => {
    if (hasMouseDown) return;
    hasMouseUp = false;
    hasMouseDown = true;

    /**
     * Trigger multiple times
     * Required due to autoplay restriction
     * */
    WebSfx.init();

    evt.preventDefault();
    mouse.position = getBoundedPosition({ x, y });
    Game.mouseDown(mouse.position);
    mouse.down = true;

    if (mouse.down) {
      likeClickedEvent();
    }
  };

  // Mouse Event
  Game.canvas.addEventListener('mousedown', (evt: MouseEvent) => {
    let x = evt.clientX;
    let y = evt.clientY;

    mouseDown({ x, y }, evt);
  });

  Game.canvas.addEventListener('mouseup', (evt: MouseEvent) => {
    let x = evt.clientX;
    let y = evt.clientY;

    mouseUP({ x, y }, evt, false);
  });

  Game.canvas.addEventListener('mousemove', (evt: MouseEvent) => {
    let x = evt.clientX;
    let y = evt.clientY;

    mouseMove({ x, y }, evt);
  });

  // Touch Event
  Game.canvas.addEventListener('touchstart', (evt: TouchEvent) => {
    let x = evt.touches[0].clientX;
    let y = evt.touches[0].clientY;

    mouseDown({ x, y }, evt);
  });

  Game.canvas.addEventListener('touchend', (evt: TouchEvent) => {
    if (evt.touches.length < 1) {
      mouseUP(mouse.position, evt, true);
      return;
    }

    let x = evt.touches[0].clientX;
    let y = evt.touches[0].clientY;

    mouseUP({ x, y }, evt, false);
  });

  Game.canvas.addEventListener('touchmove', (evt: TouchEvent) => {
    let x = evt.touches[0].clientX;
    let y = evt.touches[0].clientY;

    mouseDown({ x, y }, evt);
  });

  // Keyboard event
  document.addEventListener('keydown', (evt: KeyboardEvent) => {
    const { key, keyCode, code } = evt;

    if (
      key === ' ' ||
      keyCode === 32 ||
      code === 'Space' ||
      key === 'Enter' ||
      keyCode === 13 ||
      code === 'NumpadEnter' ||
      code === 'Enter'
    ) {
      mouseDown(
        {
          x: Game.canvas.width / 2,
          y: Game.canvas.height / 2
        },
        evt
      );
    }
  });

  document.addEventListener('keyup', (evt: KeyboardEvent) => {
    const { key, keyCode, code } = evt;
    if (
      key === ' ' ||
      keyCode === 32 ||
      code === 'Space' ||
      key === 'Enter' ||
      keyCode === 13 ||
      code === 'NumpadEnter' ||
      code === 'Enter'
    ) {
      mouseUP(
        {
          x: Game.canvas.width / 2,
          y: Game.canvas.height / 2
        },
        evt,
        false
      );
    }
  });
};
