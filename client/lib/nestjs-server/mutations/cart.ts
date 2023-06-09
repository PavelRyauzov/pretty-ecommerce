import cartFragment from '@/lib/nestjs-server/fragments/cart';

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!]) {
    createCart(input: $lineItems) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = /* GraphQL */ `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
            ...cart
        }
    }
    ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            ...cart
        }
    }
    ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
    mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
            ...cart
        }
    }
    ${cartFragment}
`;
