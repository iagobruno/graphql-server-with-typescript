import { GraphQLPageInfo, GraphQLNode } from './resolvers-types'

type PaginatedResponseArgs<Node> = {
  allNodes: Node[],
  nodes: Node[],
  firstArg: number,
  startIndex: number,
}

/**
 * @returns An object with the default format for GraphQL paginations.
 */
export function generatePaginatedConnection<NodeType extends GraphQLNode>({ allNodes, nodes, firstArg, startIndex }: PaginatedResponseArgs<NodeType>) {
  const hasAtLeast1Item = (nodes.length >= 1)
  const pageInfo: GraphQLPageInfo = {
    size: Math.min(firstArg, nodes.length),
    startCursor: hasAtLeast1Item ? nodes[0].id : null,
    endCursor: hasAtLeast1Item ? nodes[nodes.length-1].id : null,
    hasPreviousPage: startIndex > 0,
    hasNextPage: (startIndex + firstArg) < allNodes.length,
  }

  return {
    nodes,
    pageInfo,
    totalCount: allNodes.length
  };
}
