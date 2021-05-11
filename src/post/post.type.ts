export type PostData = {
  title: string;
  content: string;
  price: number;
  categoryID: number;
  userID: string;
  location: string;
};

export type UploadPost = {
  title: string;
  content: string;
  price: number;
  categoryID: number;
  userID: string;
  location: string;
  imgUrls: string[];
};
