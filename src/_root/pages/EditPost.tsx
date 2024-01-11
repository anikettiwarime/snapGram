import PostForm from "@/components/forms/PostForm";
import { Loader } from "@/components/shared";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";
import { Models } from "appwrite";
import { useTitle } from "@/hooks/useTitle";

const EditPost = () => {
  useTitle("Edit Post");
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");

  if (isPending) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="Add Post"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        <PostForm post={post as Models.Document} action="Update" />
      </div>
    </div>
  );
};

export default EditPost;
