import BlogEditor from "@/components/BlogEditor";
import AuthWrapper from "@/components/AuthWrapper";

const Index = () => {
  return (
    <AuthWrapper>
      <BlogEditor />
    </AuthWrapper>
  );
};

export default Index;
