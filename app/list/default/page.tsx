import ListView from "@/components/ListView";
import { FC } from "react";
import jsonwebtoken from "jsonwebtoken";

if (!process.env.TIPTAP_CLOUD_SECRET) {
  throw new Error("TIPTAP_CLOUD_SECRET is not set");
}
if (!process.env.TIPTAP_CLOUD_APP_ID) {
  throw new Error("TIPTAP_CLOUD_APP_ID is not set");
}

const ListPage: FC = () => {
  const payload = {
    sub: "everybody",
  };
  const jwt = jsonwebtoken.sign(payload, process.env.TIPTAP_CLOUD_SECRET!);

  return <ListView jwt={jwt} appId={process.env.TIPTAP_CLOUD_APP_ID!} />;
};

export default ListPage;
