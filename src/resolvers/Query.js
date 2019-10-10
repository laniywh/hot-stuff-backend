const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  // Or:
  // async items(parent, args, ctx, info) {
  //     const items = await ctx.db.query.items();
  //     return items;
  // }

  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  user: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if user logged in
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },

  async users(parent, args, ctx, info) {
    // 1. check if logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    // 2. check if user has permission to query all users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // 3. query all users
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
