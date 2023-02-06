/**
 * Interactive
 */

import Game from './game';
import WebSfx from './lib/web-sfx';

export default (Game: Game) => {
  interface IMouse {
    down: boolean;
    position: ICoordinate;
  }
  
  let clicked = false;

  const mouse: IMouse = {
    down: false,
    position: {
      x: 0,
      y: 0
    }
  };
  
  const likeClickedEvent = () => {
    if(clicked) return;
    
    Game.onClick(mouse.position);
    clicked = true;
  }

  const mouseMove = ({ x, y }: ICoordinate, evt: MouseEvent | TouchEvent | KeyboardEvent): void => {
    evt.preventDefault();
    mouse.position.x = x;
    mouse.position.y = y;
  };

  const mouseUP = ({ x, y }: ICoordinate, evt: MouseEvent | TouchEvent | KeyboardEvent): void => {
    evt.preventDefault();
    mouse.position.x = x;
    mouse.position.y = y;
    mouse.down = false;
    clicked = false;
  };

  const mouseDown = ({ x, y }: ICoordinate, evt: MouseEvent | TouchEvent | KeyboardEvent): void => {
    evt.preventDefault();
    mouse.position.x = x;
    mouse.position.y = y;
    mouse.down = true;
    
    WebSfx.initAudioContext();

    if (mouse.down) {
      likeClickedEvent();
    }
  };

  // Mouse Event
  Game.canvas.addEventListener('mousedown', (evt: MouseEvent) => {
    let x = evt.clientX;
    let y = evt.clientY;

    x = evt.pageX - Game.canvas.offsetLeft;
    y = evt.pageY - Game.canvas.offsetTop;
    mouseDown({ x, y }, evt);
  });

  Game.canvas.addEventListener('mouseup', (evt: MouseEvent) => {
    let x = evt.clientX;
    let y = evt.clientY;

    x = evt.pageX - Game.canvas.offsetLeft;
    y = evt.pageY - Game.canvas.offsetTop;
    mouseUP({ x, y }, evt);
  });

  Game.canvas.addEventListener('mousemove', (evt: MouseEvent) => {
    let x = evt.clientX;
    let y = evt.clientY;

    x = evt.pageX - Game.canvas.offsetLeft;
    y = evt.pageY - Game.canvas.offsetTop;
    mouseMove({ x, y }, evt);
  });

  // Touch Event
  Game.canvas.addEventListener('touchstart', (evt: TouchEvent) => {
    let x = evt.touches[0].clientX;
    let y = evt.touches[0].clientY;
    
    x = evt.touches[0].pageX - Game.canvas.offsetLeft;
    y = evt.touches[0].pageY - Game.canvas.offsetTop;
    mouseDown({ x, y }, evt);
  });

  Game.canvas.addEventListener('touchend', (evt: TouchEvent) => {
    if(evt.touches.length < 1 ) {
      
      mouseUP(mouse.position, evt);
      
      return;
    }
    let x = evt.touches[0].clientX;
    let y = evt.touches[0].clientY;

    x = evt.touches[0].pageX - Game.canvas.offsetLeft;
    y = evt.touches[0].pageY - Game.canvas.offsetTop;
    mouseUP({ x, y }, evt);
  });

  Game.canvas.addEventListener('touchmove', (evt: TouchEvent) => {
    let x = evt.touches[0].clientX;
    let y = evt.touches[0].clientY;
    x = evt.touches[0].pageX - Game.canvas.offsetLeft;
    y = evt.touches[0].pageY - Game.canvas.offsetTop;
    mouseDown({ x, y }, evt);
  });

  // Keyboard event
  document.addEventListener('keydown', (evt: KeyboardEvent) => {
    const { key, keyCode, code } = evt;

    if (key === ' ' || keyCode === 32 || code === 'Space') {
      mouseDown(
        {
          x: Game.canvas.width / 2,
          y: Game.canvas.height / 2
        },
        evt
      );
    }
  });
};
