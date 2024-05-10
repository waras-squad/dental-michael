import { Gender } from '@/enum';
import { GetPatientSortBy } from '@/validators';

type SwaggarParameter = {
  in: string;
  name: string;
  description?: string;
  schema: Record<string, unknown>;
};

export const getAllPatientFilterSwaggerParameter: SwaggarParameter[] = [
  {
    in: 'query',
    name: 'name',
    schema: {
      type: 'string',
    },
  },
  {
    in: 'query',
    name: 'email',
    schema: {
      type: 'string',
    },
  },
  {
    in: 'query',
    name: 'phone',
    schema: {
      type: 'string',
    },
  },
  {
    in: 'query',
    name: 'gender',
    description: 'Filter by gender',
    schema: {
      type: 'string',
      enum: Object.values(Gender),
    },
  },
  {
    in: 'query',
    name: 'nik',
    description: 'Filter by National Identification Number (NIK)',
    schema: {
      type: 'string',
    },
  },
  {
    in: 'query',
    name: 'created_by',
    description: 'Filter by creator',
    schema: {
      type: 'string',
    },
  },
  {
    in: 'query',
    name: 'is_deleted',
    description: 'Filter by deletion status',
    schema: {
      type: 'string',
      enum: ['true', 'false'],
      default: 'false',
    },
  },
  {
    in: 'query',
    name: 'page',
    schema: {
      type: 'integer',
      default: 1,
    },
  },
  {
    in: 'query',
    name: 'limit',
    description: 'Number of items per page',
    schema: {
      type: 'integer',
      default: 10,
    },
  },
  {
    in: 'query',
    name: 'sort',
    description: 'Sort by field',
    schema: {
      type: 'string',
      enum: Object.values(GetPatientSortBy),
      default: GetPatientSortBy.CREATED_AT_DESC,
    },
  },
];
