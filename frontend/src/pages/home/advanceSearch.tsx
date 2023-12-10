import { Button, Form, Layout, message } from "antd";
import { Http } from "api/http";
import IngredientTable from "pages/posts/create-new-post/ingredient-table";
import PostsList from "pages/posts/posts-list";
import { useState } from "react";
import useWindowSize from "utils/useWindowSize";

export default function AdvanceSearch() {
  const [selectedIngredients, setSelectedIngredients] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const windowWidth = useWindowSize();
  const fitPadding = windowWidth < 1000 ? "10px 0" : "10px 100px";
  const [postList, setPostList] = useState([]);

  const getPostByIngredients = async () => {
    try {
      if (selectedIngredients.length === 0) {
        return message.error("At least one ingredient should be selected");
      }

      setLoading(true);

      const queryParams = selectedIngredients.join(",");

      const response = await Http.get(
        `/api/v1/posts/findByIngredients?ingredients=${queryParams}`
      );
      setPostList(response.data.data);
    } catch (error:any) {
      message.error(`${error.message}. Please try again`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout.Content
      style={{
        display: "block",
        padding: fitPadding,
        height: "auto",
      }}
    >
      <Form>
        <Form.Item required name="ingredient">
          <IngredientTable setIngredientSelected={setSelectedIngredients} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={getPostByIngredients} loading={loading}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <PostsList posts={postList} loading={loading} isEnd={false} loadMoreData={undefined} />
    </Layout.Content>
  );
}
