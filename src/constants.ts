import { IBirdColors } from './model/bird';

/**
 * Environment Contants
 */

// Pipe and Platform Speed should be the same
export const GAME_SPEED = 0.0058;

// Background Speed
export const BG_SPEED = 0.0002;

// Initial Canvas Size. Changing this may cause problem in some cases.
export const CANVAS_DIMENSION = {
  width: 500,
  height: 779
};

// Sound effect volume. (0 - 1)
export const SFX_VOLUME = 1;

/**
 * Bird
 */

// Jump Height. Based on canvas height. (Percentage 0 - 1)
export const BIRD_JUMP_HEIGHT = -0.008;

// Fixed X-Axis position of bird. Based on canvas width. (Percentage 0 - 1)
export const BIRD_X_POSITION = 0.15;

// Max angle of bird in degree
export const BIRD_MAX_ROTATION = 90;

// Minimum angle of bird in degree
export const BIRD_MIN_ROTATION = -15;

export const BIRD_HEIGHT = 0.1;

export const BIRD_WEIGHT = 0.00044;

export const BIRD_MAX_UP_VELOCITY = -0.3;

export const BIRD_MAX_DOWN_VELOCITY = 0.32;

export const BIRD_DEFAULT_COLOR: IBirdColors = 'yellow';

// Initial Dimension of a bird
/**
 * We are keeping the ratio of the bird to prevent ugly looking squish or squash image of bird
 */
export const BIRD_INITIAL_DIMENSION: IDimension = {
  width: 34,
  height: 24
};

/**
 * Pipe
 */

// Distance of pipe between max width of canvas and the last pipe. (0 - 1)
export const PIPE_DISTANCE = 0.38;

// Holl size of pipe. Based on canvas height. (0 - 1)
export const PIPE_HOLL_SIZE = 0.17;

// Minimum gap of pipe holl to very top and platform. Based on height. (0 - 1)
export const PIPE_MIN_GAP = 0.07;
