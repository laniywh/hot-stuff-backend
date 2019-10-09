const { forwardTo } = require('prisma-binding');

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
};

module.exports = Query;
