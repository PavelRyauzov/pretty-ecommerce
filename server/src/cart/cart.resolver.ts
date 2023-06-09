import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartLineInput, CartLineUpdateInput } from '../graphql';

@Resolver('Cart')
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query('cart')
  async cart(@Args('id') id: string) {
    const cart = await this.cartService.findById(parseInt(id));
    return cart;
  }

  @Mutation('createCart')
  async create(@Args('input') inputs: CartLineInput[]) {
    const cart = await this.cartService.create(inputs);
    return cart;
  }

  @Mutation('cartLinesAdd')
  async addLines(
    @Args('cartId') cartId: string,
    @Args('lines') lines: CartLineInput[],
  ) {
    const cart = await this.cartService.addLines(parseInt(cartId), lines);
    return cart;
  }

  @Mutation('cartLinesRemove')
  async removeLines(
    @Args('cartId') cartId: string,
    @Args('lineIds') lineIds: string[],
  ) {
    const cart = await this.cartService.removeLines(parseInt(cartId), lineIds);
    return cart;
  }

  @Mutation('cartLinesUpdate')
  async updateLines(
    @Args('cartId') cartId: string,
    @Args('lines') lines: CartLineUpdateInput[],
  ) {
    const cart = await this.cartService.updateLines(parseInt(cartId), lines);
    return cart;
  }
}
