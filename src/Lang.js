
Lang = new JS.Class({
    hitch: function(ctx, func, args)
    {
      if (typeof func == 'string') {
        func = ctx[func];
      }
      
      return function() {
        return func.apply(ctx, arguments || []);
      };
    },
});
