module.exports = {
  querystring: {
    type: "object",
    properties: {
      date: { type: "string", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}" },
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          taxiId: { type: "string" },
          date: { type: "string" },
          latitude: { type: "number" },
          longitude: { type: "number" },
        }
      }
    }
  }
};
