import type { OptionsType } from './bin';

export type NumRange = { min?: number } & { max?: number };

// TODO: Make this less hacky (remove GetPropDefault)
type ExtraOptionData<T extends keyof OptionsType> =
  GetPropDefault<OptionsType[T], 'multiple', false> extends true
    ? Array<StringToType<OptionsType[T]['type']>>
    : StringToType<OptionsType[T]['type']>;

export type ExtraOptionDataObject = {
  [K in keyof OptionsType]?: ExtraOptionData<K>;
};

type GetPropDefault<
  T extends object,
  U extends string,
  V extends boolean = false
> = U extends keyof T ? T[U] : V;

type ArgumentTypeMap = {
  string: string;
  boolean: boolean;
  number: number;
};
type StringToType<T extends keyof ArgumentTypeMap> =
  T extends keyof ArgumentTypeMap ? ArgumentTypeMap[T] :
  never;
