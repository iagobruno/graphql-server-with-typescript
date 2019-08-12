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

/** Default connection shape */
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
  authorId: Scalars["String"];
  content: Scalars["String"];
};

export type GraphQLMutation = {
  /** Create a new tweet. */
  createTweet: GraphQLTweet;
  /** Delete a specific tweet by id. */
  deleteTweet: Scalars["String"];
};

export type GraphQLMutationCreateTweetArgs = {
  input: GraphQLCreateTweetInput;
};

export type GraphQLMutationDeleteTweetArgs = {
  id: Scalars["ID"];
};

/** Default node shape */
export type GraphQLNode = {
  /** ID of the object */
  id: Scalars["ID"];
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["Timestamp"];
};

/** Default pageInfo shape to aid in pagination. */
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
  /** Get latest tweets. */
  tweets: GraphQLTweetConnection;
  /** Get a specific tweet by id. */
  tweet?: Maybe<GraphQLTweet>;
};

export type GraphQLQueryTweetsArgs = {
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["ID"]>;
  ofUser?: Maybe<Scalars["ID"]>;
};

export type GraphQLQueryTweetArgs = {
  id: Scalars["ID"];
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

/** A user is an individual's account on server */
export type GraphQLUser = GraphQLNode & {
  id: Scalars["ID"];
  name: Scalars["String"];
  photo: Scalars["String"];
  /** Get latest user tweets. */
  tweets: GraphQLTweetConnection;
  /** The HTTP url for this user */
  url: Scalars["String"];
  createdAt: Scalars["Timestamp"];
};

/** A user is an individual's account on server */
export type GraphQLUserTweetsArgs = {
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["ID"]>;
};

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
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  TweetConnection: ResolverTypeWrapper<GraphQLTweetConnection>;
  Connection: ResolverTypeWrapper<GraphQLConnection>;
  Node: ResolverTypeWrapper<GraphQLNode>;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]>;
  PageInfo: ResolverTypeWrapper<GraphQLPageInfo>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Tweet: ResolverTypeWrapper<GraphQLTweet>;
  User: ResolverTypeWrapper<GraphQLUser>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Mutation: ResolverTypeWrapper<{}>;
  CreateTweetInput: GraphQLCreateTweetInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type GraphQLResolversParentTypes = {
  Query: {};
  Int: Scalars["Int"];
  ID: Scalars["ID"];
  TweetConnection: GraphQLTweetConnection;
  Connection: GraphQLConnection;
  Node: GraphQLNode;
  Timestamp: Scalars["Timestamp"];
  PageInfo: GraphQLPageInfo;
  Boolean: Scalars["Boolean"];
  Tweet: GraphQLTweet;
  User: GraphQLUser;
  String: Scalars["String"];
  Mutation: {};
  CreateTweetInput: GraphQLCreateTweetInput;
};

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

export type GraphQLMutationResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Mutation"] = GraphQLResolversParentTypes["Mutation"]
> = {
  createTweet?: Resolver<
    GraphQLResolversTypes["Tweet"],
    ParentType,
    ContextType,
    GraphQLMutationCreateTweetArgs
  >;
  deleteTweet?: Resolver<
    GraphQLResolversTypes["String"],
    ParentType,
    ContextType,
    GraphQLMutationDeleteTweetArgs
  >;
};

export type GraphQLNodeResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["Node"] = GraphQLResolversParentTypes["Node"]
> = {
  __resolveType: TypeResolveFn<"Tweet" | "User", ParentType, ContextType>;
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

export type GraphQLUserResolvers<
  ContextType = any,
  ParentType extends GraphQLResolversParentTypes["User"] = GraphQLResolversParentTypes["User"]
> = {
  id?: Resolver<GraphQLResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  photo?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  tweets?: Resolver<
    GraphQLResolversTypes["TweetConnection"],
    ParentType,
    ContextType,
    RequireFields<GraphQLUserTweetsArgs, "first">
  >;
  url?: Resolver<GraphQLResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<
    GraphQLResolversTypes["Timestamp"],
    ParentType,
    ContextType
  >;
};

export type GraphQLResolvers<ContextType = any> = {
  Connection?: GraphQLConnectionResolvers;
  Mutation?: GraphQLMutationResolvers<ContextType>;
  Node?: GraphQLNodeResolvers;
  PageInfo?: GraphQLPageInfoResolvers<ContextType>;
  Query?: GraphQLQueryResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Tweet?: GraphQLTweetResolvers<ContextType>;
  TweetConnection?: GraphQLTweetConnectionResolvers<ContextType>;
  User?: GraphQLUserResolvers<ContextType>;
};
