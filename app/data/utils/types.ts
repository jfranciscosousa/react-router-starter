export type GenericDataError = Record<string, string>;

export type DataResult<TData> =
  | { data: TData; errors: null }
  | { data: null; errors: GenericDataError };
