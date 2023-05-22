import {
  Cart,
  CollectionProductsOperation,
  Menu,
  Product,
  ProductOperation,
  ProductRecommendationsOperation
} from '@/lib/nestjs-server/types';
import { SERVER_GRAPHQL_API_ENDPOINT } from '@/lib/nestjs-server/constants';
import {
  getProductQuery,
  getProductRecommendationsQuery
} from '@/lib/nestjs-server/queries/product';
import { getCollectionProductsQuery } from '@/lib/nestjs-server/queries/collection';
import { getCartQuery } from '@/lib/nestjs-server/queries/cart';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from '@/lib/nestjs-server/mutations/cart';

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

export async function getProduct(id: string): Promise<Product | undefined> {
  const res = await serverFetch<ProductOperation>({
    query: getProductQuery,
    variables: {
      id
    }
  });

  return reshapeProduct(res.body.data.product);
}

export async function getCollectionProducts(id: string): Promise<Product[]> {
  const res = await serverFetch<CollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      id
    }
  });

  //console.log(res);

  return reshapeProducts(res.body.data.collection.products);
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

export async function getMenu(): Promise<Menu[]> {
  const menu: Menu[] = [
    {
      title: 'All',
      path: '/all'
    }
  ];
  return menu;
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

export async function createCart(): Promise<Cart> {
  const res = await serverFetch<CreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.createCart);
}

export type CreateCartOperation = {
  data: {
    createCart: Cart;
  };
};

const reshapeCart = (cart: Cart): Cart => {
  return {
    ...cart
  };
};

export type CartOperation = {
  data: {
    cart: Cart;
  };
  variables: {
    cartId: string;
  };
};

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

export type AddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: Cart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      productId: string;
      characteristicId?: string;
      quantity: number;
    }[];
  };
};

export type RemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: Cart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type UpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: Cart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      productId: string;
      characteristicId?: string;
      quantity: number;
    }[];
  };
};
