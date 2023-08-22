export type OrderType =
  | 'asc'
  | 'asc_nulls_first'
  | 'asc_nulls_last'
  | 'desc'
  | 'desc_nulls_first'
  | 'desc_nulls_last';

export type WhereConjunctionType = '_and' | '_or' | '_not';

export type WhereComparisonType =
  | '_eq'
  | '_like'
  | '_ilike'
  | '_regex'
  | '_iregex'
  | '_similar';
