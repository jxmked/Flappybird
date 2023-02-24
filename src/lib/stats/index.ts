interface ITextProperties {
  position: ICoordinate;
  preText: string;
  postText: string;
}

interface IContainerProperties {
  startingPoint: ICoordinate;
  endPoint: ICoordinate;
}

export default class Stats {
  private fps: number;
  private timeArray: number[];
  private context: CanvasRenderingContext2D;
  private containerOpacity: number;
  private textProps: ITextProperties;
  private containerProps: IContainerProperties;

  constructor(context: CanvasRenderingContext2D) {
    this.fps = 0;
    this.timeArray = [];
    this.context = context;
    this.containerOpacity = 0.4;
    this.textProps = {
      position: { x: 0, y: 0 },
      preText: '',
      postText: ''
    };
    this.containerProps = {
      startingPoint: {
        x: 0,
        y: 0
      },
      endPoint: {
        x: 0,
        y: 0
      }
    };
  }

  public text(pos: ICoordinate, preText: string, postText: string): void {
    this.textProps.position = pos;
    this.textProps.preText = preText;
    this.textProps.postText = postText;
  }

  public container(aPoint: ICoordinate, bPoint: ICoordinate): void {
    this.containerProps = {
      startingPoint: aPoint,
      endPoint: bPoint
    };
  }

  public mark(): void {
    const now = performance.now();

    while (this.timeArray.length > 0 && this.timeArray[0] <= now - 1000) {
      this.timeArray.shift();
    }

    this.timeArray.push(now);
    this.fps = this.timeArray.length;

    this.drawContainer();
    this.drawText(String(this.fps));
  }

  private drawContainer(): void {
    const ctx = this.context;
    const { startingPoint, endPoint } = this.containerProps;

    ctx.beginPath();
    ctx.globalAlpha = this.containerOpacity;
    ctx.fillStyle = '#1e1e20';
    ctx.fillRect(startingPoint.x, startingPoint.y, endPoint.x, endPoint.y);
    ctx.fill();
    ctx.closePath();
  }

  private drawText(text: string) {
    const ctx = this.context;
    const { preText, postText, position } = this.textProps;
    const out = `${preText}${text}${postText}`;

    ctx.beginPath();
    ctx.globalAlpha = 1; // Required
    ctx.font = '30px monospace';
    ctx.fillStyle = '#58d130';
    ctx.textAlign = 'left';
    ctx.fillText(out, position.x, position.y);
    ctx.closePath();
  }
}
