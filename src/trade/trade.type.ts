export type CreateTradeReq = {
  postID: number;
  price: number;
  buyerID: string;
  buyerName: string;
  sellerID: string;
  sellerName: string;
  from: string;
  to: string;
};
