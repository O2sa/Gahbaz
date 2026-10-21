import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export const parsePagination = (query = {}, defaultLimit = 20, maxLimit = 100) => {
  const rawPage = parseInt(query?.page, 10);
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const parsedLimit = parseInt(query?.limit, 10);
  const rawLimit = Number.isInteger(parsedLimit) && parsedLimit >= 1 ? parsedLimit : defaultLimit;
  const limit = Math.min(rawLimit, maxLimit);

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const paginateQuery = async (
  modelOrQuery,
  filter = {},
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    populate = null,
    select = null,
  } = options;

  const skip = (page - 1) * limit;

  let queryBuilder = modelOrQuery.find(filter).sort(sort).skip(skip).limit(limit);

  if (populate) {
    queryBuilder = queryBuilder.populate(populate);
  }
  if (select) {
    queryBuilder = queryBuilder.select(select);
  }

  const [data, total] = await Promise.all([
    queryBuilder,
    modelOrQuery.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || (total === 0 ? 0 : 1);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, totalPages),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
