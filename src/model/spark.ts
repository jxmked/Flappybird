import ParentClass from '../abstracts/parent-class';
import { rescaleDim, randomClamp } from '../utils';
import SpriteDestructor from '../lib/sprite-destructor';
import { TimingEvent } from '../lib/animation';

export default class Spark extends ParentClass {
  private images: Map<string, HTMLImageElement>;
  private scaled: IDimension;
  private status: string;
  private timingEvent: TimingEvent;
  private sparkList: string[];
  private currentSparkIndex: number;
  private dimension: IDimension;
  private target: ICoordinate;

  constructor() {
    super();
    this.images = new Map<string, HTMLImageElement>();
    this.timingEvent = new TimingEvent({
      diff: 200
    });
    this.scaled = {
      width: 0,
      height: 0
    };
    this.dimension = {
      width: 0,
      height: 0
    };
    this.target = {
      x: 0,
      y: 0
    };
    this.status = 'stopped';
    this.sparkList = [];
    this.currentSparkIndex = 0;
  }

  public init(): void {
    this.images.set('spark-sm', SpriteDestructor.asset('spark-sm'));
    this.images.set('spark-md', SpriteDestructor.asset('spark-md'));
    this.images.set('spark-lg', SpriteDestructor.asset('spark-lg'));
    this.sparkList = ['spark-sm', 'spark-md', 'spark-lg', 'spark-md', 'spark-sm'];
  }

  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.scaled = rescaleDim(
      {
        width: this.images.get('spark-lg')!.width,
        height: this.images.get('spark-lg')!.height
      },
      { width: width * 0.03 }
    );
  }

  public doSpark(): void {
    if (this.status === 'running') return;
    this.status = 'running';
    this.timingEvent.start();
  }

  public stop(): void {
    this.status = 'stopped';
    this.timingEvent.reset();
  }

  private relocate(): void {
    this.target.x = randomClamp(
      this.coordinate.x,
      this.coordinate.x + this.dimension.width
    );
    this.target.y = randomClamp(
      this.coordinate.y,
      this.coordinate.y + this.dimension.height
    );
  }

  public move({ x, y }: ICoordinate, dimension: IDimension): void {
    this.coordinate = { x, y };
    this.dimension = dimension;
  }

  public Update(): void {
    if (this.status === 'stopped') return;

    if (this.timingEvent.value) {
      if (this.currentSparkIndex > this.sparkList.length - 2) {
        this.currentSparkIndex = 0;
        this.relocate();
      } else {
        this.currentSparkIndex++;
      }
    }
  }

  public Display(context: CanvasRenderingContext2D): void {
    if (this.status === 'stopped') return;
    context.drawImage(
      this.images.get(this.sparkList[this.currentSparkIndex])!,
      Math.abs(this.target.x - this.scaled.width / 2),
      Math.abs(this.target.y - this.scaled.height / 2),
      this.scaled.width,
      this.scaled.height
    );
  }
}
