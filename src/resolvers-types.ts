import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** JavaScript date timestamp. */
  Timestamp: any;
};

/** Default connection shape. */
export type GraphQLConnection = {
  /** A list of nodes. */
  nodes: Array<GraphQLNode>;
  /** Information to aid in pagination. */
  pageInfo: GraphQLPageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars["Int"];
};

/** New tweet infos. */
export type GraphQLCreateTweetInput = {
  content: Scalars["String"];
};

export type GraphQLCreateTweetResponse = GraphQLMutationResponse & {
  success: Scalars["Boolean"];
  message: Scalars["String"];
  node: GraphQLTweet;
};

export type GraphQLDeleteMeResponse = GraphQLMutationResponse & {
  success: Scalars["Boolean"];
  message: Scalars["String"];
};

export type GraphQLDeleteTweetResponse = GraphQLMutationResponse & {
  success: Scalars["Boolean"];
  message: Scalars["String"];
};

export type GraphQLJwtToken = {
  /** The token that you can use to authenticate in requests */
  token: Scalars["String"];
  expiresIn: Scalars["Timestamp"];
};

export type GraphQLMutation = {
  /** Create a new token for the user. It Creates a new user if no user with this name is found. */
  auth: GraphQLJwtToken;
  /** Update the infos of currently authenticated user. */
  updateMe?: Maybe<GraphQLUpdateMeResponse>;
  /** Delete the currently authenticated user. */
  deleteMe: GraphQLDeleteMeResponse;
  /** Create a new tweet. */
  createTweet: GraphQLCreateTweetResponse;
  /** Delete a specific tweet by id. */
  deleteTweet: GraphQLDeleteTweetResponse;
};

export type GraphQLMutationAuthArgs = {
  username: Scalars["String"];
};

export type GraphQLMutationUpdateMeArgs = {
  input: GraphQLUpdateMeInput;
};

export type GraphQLMutationCreateTweetArgs = {
  input: GraphQLCreateTweetInput;
};

export type GraphQLMutationDeleteTweetArgs = {
  id: Scalars["ID"];
};

/** Default mutation response shape. */
export type GraphQLMutationResponse = {
  success: Scalars["Boolean"];
  /** message to show for the user. */
  message: Scalars["String"];
};

/** Default node shape. */
export type GraphQLNode = {
  /** ID of the object */
  id: Scalars["ID"];
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["Timestamp"];
};

/** Default "pageInfo" object shape to aid in pagination. */
export type GraphQLPageInfo = {
  /** The number of elements in the list */
  size: Scalars["Int"];
  /** The id of the first list item */
  startCursor?: Maybe<Scalars["ID"]>;
  /** The id of the last list item */
  endCursor?: Maybe<Scalars["ID"]>;
  /** Indicates if there are more pages to fetch. */
  hasNextPage: Scalars["Boolean"];
  /** Indicates if there are any pages prior to the current page */
  hasPreviousPage: Scalars["Boolean"];
};

export type GraphQLQuery = {
  /** The currently authenticated user. */
  me?: Maybe<GraphQLUser>;
  /** Get a specific user by id. */
  user?: Maybe<GraphQLUser>;
  /** Get latest tweets. */
  tweets: GraphQLTweetConnection;
  /** Get a specific tweet by id. */
  tweet?: Maybe<GraphQLTweet>;
};

export type GraphQLQueryUserArgs = {
  id: Scalars["ID"];
};

export type GraphQLQueryTweetsArgs = {
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["ID"]>;
  ofUser?: Maybe<Scalars["ID"]>;
};

export type GraphQLQueryTweetArgs = {
  id: Scalars["ID"];
};

export type GraphQLSubscription = {
  /** Listening for new tweets. */
  tweetAdded: GraphQLTweet;
  /** Listening for new users. */
  userAdded: GraphQLUser;
};

/** A tweet is ephemeral text posted by a user. */
export type GraphQLTweet = GraphQLNode & {
  id: Scalars["ID"];
  authorId: Scalars["ID"];
  author?: Maybe<GraphQLUser>;
  /** The text of tweet */
  content: Scalars["String"];
  /** The HTTP url for this tweet */
  url: Scalars["String"];
  createdAt: Scalars["Timestamp"];
};

