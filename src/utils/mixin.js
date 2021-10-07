export default {
  data() {
    return {
      page: 1,
      pageSize: 50,
      totalCount: 0,
      pageSizeList: [50, 100, 200, 500],
      layout: 'total, sizes, prev, pager, next, jumper'
    };
  }
};
