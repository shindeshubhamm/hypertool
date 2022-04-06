export interface IController {
  id: string;
  name: string;
  description: string;
  language: string;
  patched: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScreen {
  id: string;
  app: IApp;
  name: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  controller: IController;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApp {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  screens: IScreen[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TAppContext = IApp;

export interface ICraftNode {
  custom: {
    [key: string]: any;
  };
  nodes: string[];
  props: {
    [key: string]: any;
  };
  type: {
    resolvedName: string;
  };
  parent?: string;
}

export type TCraftNodeKey = keyof ICraftNode;

export type TBasicNodeType = "View" | "Fragment" | "Text";

export interface ISymbolReference {
  moduleId: string;
  target: string;
}

export type TPropertyValue =
  | number
  | boolean
  | string
  | null
  | object
  | ISymbolReference
  | undefined;

export interface IComponentProps extends Record<string, TPropertyValue> {
  id?: string;
}

export interface INode {
  /**
   * Each node has two identifiers: `node.internalId` and `node.props.id`.
   *
   * `node.internalId`:
   * It helps in internal bookkeeping of the nodes. It is mandatory, automatically
   * generated by CraftJS, and guaranteed to be unique across the screen.
   *
   * `node.props.id`:
   * It helps controllers select and apply actions on nodes. It is optional,
   * and assigned by the developer.
   *
   * Hypertool does not guarantee the prop ID to be unique across the screen.
   * It is the responsibility of the user to ensure the uniqueness.
   * App builder and generic host neither produce errors nor warnings for
   * duplicate prop IDs.
   */
  internalId: string;
  type: string | TBasicNodeType;
  children: INode[];
  props: IComponentProps;
  __hyperNode: true;
}

export interface IPatch {
  [key: string]: Record<string, TPropertyValue> | INode;
}

export type TQueryParams = Record<string, string | string[]>;

export type TQueryParamPair = [string, string];

export type TUpdateQueryParams =
  | string // "foo=bar&foo=soap"
  | TQueryParamPair[] // [["foo", "bar"], ["foo", "soap"]]
  | Record<string, string | string[]>; // { foo: ["bar", "soap"] }

export interface IHyperContext<S> {
  readonly queryParams: TQueryParams;

  readonly state: Record<string, S[keyof S]>;

  readonly refs: Record<string, any>;

  setQueryParams: (queryParams: TUpdateQueryParams) => void;

  setState: {
    (state: Partial<S>): void;
    (name: string, value: S[keyof S]): void;
  };

  inflate: (name: string, patches?: Record<string, IPatch>) => INode;
}

export interface IHyperController<T> {
  init?: (context: IHyperContext<T>) => void;
  render?: (context: IHyperContext<T>) => INode;
}