/** A list of tweets owned by the subject. */
export type GraphQLTweetConnection = GraphQLConnection & {
  /** A list of nodes. */
  nodes: Array<GraphQLTweet>;
  /** Information to aid in pagination. */
  pageInfo: GraphQLPageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars["Int"];
};

export type GraphQLUpdateMeInput = {
  /** The new name of the user */
  username?: Maybe<Scalars["String"]>;
};

export type GraphQLUpdateMeResponse = GraphQLMutationResponse & {
  success: Scalars["Boolean"];
  message: Scalars["String"];
  node?: Maybe<GraphQLUser>;
};

/** A user is an individual's account on server. */
export type GraphQLUser = GraphQLNode & {
  id: Scalars["ID"];
  username: Scalars["String"];
  photo: Scalars["String"];
  role: GraphQLUserRole;
  /** The HTTP url for this user */
  url: Scalars["String"];
  createdAt: Scalars["Timestamp"];
  /** Get latest user tweets. */
  tweets: GraphQLTweetConnection;
};

/** A user is an individual's account on server. */
export type GraphQLUserTweetsArgs = {
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["ID"]>;
};

export enum GraphQLUserRole {
  Admin = "ADMIN",
  User = "USER"
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GraphQLResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<GraphQLUser>;
  Node: ResolverTypeWrapper<GraphQLNode>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  UserRole: GraphQLUserRole;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  TweetConnection: ResolverTypeWrapper<GraphQLTweetConnection>;
  Connection: ResolverTypeWrapper<GraphQLConnection>;
  PageInfo: ResolverTypeWrapper<GraphQLPageInfo>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Tweet: ResolverTypeWrapper<GraphQLTweet>;
  Mutation: ResolverTypeWrapper<{}>;
  JWTToken: ResolverTypeWrapper<GraphQLJwtToken>;
  UpdateMeInput: GraphQLUpdateMeInput;
  UpdateMeResponse: ResolverTypeWrapper<GraphQLUpdateMeResponse>;
  MutationResponse: ResolverTypeWrapper<GraphQLMutationResponse>;
  DeleteMeResponse: ResolverTypeWrapper<GraphQLDeleteMeResponse>;
  CreateTweetInput: GraphQLCreateTweetInput;
  CreateTweetResponse: ResolverTypeWrapper<GraphQLCreateTweetResponse>;
  DeleteTweetResponse: ResolverTypeWrapper<GraphQLDeleteTweetResponse>;
  Subscription: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GraphQLResolversParentTypes = {
  Query: {};
  User: GraphQLUser;
  Node: GraphQLNode;
  ID: Scalars["ID"];
  Timestamp: Scalars["Timestamp"];
  String: Scalars["String"];
  UserRole: GraphQLUserRole;
  Int: Scalars["Int"];
  TweetConnection: GraphQLTweetConnection;
  Connection: GraphQLConnection;
  PageInfo: GraphQLPageInfo;
  Boolean: Scalars["Boolean"];
  Tweet: GraphQLTweet;
  Mutation: {};
  JWTToken: GraphQLJwtToken;
  UpdateMeInput: GraphQLUpdateMeInput;
  UpdateMeResponse: GraphQLUpdateMeResponse;
  MutationResponse: GraphQLMutationResponse;
  DeleteMeResponse: GraphQLDeleteMeResponse;
  CreateTweetInput: GraphQLCreateTweetInput;
  CreateTweetResponse: GraphQLCreateTweetResponse;
  DeleteTweetResponse: GraphQLDeleteTweetResponse;
  Subscription: {};
};

export type GraphQLCostDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    complexity?: Maybe<Scalars["Int"]>;
    multipliers?: Maybe<Maybe<Array<Scalars["String"]>>>;
    useMultipliers?: Maybe<Maybe<Scalars["Boolean"]>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphQLConnectionResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Connection"] = GraphQLResolversParentTypes["Connection"]
> = {
  __resolveType: TypeResolveFn<"TweetConnection", ParentType, ContextType>;
  nodes?: Resolver<
    Array<GraphQLResolversTypes["Node"]>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<
    GraphQLResolversTypes["PageInfo"],
    ParentType,
    ContextType
  >;
  totalCount?: Resolver<GraphQLResolversTypes["Int"], ParentType, ContextType>;
};

export type GraphQLCreateTweetResponseResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["CreateTweetResponse"] = GraphQLResolversParentTypes["CreateTweetResponse"]
> = {
  success?: Resolver<GraphQLResolversTypes["Boolean"], ParentType, ContextType>;
  message?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<GraphQLResolversTypes["Tweet"], ParentType, ContextType>;
};

export type GraphQLDeleteMeResponseResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["DeleteMeResponse"] = GraphQLResolversParentTypes["DeleteMeResponse"]
> = {
  success?: Resolver<GraphQLResolversTypes["Boolean"], ParentType, ContextType>;
  message?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
};

export type GraphQLDeleteTweetResponseResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["DeleteTweetResponse"] = GraphQLResolversParentTypes["DeleteTweetResponse"]
> = {
  success?: Resolver<GraphQLResolversTypes["Boolean"], ParentType, ContextType>;
  message?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
};

export type GraphQLJwtTokenResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["JWTToken"] = GraphQLResolversParentTypes["JWTToken"]
> = {
  token?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  expiresIn?: Resolver<
    GraphQLResolversTypes["Timestamp"],
    ParentType,
    ContextType
  >;
};

export type GraphQLMutationResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Mutation"] = GraphQLResolversParentTypes["Mutation"]
> = {
  auth?: Resolver<
    GraphQLResolversTypes["JWTToken"],
    ParentType,
    ContextType,
    GraphQLMutationAuthArgs
  >;
  updateMe?: Resolver<
    Maybe<GraphQLResolversTypes["UpdateMeResponse"]>,
    ParentType,
    ContextType,
    GraphQLMutationUpdateMeArgs
  >;
  deleteMe?: Resolver<
    GraphQLResolversTypes["DeleteMeResponse"],
    ParentType,
    ContextType
  >;
  createTweet?: Resolver<
    GraphQLResolversTypes["CreateTweetResponse"],
    ParentType,
    ContextType,
    GraphQLMutationCreateTweetArgs
  >;
  deleteTweet?: Resolver<
    GraphQLResolversTypes["DeleteTweetResponse"],
    ParentType,
    ContextType,
    GraphQLMutationDeleteTweetArgs
  >;
};

export type GraphQLMutationResponseResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["MutationResponse"] = GraphQLResolversParentTypes["MutationResponse"]
> = {
  __resolveType: TypeResolveFn<
    | "UpdateMeResponse"
    | "DeleteMeResponse"
    | "CreateTweetResponse"
    | "DeleteTweetResponse",
    ParentType,
    ContextType
  >;
  success?: Resolver<GraphQLResolversTypes["Boolean"], ParentType, ContextType>;
  message?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
};

export type GraphQLNodeResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Node"] = GraphQLResolversParentTypes["Node"]
> = {
  __resolveType: TypeResolveFn<"User" | "Tweet", ParentType, ContextType>;
  id?: Resolver<GraphQLResolversTypes["ID"], ParentType, ContextType>;
  createdAt?: Resolver<
    GraphQLResolversTypes["Timestamp"],
    ParentType,
    ContextType
  >;
};

export type GraphQLPageInfoResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["PageInfo"] = GraphQLResolversParentTypes["PageInfo"]
> = {
  size?: Resolver<GraphQLResolversTypes["Int"], ParentType, ContextType>;
  startCursor?: Resolver<
    Maybe<GraphQLResolversTypes["ID"]>,
    ParentType,
    ContextType
  >;
  endCursor?: Resolver<
    Maybe<GraphQLResolversTypes["ID"]>,
    ParentType,
    ContextType
  >;
  hasNextPage?: Resolver<
    GraphQLResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  hasPreviousPage?: Resolver<
    GraphQLResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
};

export type GraphQLQueryResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Query"] = GraphQLResolversParentTypes["Query"]
> = {
  me?: Resolver<Maybe<GraphQLResolversTypes["User"]>, ParentType, ContextType>;
  user?: Resolver<
    Maybe<GraphQLResolversTypes["User"]>,
    ParentType,
    ContextType,
    GraphQLQueryUserArgs
  >;
  tweets?: Resolver<
    GraphQLResolversTypes["TweetConnection"],
    ParentType,
    ContextType,
    RequireFields<GraphQLQueryTweetsArgs, "first">
  >;
  tweet?: Resolver<
    Maybe<GraphQLResolversTypes["Tweet"]>,
    ParentType,
    ContextType,
    GraphQLQueryTweetArgs
  >;
};

export type GraphQLSubscriptionResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Subscription"] = GraphQLResolversParentTypes["Subscription"]
> = {
  tweetAdded?: SubscriptionResolver<
    GraphQLResolversTypes["Tweet"],
    ParentType,
    ContextType
  >;
  userAdded?: SubscriptionResolver<
    GraphQLResolversTypes["User"],
    ParentType,
    ContextType
  >;
};

export interface GraphQLTimestampScalarConfig
  extends GraphQLScalarTypeConfig<GraphQLResolversTypes["Timestamp"], any> {
  name: "Timestamp";
}

export type GraphQLTweetResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Tweet"] = GraphQLResolversParentTypes["Tweet"]
> = {
  id?: Resolver<GraphQLResolversTypes["ID"], ParentType, ContextType>;
  authorId?: Resolver<GraphQLResolversTypes["ID"], ParentType, ContextType>;
  author?: Resolver<
    Maybe<GraphQLResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
  content?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  url?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<
    GraphQLResolversTypes["Timestamp"],
    ParentType,
    ContextType
  >;
};

export type GraphQLTweetConnectionResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["TweetConnection"] = GraphQLResolversParentTypes["TweetConnection"]
> = {
  nodes?: Resolver<
    Array<GraphQLResolversTypes["Tweet"]>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<
    GraphQLResolversTypes["PageInfo"],
    ParentType,
    ContextType
  >;
  totalCount?: Resolver<GraphQLResolversTypes["Int"], ParentType, ContextType>;
};

export type GraphQLUpdateMeResponseResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["UpdateMeResponse"] = GraphQLResolversParentTypes["UpdateMeResponse"]
> = {
  success?: Resolver<GraphQLResolversTypes["Boolean"], ParentType, ContextType>;
  message?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<
    Maybe<GraphQLResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
};

export type GraphQLUserResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["User"] = GraphQLResolversParentTypes["User"]
> = {
  id?: Resolver<GraphQLResolversTypes["ID"], ParentType, ContextType>;
  username?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  photo?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  role?: Resolver<GraphQLResolversTypes["UserRole"], ParentType, ContextType>;
  url?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<
    GraphQLResolversTypes["Timestamp"],
    ParentType,
    ContextType
  >;
  tweets?: Resolver<
    GraphQLResolversTypes["TweetConnection"],
    ParentType,
    ContextType,
    RequireFields<GraphQLUserTweetsArgs, "first">
  >;
};

export type GraphQLResolvers<ContextType = any> = {
  Connection?: GraphQLConnectionResolvers;
  CreateTweetResponse?: GraphQLCreateTweetResponseResolvers<ContextType>;
  DeleteMeResponse?: GraphQLDeleteMeResponseResolvers<ContextType>;
  DeleteTweetResponse?: GraphQLDeleteTweetResponseResolvers<ContextType>;
  JWTToken?: GraphQLJwtTokenResolvers<ContextType>;
  Mutation?: GraphQLMutationResolvers<ContextType>;
  MutationResponse?: GraphQLMutationResponseResolvers;
  Node?: GraphQLNodeResolvers;
  PageInfo?: GraphQLPageInfoResolvers<ContextType>;
  Query?: GraphQLQueryResolvers<ContextType>;
  Subscription?: GraphQLSubscriptionResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Tweet?: GraphQLTweetResolvers<ContextType>;
  TweetConnection?: GraphQLTweetConnectionResolvers<ContextType>;
  UpdateMeResponse?: GraphQLUpdateMeResponseResolvers<ContextType>;
  User?: GraphQLUserResolvers<ContextType>;
};

export type GraphQLDirectiveResolvers<ContextType = any> = {
  cost?: GraphQLCostDirectiveResolver<any, any, ContextType>;
};
