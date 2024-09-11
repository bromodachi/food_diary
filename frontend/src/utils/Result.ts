export type Result<S, F> = Success<S> | Failure<F>;

export class Success<S> {
  readonly tag = "success" as const;
  constructor(public value: S) {}
}

export class Failure<F> {
  readonly tag = "failure" as const;
  constructor(public value: F) {}
}
