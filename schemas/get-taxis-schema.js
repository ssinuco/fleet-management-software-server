module.exports = {
  querystring: {
    type: "object",
    required: ["page", "pageSize"],
    properties: {
      search: { type: "string", nullable: true },
      page: { type: "integer" },
      pageSize: { type: "integer" },
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          plate: { type: "string" }
        }
      }
    }
  }
};
