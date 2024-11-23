import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    userName: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    //if user already exist
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email)).collect();

      //if user not present, then insert new user entry
      if(user?.length === 0){
        await ctx.db.insert('users', {
          email: args.email,
          userName: args.userName,
          imageUrl: args.imageUrl,
          upgrade: false
        });
        return "Inserted New User...";
      }
      return "User already Exists";
  },
});

export const userUpgradePlan = mutation({
  args: {
    userEmail:v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.userEmail) {
      throw new Error("Missing required field: userEmail");
    }

    const result = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.userEmail))
      .collect();

    if (result.length > 0) {
      await ctx.db.patch(result[0]._id, { upgrade: true });
      return "Success";
    }

    throw new Error("User not found or unable to upgrade plan.");
  }
});

export const getUserInfo = query({
  args: {
    userEmail:v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if(!args.userEmail){
      return;
    }
    const result = await ctx.db.query('users')
    .filter(q=>q.eq(q.field('email'), args.userEmail))
    .collect();
    return result[0];
  }
})