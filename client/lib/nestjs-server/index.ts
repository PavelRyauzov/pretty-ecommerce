import {
  AddToCartOperation,
  Cart,
  CartOperation,
  Collection,
  CollectionOperation,
  CollectionProductsOperation,
  CollectionsOperation,
  Connection,
  CreateCartOperation,
  CreateOrderOperation,
  FrontCollection,
  Menu,
  Order,
  OrderOperation,
  Product,
  ProductOperation,
  ProductRecommendationsOperation,
  ProductsForDemonstrationOperation,
  ProductsOperation,
  RemoveFromCartOperation,
  UpdateCartOperation
} from '@/lib/nestjs-server/types';
import { SERVER_GRAPHQL_API_ENDPOINT } from '@/lib/constants';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsForDemonstrationQuery,
  getProductsQuery
} from '@/lib/nestjs-server/queries/product';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from '@/lib/nestjs-server/queries/collection';
import { getCartQuery } from '@/lib/nestjs-server/queries/cart';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from '@/lib/nestjs-server/mutations/cart';
import { getOrderQuery } from '@/lib/nestjs-server/queries/order';
import { createOrderMutation } from '@/lib/nestjs-server/mutations/order';

const domain = `http://${process.env.SERVER_DOMAIN!}`;
const endpoint = `${domain}${SERVER_GRAPHQL_API_ENDPOINT}`;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function serverFetch<T>({
  query,
  variables,
  headers,
  cache = 'force-cache'
}: {
  query: string;
  variables?: ExtractVariables<T>;
  headers?: HeadersInit;
  cache?: RequestCache;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      next: { revalidate: 900 } // 15 minutes
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: Cart): Cart => {
  return {
    ...cart
  };
};

const reshapeOrder = (order: Order): Order => {
  return {
    ...order
  };
};

const reshapeCollection = (collection: Collection): FrontCollection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.id}`
  };
};

const reshapeCollections = (collections: Collection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeProduct = (product: Product) => {
  if (!product) {
    return undefined;
  }

  return {
    ...product
  };
};

const reshapeProducts = (products: Product[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await serverFetch<CreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.createCart);
}

export async function addToCart(
  cartId: string,
  lines: { productId: string; characteristicId?: string; quantity: number }[]
): Promise<Cart> {
  const res = await serverFetch<AddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await serverFetch<RemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; productId: string; characteristicId?: string; quantity: number }[]
): Promise<Cart> {
  const res = await serverFetch<UpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const res = await serverFetch<CartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  });

  if (!res.body.data.cart) {
    return null;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await serverFetch<CollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts(id: string): Promise<Product[]> {
  const res = await serverFetch<CollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      id
    }
  });

  return reshapeProducts(res.body.data.collection.products);
}

export async function getCollections(): Promise<FrontCollection[]> {
  const res = await serverFetch<CollectionsOperation>({ query: getCollectionsQuery });
  const serverCollections = res.body?.data?.collections;
  const collections = [
    {
      id: '',
      title: 'All',
      path: '/search'
    },

    ...reshapeCollections(serverCollections)
  ];

  return collections;
}

export async function getMenu(): Promise<Menu[]> {
  const menu: Menu[] = [
    {
      title: 'All',
      path: '/search'
    }
  ];
  return menu;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const res = await serverFetch<ProductOperation>({
    query: getProductQuery,
    variables: {
      id
    }
  });

  return reshapeProduct(res.body.data.product);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await serverFetch<ProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await serverFetch<ProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductsForDemonstration(): Promise<Product[]> {
  const res = await serverFetch<ProductsForDemonstrationOperation>({
    query: getProductsForDemonstrationQuery
  });

  return reshapeProducts(res.body.data.productsForDemonstration);
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const res = await serverFetch<OrderOperation>({
    query: getOrderQuery,
    variables: { orderId },
    cache: 'no-store'
  });

  if (!res.body.data.order) {
    return null;
  }

  return reshapeOrder(res.body.data.order);
}

export async function createOrder(
  dataInput: {
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    address: string;
    zipCode: string;
  },
  linesInput: { productId: string; characteristicId?: string; quantity: number }[]
): Promise<Order> {
  const res = await serverFetch<CreateOrderOperation>({
    query: createOrderMutation,
    variables: {
      dataInput,
      linesInput
    },
    cache: 'no-store'
  });

  return reshapeOrder(res.body.data.createOrder);
}
