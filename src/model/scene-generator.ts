import { randomClamp } from '../utils';
import { ITheme } from './background';
import { IBirdColor } from './bird';
import { IPipeColor } from './pipe';

export default class SceneGenerator {
  public static birdColorList: IBirdColor[] = [];
  public static bgThemeList: ITheme[] = [];
  public static pipeColorList: IPipeColor[] = [];
  private static isNight = false;

  public static get background(): ITheme {
    if (SceneGenerator.bgThemeList.length < 1) throw new Error('No theme available');

    const t =
      SceneGenerator.bgThemeList[randomClamp(0, SceneGenerator.bgThemeList.length)];
    SceneGenerator.isNight = t === 'night';
    return t;
  }

  public static get bird(): IBirdColor {
    if (SceneGenerator.birdColorList.length < 1)
      throw new Error('No available bird color');

    return SceneGenerator.birdColorList[
      randomClamp(0, SceneGenerator.birdColorList.length)
    ];
  }

  public static get pipe(): IPipeColor {
    if (SceneGenerator.pipeColorList.length < 1)
      throw new Error('No available pipe color');

    if (SceneGenerator.isNight) {
      return SceneGenerator.pipeColorList[
        randomClamp(0, SceneGenerator.pipeColorList.length)
      ];
    }

    return 'green' as IPipeColor;
  }
}
