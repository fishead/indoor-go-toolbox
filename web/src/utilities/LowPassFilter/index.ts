interface LowPassFilterParams<T> {
  cutoff: number;
  frequencyPluck: (v: T) => number;
}

export class LowPassFilter<T> {
  private cutoff: number;
  private frequencyPluck: (v: T) => number;

  constructor(params: LowPassFilterParams<T>) {
    this.cutoff = params.cutoff;
    this.frequencyPluck = params.frequencyPluck;
  }

  process(v: T): T | null {
    return this.frequencyPluck(v) > this.cutoff ? null : v;
  }
}

export default LowPassFilter;
